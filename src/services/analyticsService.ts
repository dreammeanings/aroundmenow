import { AnalyticsEvent, UserMetrics, VenueMetrics, AppMetrics, EventAnalytics } from '../types';

class AnalyticsService {
  private eventQueue: AnalyticsEvent[] = [];
  private isInitialized = false;
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  async initialize(): Promise<void> {
    try {
      this.isInitialized = true;
      console.log('Analytics service initialized');
      
      // Start periodic flushing
      setInterval(() => {
        this.flushEvents();
      }, this.flushInterval);
      
    } catch (error) {
      console.error('Failed to initialize analytics service:', error);
    }
  }

  public track(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      console.warn('Analytics service not initialized');
      return;
    }

    this.eventQueue.push({
      ...event,
      timestamp: new Date().toISOString(),
    });

    // Flush if queue is full
    if (this.eventQueue.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  // User Engagement Tracking
  trackEventView(eventId: string, eventTitle: string): void {
    this.track({
      type: 'event_view',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
        source: 'discover_screen',
      },
    });
  }

  trackEventSave(eventId: string, eventTitle: string, isSaved: boolean): void {
    this.track({
      type: 'event_save',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
        action: isSaved ? 'saved' : 'unsaved',
        source: 'event_card',
      },
    });
  }

  trackEventShare(eventId: string, eventTitle: string, platform: string): void {
    this.track({
      type: 'event_share',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
        platform,
        source: 'event_detail',
      },
    });
  }

  trackEventDetailView(eventId: string, eventTitle: string): void {
    this.track({
      type: 'event_detail_view',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
        source: 'event_card',
      },
    });
  }

  trackCalendarAdd(eventId: string, eventTitle: string): void {
    this.track({
      type: 'calendar_add',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
        source: 'event_detail',
      },
    });
  }

  // Map and location tracking
  trackMapView(): void {
    this.track({
      type: 'map_view',
      userId: 'user-123',
      properties: {
        screen: 'MapScreen',
      },
    });
  }

  trackMapMarkerTap(eventId: string, eventTitle: string): void {
    this.track({
      type: 'map_marker_tap',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
        screen: 'MapScreen',
      },
    });
  }

  // Friends activity tracking
  trackFriendsActivityView(): void {
    this.track({
      type: 'friends_activity_view',
      userId: 'user-123',
      properties: {
        screen: 'DiscoverScreen',
        section: 'friends_activity',
      },
    });
  }

  trackFriendEventSave(eventId: string, eventTitle: string): void {
    this.track({
      type: 'friend_event_save',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
        screen: 'DiscoverScreen',
        section: 'friends_activity',
      },
    });
  }

  // Search tracking
  trackSearch(query: string, resultsCount: number): void {
    this.track({
      type: 'search',
      userId: 'user-123',
      properties: {
        query,
        resultsCount,
        screen: 'DiscoverScreen',
      },
    });
  }

  // Filter tracking
  trackFilterApply(filters: any): void {
    this.track({
      type: 'filter_apply',
      userId: 'user-123',
      properties: {
        filters,
        screen: 'DiscoverScreen',
      },
    });
  }

  // Tab switching tracking
  trackTabSwitch(tabName: string): void {
    this.track({
      type: 'tab_switch',
      userId: 'user-123',
      properties: {
        tabName,
      },
    });
  }

  // Venue tracking
  trackVenueView(venueId: string, venueName: string): void {
    this.track({
      type: 'venue_view',
      userId: 'user-123',
      properties: {
        venueId,
        venueName,
      },
    });
  }

  trackVenueWebsiteClick(venueId: string, venueName: string): void {
    this.track({
      type: 'venue_website_click',
      userId: 'user-123',
      properties: {
        venueId,
        venueName,
      },
    });
  }

  // Directions tracking
  trackDirectionsRequest(eventId: string, eventTitle: string): void {
    this.track({
      type: 'directions_request',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
      },
    });
  }

  // Ticket purchase tracking
  trackTicketPurchase(eventId: string, eventTitle: string, price: number): void {
    this.track({
      type: 'ticket_purchase',
      userId: 'user-123',
      eventId,
      properties: {
        eventTitle,
        price,
      },
    });
  }

  // Screen view tracking
  trackScreenView(screenName: string): void {
    this.track({
      type: 'screen_view',
      userId: 'user-123',
      properties: {
        screenName,
      },
    });
  }

  // Error tracking
  trackError(errorType: string, errorMessage: string): void {
    this.track({
      type: 'error',
      userId: 'user-123',
      properties: {
        errorType,
        errorMessage,
      },
    });
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      const eventsToFlush = [...this.eventQueue];
      this.eventQueue = [];

      // Log events for development (in production, this would send to analytics service)
      console.log('Analytics Events Flushed:', eventsToFlush);
      
      // Simulate API call
      await this.sendToAnalyticsService(eventsToFlush);
      
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...this.eventQueue);
    }
  }

  private async sendToAnalyticsService(events: AnalyticsEvent[]): Promise<void> {
    // Simulate API call to analytics service
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sent ${events.length} events to analytics service`);
        resolve();
      }, 100);
    });
  }

  // Get analytics data for dashboard
  async getUserMetrics(): Promise<UserMetrics> {
    return {
      totalEventsViewed: 150,
      totalEventsSaved: 25,
      totalEventsShared: 8,
      totalCalendarAdds: 12,
      averageSessionDuration: 15.5,
      mostViewedEventType: 'music',
      favoriteVenue: 'The Blue Note',
    };
  }

  async getVenueMetrics(venueId: string): Promise<VenueMetrics> {
    return {
      venueId,
      totalViews: 1200,
      totalSaves: 180,
      totalShares: 45,
      totalCalendarAdds: 60,
      averageRating: 4.2,
      topEventType: 'music',
      conversionRate: 0.15,
    };
  }

  async getAppMetrics(): Promise<AppMetrics> {
    return {
      totalUsers: 5000,
      activeUsers: 1200,
      totalEvents: 250,
      totalVenues: 45,
      averageEventsPerUser: 3.2,
      retentionRate: 0.75,
    };
  }

  async getEventAnalytics(eventId: string): Promise<EventAnalytics> {
    return {
      eventId,
      totalViews: 450,
      totalSaves: 67,
      totalShares: 23,
      totalCalendarAdds: 34,
      uniqueViewers: 380,
      averageViewDuration: 45.2,
      topReferralSource: 'discover_screen',
    };
  }
}

export const analyticsService = new AnalyticsService(); 