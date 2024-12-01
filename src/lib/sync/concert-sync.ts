import { prisma } from "@/lib/prisma"
import { TicketmasterService } from "@/lib/services/ticketmaster"

export async function syncConcerts() {
  console.log('Starting concert synchronization...')
  const startTime = Date.now()
  let totalProcessed = 0
  let totalAdded = 0
  let totalUpdated = 0

  try {
    // Fetch first page to get total pages
    const firstPage = await TicketmasterService.fetchGermanConcerts(0)
    const totalPages = firstPage.page.totalPages

    // Process all pages
    for (let page = 0; page < totalPages; page++) {
      const response = page === 0 ? firstPage : await TicketmasterService.fetchGermanConcerts(page)
      const events = response._embedded.events

      for (const event of events) {
        totalProcessed++
        const transformedEvent = TicketmasterService.transformEvent(event)

        // Check if concert already exists
        const existingConcert = await prisma.concert.findFirst({
          where: {
            externalId: transformedEvent.externalId,
            source: 'ticketmaster'
          }
        })

        if (existingConcert) {
          // Update existing concert
          await prisma.concert.update({
            where: { id: existingConcert.id },
            data: transformedEvent
          })
          totalUpdated++
        } else {
          // Create new concert
          await prisma.concert.create({
            data: transformedEvent
          })
          totalAdded++
        }
      }

      console.log(`Processed page ${page + 1} of ${totalPages}`)
    }

    const duration = (Date.now() - startTime) / 1000
    console.log(`
      Sync completed in ${duration}s
      Total processed: ${totalProcessed}
      New concerts: ${totalAdded}
      Updated concerts: ${totalUpdated}
    `)

  } catch (error) {
    console.error('Error during sync:', error)
    throw error
  }
}