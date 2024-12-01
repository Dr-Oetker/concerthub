export interface TicketmasterEvent {
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
      venues: Array<{
        id: string;
        name: string;
        city: {
          name: string;
        };
        location: {
          latitude: string;
          longitude: string;
        };
      }>;
    };
    priceRanges?: Array<{
      min: number;
      max: number;
      currency: string;
    }>;
  }
  
  export interface TicketmasterResponse {
    _embedded: {
      events: TicketmasterEvent[];
    };
    page: {
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    };
  }