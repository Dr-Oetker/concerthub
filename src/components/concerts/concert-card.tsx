import Image from 'next/image'
import { formatDistanceToNow, format } from "date-fns"
import { CalendarDays, MapPin, Music2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ConcertCardProps {
  concert: {
    id: string
    title: string
    artist: string
    date: Date
    venue: string
    city: string
    description: string
    imageUrl?: string | null
    sourceUrl?: string | null
  }
}

export function ConcertCard({ concert }: ConcertCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {concert.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          {concert.imageUrl && (
          <div className="aspect-video w-full overflow-hidden relative">
            <Image
              src={concert.imageUrl}
              alt={concert.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        </div>
      )}
      
      <CardHeader className="border-b bg-muted/50 p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{concert.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{concert.artist}</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-primary" />
            <time dateTime={concert.date.toISOString()}>
              {format(concert.date, "PPP 'at' p")}
            </time>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{concert.venue}, {concert.city}</span>
          </div>
          <p className="pt-2 text-sm text-muted-foreground line-clamp-2">
            {concert.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(concert.date, { addSuffix: true })}
          </span>
          {concert.sourceUrl ? (
            <a 
              href={concert.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="sm">View Details</Button>
            </a>
          ) : (
            <Button size="sm">View Details</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}