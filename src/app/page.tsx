import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { ConcertCard } from "@/components/concerts/concert-card"
import { LoadMoreButton } from "@/components/concerts/load-more-button"

async function getConcerts(page: number = 1, pageSize: number = 5) {
  try {
    const take = page * pageSize;
    
    console.log('Fetching concerts with params:', { page, take }) // Debug log

    const total = await prisma.concert.count({
      where: {
        date: {
          gte: new Date()
        }
      }
    })

    console.log('Total concerts found:', total) // Debug log

    const concerts = await prisma.concert.findMany({
      where: {
        date: {
          gte: new Date()
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: take,
      skip: 0
    })

    console.log('Fetched concerts:', concerts.length) // Debug log

    return {
      concerts,
      hasMore: concerts.length < total,
      total
    }
  } catch (error) {
    console.error('Error fetching concerts:', error)
    return {
      concerts: [],
      hasMore: false,
      total: 0
    }
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const { concerts, hasMore, total } = await getConcerts(currentPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Upcoming Concerts
          </h2>
          <p className="text-muted-foreground">
            {concerts.length > 0 
              ? `Showing ${concerts.length} of ${total} upcoming concerts`
              : 'No upcoming concerts found'}
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {concerts.map((concert) => (
            <Suspense key={concert.id} fallback={<div>Loading...</div>}>
              <ConcertCard concert={{
                ...concert,
                date: new Date(concert.date),
              }} />
            </Suspense>
          ))}
        </div>

        {hasMore && (
          <div className="flex flex-col items-center gap-2 pt-8">
            <LoadMoreButton currentPage={currentPage} />
          </div>
        )}

        {!hasMore && concerts.length > 0 && (
          <p className="text-center text-muted-foreground pt-8">
            You&apos;ve reached the end of the list
          </p>
        )}

        {concerts.length === 0 && (
          <p className="text-center text-muted-foreground">
            No concerts found in the database
          </p>
        )}
      </section>
    </div>
  )
}