import { Event, FilterOptions } from '../types';
import { apiService } from './apiService';

class EventService {
  private events: Event[] = [];
  private isLoading = false;
  private currentFilters: FilterOptions | null = null;

  async getEvents(filters?: FilterOptions, page: number = 1, limit: number = 20): Promise<Event[]> {
    try {
      this.isLoading = true;
      this.currentFilters = filters || null;
      
      const response = await apiService.getEvents(filters, page, limit);
      this.events = response.events || [];
      
      return this.events;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to mock data if API fails
      const { mockEvents } = await import('./mockData');
      return mockEvents;
    } finally {
      this.isLoading = false;
    }
  }

  async getEvent(id: string): Promise<Event | null> {
    try {
      const response = await apiService.getEvent(id);
      return response.event || null;
    } catch (error) {
      console.error('Error fetching event:', error);
      // Fallback to mock data if API fails
      const { mockEvents } = await import('./mockData');
      return mockEvents.find(event => event.id === id) || null;
    }
  }

  async saveEvent(eventId: string): Promise<boolean> {
    try {
      console.log('🔍 EventService: Saving event:', eventId);
      const response = await apiService.saveEvent(eventId);
      console.log('🔍 EventService: Save response:', response);
      
      // Update local state
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        event.isSaved = true;
        event.totalSaves = (event.totalSaves || 0) + 1;
        console.log('🔍 EventService: Updated local event state');
      }
      return true;
    } catch (error) {
      console.error('❌ EventService: Error saving event:', error);
      return false;
    }
  }

  async unsaveEvent(eventId: string): Promise<boolean> {
    try {
      console.log('🔍 EventService: Unsaving event:', eventId);
      const response = await apiService.unsaveEvent(eventId);
      console.log('🔍 EventService: Unsave response:', response);
      
      // Update local state
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        event.isSaved = false;
        event.totalSaves = Math.max(0, (event.totalSaves || 0) - 1);
        console.log('🔍 EventService: Updated local event state');
      }
      return true;
    } catch (error) {
      console.error('❌ EventService: Error unsaving event:', error);
      return false;
    }
  }

  async getSavedEvents(): Promise<Event[]> {
    try {
      const response = await apiService.getSavedEvents();
      return response.events || [];
    } catch (error) {
      console.error('Error fetching saved events:', error);
      // Fallback to mock data if API fails
      const { mockEvents } = await import('./mockData');
      // Return events that have isSaved: true
      return mockEvents.filter(event => event.isSaved === true);
    }
  }

  async getVenueEvents(venueId: string): Promise<Event[]> {
    try {
      const response = await apiService.getVenueEvents(venueId);
      return response.events || [];
    } catch (error) {
      console.error('Error fetching venue events:', error);
      return [];
    }
  }

  async searchEvents(query: string, filters?: FilterOptions): Promise<Event[]> {
    try {
      // Add search query to filters
      const searchFilters: FilterOptions = {
        dateRange: 'today', // Default value
        priceRange: [],
        distance: 25,
        eventTypes: [],
        vibe: [],
        ...filters,
        // Note: Backend API might need to be updated to handle search parameter
      };
      
      const response = await apiService.getEvents(searchFilters);
      return response.events || [];
    } catch (error) {
      console.error('Error searching events:', error);
      // Fallback to mock data if API fails
      const { mockEvents } = await import('./mockData');
      return mockEvents.filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(query.toLowerCase())) ||
        (event.venue_name && event.venue_name.toLowerCase().includes(query.toLowerCase()))
      );
    }
  }

  async trackEventView(eventId: string, eventTitle: string): Promise<void> {
    try {
      await apiService.trackEventView(eventId, eventTitle);
    } catch (error) {
      console.error('Error tracking event view:', error);
    }
  }

  async trackEventSave(eventId: string, eventTitle: string, isSaving: boolean): Promise<void> {
    try {
      await apiService.trackEventSave(eventId, eventTitle, isSaving);
    } catch (error) {
      console.error('Error tracking event save:', error);
    }
  }

  getCurrentEvents(): Event[] {
    return this.events;
  }

  getCurrentFilters(): FilterOptions | null {
    return this.currentFilters;
  }

  isLoadingEvents(): boolean {
    return this.isLoading;
  }

  // Helper method to filter events locally (for offline mode)
  filterEvents(events: Event[], filters: FilterOptions): Event[] {
    let filtered = [...events];

    // Filter by price range
    if (filters.priceRange && filters.priceRange.length > 0) {
      filtered = filtered.filter(event => 
        event.priceRange && filters.priceRange!.includes(event.priceRange)
      );
    }

    // Filter by event types
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      filtered = filtered.filter(event => 
        event.eventTypes && event.eventTypes.some(type => filters.eventTypes!.includes(type))
      );
    }

    // Filter by vibe
    if (filters.vibe && filters.vibe.length > 0) {
      filtered = filtered.filter(event =>
        event.vibe && event.vibe.some(vibe => filters.vibe!.includes(vibe))
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      const futureDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          futureDate.setDate(now.getDate() + 1);
          break;
        case 'tomorrow':
          futureDate.setDate(now.getDate() + 2);
          break;
        case 'weekend':
          // Find next Saturday
          const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
          futureDate.setDate(now.getDate() + daysUntilSaturday + 2); // Saturday + Sunday
          break;
        case 'custom':
          if (filters.customDateRange) {
            futureDate.setTime(filters.customDateRange.end.getTime());
          }
          break;
      }
      
      filtered = filtered.filter(event => {
        const eventDate = event.start_date ? new Date(event.start_date) : new Date(event.date);
        return eventDate >= now && eventDate <= futureDate;
      });
    }

    return filtered;
  }
}

export const eventService = new EventService(); 