import { Prisma } from '@prisma/client'

interface TicketmasterVenue {
  name: string;
  city: {
    name: string;
  };
  location?: {
    latitude: string;
    longitude: string;
  };
}

interface TicketmasterEvent {
  id: string;
  name: string;
  dates: {
    start: {
      dateTime: string;
      localDate: string;
      localTime: string;
    };
  };
  _embedded: {
    venues: TicketmasterVenue[];
    attractions?: Array<{
      name: string;
    }>;
  };
  images?: Array<{
    url: string;
    ratio?: string;
    width?: number;
    height?: number;
  }>;
  description?: string;
}

interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
  page: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export class TicketmasterService {
  static async fetchGermanConcerts(page: number = 0, dateRange?: { startDateTime: string, endDateTime: string }) {
    const API_KEY = process.env.TICKETMASTER_API_KEY
    const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events'

    try {
      let url = `${BASE_URL}?apikey=${API_KEY}&countryCode=DE&classificationName=music&size=100&page=${page}&sort=date,asc&locale=*`
      
      if (dateRange) {
        url += `&startDateTime=${dateRange.startDateTime}&endDateTime=${dateRange.endDateTime}`
      }

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip'
        }
      })

      if (!response.ok) {
        throw new Error(`Ticketmaster API error: ${response.status} - ${response.statusText}`)
      }

      const data: TicketmasterResponse = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching from Ticketmaster:', error)
      throw error
    }
  }

  static transformEvent(event: TicketmasterEvent) {
    const venue = event._embedded.venues[0]
    const artist = event._embedded.attractions?.[0]?.name || event.name.split(' - ')[0]
    
    // Get the best image (prefer 16:9 ratio if available)
    const image = event.images?.find(img => img.ratio === '16_9') || event.images?.[0]
    
    // Transform coordinates to Prisma-compatible JSON
    let coordinates = null
    if (venue.location) {
      coordinates = {
        latitude: parseFloat(venue.location.latitude),
        longitude: parseFloat(venue.location.longitude)
      }
    }

    return {
      externalId: event.id,
      title: event.name,
      artist: artist,
      date: new Date(event.dates.start.dateTime),
      venue: venue.name,
      city: venue.city.name,
      description: event.description || `Live in concert at ${venue.name}`,
      imageUrl: image?.url || null,
      coordinates: coordinates as Prisma.JsonValue,
      source: 'ticketmaster' as const,
      sourceUrl: `https://www.ticketmaster.de/event/${event.id}`
    }
  }
}