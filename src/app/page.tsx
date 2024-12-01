import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { ConcertCard } from "@/components/concerts/concert-card"
import { LoadMoreButton } from "@/components/concerts/load-more-button"
import { formatDistanceToNow } from "date-fns"

async function getConcerts(page: number = 1, pageSize: number = 5) {
  try {
    // Calculate how many concerts to fetch (page * pageSize gives us accumulated amount)
    const take = page * pageSize;
    
    const total = await prisma.concert.count({
      where: {
        date: {
          gte: new Date() // Only future concerts
        }
      }
    });

    const concerts = await prisma.concert.findMany({
      where: {
        date: {
          gte: new Date() // Only future concerts
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: take,
      skip: 0 // Always start from beginning as we're accumulating
    });

    console.log(`Found ${concerts.length} concerts out of ${total} total`);

    return {
      concerts,
      hasMore: concerts.length < total,
      total
    };
  } catch (error) {
    console.error('Error fetching concerts:', error);
    return {
      concerts: [],
      hasMore: false,
      total: 0
    };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { concerts, hasMore, total } = await getConcerts(currentPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Upcoming Concerts
          </h2>
          <p className="text-muted-foreground">
            Showing {concerts.length} of {total} upcoming concerts
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {concerts.map((concert) => (
            <Suspense key={concert.id} fallback={<div>Loading...</div>}>
              <div className="concert-card">
                <ConcertCard concert={{
                  ...concert,
                  date: new Date(concert.date), // Ensure date is properly converted
                }} />
              </div>
            </Suspense>
          ))}
        </div>

        {hasMore && (
          <div className="flex flex-col items-center gap-2 pt-8">
            <LoadMoreButton currentPage={currentPage} />
          </div>
        )}

        {!hasMore && concerts.length > 0 && (
          <p className="text-muted-foreground">
            You&apos;ve reached the end of the list
          </p>
        )}

        {concerts.length === 0 && (
          <p className="text-center text-muted-foreground">
            No upcoming concerts found
          </p>
        )}
      </section>
    </div>
  )
}