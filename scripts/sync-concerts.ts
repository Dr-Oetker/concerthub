import { PrismaClient, Prisma } from '@prisma/client'
import { TicketmasterService } from '../src/lib/services/ticketmaster'
import { addMonths, startOfMonth, endOfMonth, format } from 'date-fns'

const prisma = new PrismaClient()

// Rate limiting helper
async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getDateRanges() {
  const ranges = []
  const startDate = new Date()
  const endDate = addMonths(startDate, 12)
  
  let currentDate = startOfMonth(startDate)
  
  while (currentDate < endDate) {
    ranges.push({
      startDateTime: format(startOfMonth(currentDate), "yyyy-MM-dd'T'00:00:00'Z'"),
      endDateTime: format(endOfMonth(currentDate), "yyyy-MM-dd'T'23:59:59'Z'")
    })
    currentDate = addMonths(currentDate, 1)
  }
  
  return ranges
}

async function syncConcerts() {
  console.log('Starting concert synchronization...')
  const startTime = Date.now()
  let totalProcessed = 0
  let totalAdded = 0
  let totalUpdated = 0
  let totalErrors = 0

  try {
    const dateRanges = await getDateRanges()
    console.log(`Will process ${dateRanges.length} months`)

    for (const dateRange of dateRanges) {
      console.log(`\nProcessing concerts for: ${format(new Date(dateRange.startDateTime), 'MMMM yyyy')}`)
      
      try {
        // Wait between date ranges
        await wait(1000)

        const firstPage = await TicketmasterService.fetchGermanConcerts(0, dateRange)
        
        // If no events found, skip this date range
        if (!firstPage._embedded?.events) {
          console.log('No events found for this date range')
          continue
        }

        const totalPages = Math.min(firstPage.page.totalPages, 5) // Limit pages per month
        console.log(`Found ${firstPage._embedded.events.length} events on first page, total pages: ${totalPages}`)

        for (let page = 0; page < totalPages; page++) {
          console.log(`Processing page ${page + 1} of ${totalPages}`)
          
          try {
            // Wait between pages to respect rate limits
            if (page > 0) await wait(1000)

            const response = page === 0 ? firstPage : 
              await TicketmasterService.fetchGermanConcerts(page, dateRange)
            
            if (!response._embedded?.events) {
              console.log('No events found on this page')
              continue
            }

            const events = response._embedded.events

            for (const event of events) {
              try {
                totalProcessed++
                const transformedEvent = TicketmasterService.transformEvent(event)

                // Wait a bit between database operations
                await wait(100)

                const existingConcert = await prisma.concert.findFirst({
                  where: {
                    externalId: transformedEvent.externalId,
                    source: 'ticketmaster'
                  }
                })

                const concertData = {
                  title: transformedEvent.title,
                  artist: transformedEvent.artist,
                  date: transformedEvent.date,
                  venue: transformedEvent.venue,
                  city: transformedEvent.city,
                  description: transformedEvent.description,
                  imageUrl: transformedEvent.imageUrl,
                  coordinates: transformedEvent.coordinates 
                    ? (transformedEvent.coordinates as Prisma.InputJsonValue)
                    : Prisma.JsonNull,
                  source: transformedEvent.source,
                  sourceUrl: transformedEvent.sourceUrl,
                  externalId: transformedEvent.externalId,
                }

                if (existingConcert) {
                  await prisma.concert.update({
                    where: { id: existingConcert.id },
                    data: concertData
                  })
                  totalUpdated++
                  console.log(`Updated: ${transformedEvent.title}`)
                } else {
                  await prisma.concert.create({
                    data: concertData
                  })
                  totalAdded++
                  console.log(`Added: ${transformedEvent.title}`)
                }
              } catch (eventError) {
                totalErrors++
                console.error(`Error processing event:`, eventError)
                await wait(2000) // Wait longer after an error
              }
            }
          } catch (pageError) {
            console.error(`Error processing page ${page + 1}:`, pageError)
            await wait(5000) // Wait even longer after a page error
          }
        }
      } catch (rangeError) {
        console.error(`Error processing date range:`, rangeError)
        await wait(10000) // Wait much longer after a range error
      }
    }

    // Remove old concerts
    const removedCount = await prisma.concert.deleteMany({
      where: {
        date: {
          lt: new Date()
        },
        source: 'ticketmaster'
      }
    })

    const duration = (Date.now() - startTime) / 1000
    console.log(`
Sync Summary:
------------
Duration: ${duration} seconds
Total Processed: ${totalProcessed} concerts
New Concerts: ${totalAdded}
Updated Concerts: ${totalUpdated}
Removed Past Concerts: ${removedCount.count}
Errors: ${totalErrors}
    `)

  } catch (error) {
    console.error('Fatal error during sync:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

syncConcerts()
  .catch((error) => {
    console.error('Sync failed:', error)
    process.exit(1)
  })