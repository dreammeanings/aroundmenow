export interface Event {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  coverImageUrl?: string;
  venue?: Venue;
  venue_name?: string;
  date: Date;
  start_date?: string;
  end_date?: string;
  time?: string;
  start_time?: string;
  end_time?: string;
  timezone?: string;
  price: number;
  priceRange?: string;
  currency?: string;
  ticketUrl?: string;
  tags?: string[];
  eventTypes?: string[];
  vibe?: string[];
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  isFeatured?: boolean;
  isTrending?: boolean;
  isLocalCurated?: boolean;
  isWeekendPreview?: boolean;
  trendingScore?: number;
  capacity?: number;
  currentAttendees?: number;
  isSoldOut?: boolean;
  friendsAttending?: string[];
  totalSaves?: number;
  totalShares?: number;
  totalViews?: number;
  status?: string;
  isActive?: boolean;
  isSaved?: boolean;
  distance?: number;
  attendees?: number;
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  venueType?: string;
  website?: string;
  logo?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  tier?: string;
  events?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  phonePrivacy?: boolean;
  bio?: string;
  userType?: 'user' | 'venue'; // Add userType for navigation
  avatar?: string;
  memberSince: string;
  preferences: {
    radius: number;
    defaultRadius: number;
    eventTypes: string[];
    vibe: string[];
    priceRange: string[];
    preferredVibe: string;
    // Location Settings
    locationEnabled?: boolean;
    locationPrecision?: string;
    // Privacy Settings
    profileVisibility?: string;
    dataSharing?: boolean;
    analyticsEnabled?: boolean;
    // Security Settings
    twoFactorAuth?: boolean;
    loginNotifications?: boolean;
  };
  notificationSettings: {
    push: boolean;
    email: boolean;
    weeklyDigest: boolean;
    calendarSync?: boolean;
  };
  subscription: {
    tier: string;
    price: number;
  };
  savedEvents: string[];
}

export interface FilterOptions {
  dateRange: 'today' | 'tomorrow' | 'weekend' | 'custom';
  customDateRange?: {
    start: Date;
    end: Date;
  };
  priceRange: string[];
  distance: number; // 0-100 miles
  eventTypes: string[];
  vibe: string[];
  place?: string; // Location/place filter
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface EventType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface VibeType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Analytics Types
export interface AnalyticsEvent {
  type: string;
  userId: string;
  eventId?: string;
  properties: Record<string, any>;
  timestamp?: string;
}

export interface UserMetrics {
  totalEventsViewed: number;
  totalEventsSaved: number;
  totalEventsShared: number;
  totalCalendarAdds: number;
  averageSessionDuration: number;
  mostViewedEventType: string;
  favoriteVenue: string;
}

export interface VenueMetrics {
  venueId: string;
  totalViews: number;
  totalSaves: number;
  totalShares: number;
  totalCalendarAdds: number;
  averageRating: number;
  topEventType: string;
  conversionRate: number;
}

export interface AppMetrics {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  totalVenues: number;
  averageEventsPerUser: number;
  retentionRate: number;
}

export interface EventAnalytics {
  eventId: string;
  totalViews: number;
  totalSaves: number;
  totalShares: number;
  totalCalendarAdds: number;
  uniqueViewers: number;
  averageViewDuration: number;
  topReferralSource: string;
}
