import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { ConcertCard } from "@/components/concerts/concert-card"

async function getConcerts() {
  try {
    const concerts = await prisma.concert.findMany({
      orderBy: {
        date: 'asc'
      }
    })
    console.log('Found concerts:', concerts.length) // Debug log
    return concerts
  } catch (error) {
    console.error('Error fetching concerts:', error)
    return []
  }
}

export default async function HomePage() {
  const concerts = await getConcerts()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Upcoming Concerts
          </h2>
          <p className="text-muted-foreground">
            Discover and book tickets for the best concerts near you
          </p>
        </div>
        
        {concerts.length === 0 ? (
          <p className="text-muted-foreground">No concerts found. Check back later!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {concerts.map((concert) => (
              <Suspense key={concert.id} fallback={<div>Loading...</div>}>
                <ConcertCard concert={concert} />
              </Suspense>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}