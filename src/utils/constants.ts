import { EventType, VibeType } from '../types';

export const COLORS = {
  // Primary Brand Colors - Energetic but Approachable
  primary: '#FF6B9D', // Soft Hot Pink - Friendly & Exciting
  secondary: '#4ECDC4', // Turquoise - Fresh & Trustworthy
  accent: '#FFD93D', // Warm Yellow - Joyful & Accessible
  
  // Background Colors - Comfortable & Easy on Eyes
  background: '#1A1A2E', // Deep Navy - Sophisticated but not harsh
  surface: '#16213E', // Rich Blue - Cozy & Welcoming
  cardBackground: '#0F3460', // Deep Blue - Elevated but gentle
  
  // Text Colors - High Contrast & Readable for All Ages
  text: '#FFFFFF', // Pure White - Crystal clear
  textSecondary: '#E8E8E8', // Soft White - Easy on eyes
  textLight: '#B8B8B8', // Light Gray - Gentle & readable
  
  // Interactive Elements - Friendly & Clear
  success: '#4CAF50', // Soft Green - Positive & Encouraging
  warning: '#FF9800', // Warm Orange - Friendly & Approachable
  error: '#F44336', // Soft Red - Clear but not harsh
  info: '#2196F3', // Friendly Blue - Trustworthy & Clear
  
  // Universal Accent Colors - For All Ages
  purple: '#9C27B0', // Soft Purple - Creative & Unique
  pink: '#E91E63', // Soft Pink - Playful & Fun
  orange: '#FF5722', // Warm Orange - Energetic & Social
  teal: '#009688', // Rich Teal - Sophisticated & Fresh
  
  // Utility Colors - Gentle & Accessible
  border: '#2D3748', // Soft Border - Gentle separation
  gray: '#718096', // Medium Gray - Neutral & readable
  white: '#FFFFFF', // Pure White
  lightGray: '#2D3748', // Dark Gray - Subtle backgrounds
  black: '#1A202C', // Deep Black - Strong contrast when needed
  
  // Gradient Colors for Special Effects - Welcoming
  gradientStart: '#FF6B9D', // Soft Hot Pink
  gradientEnd: '#4ECDC4', // Turquoise
  sunsetStart: '#FF6B9D', // Soft Hot Pink
  sunsetEnd: '#FFD93D', // Warm Yellow
  oceanStart: '#4ECDC4', // Turquoise
  oceanEnd: '#009688', // Rich Teal
  
  // Universal Colors - For Everyone
  neonPink: '#FF6B9D', // Soft Pink
  neonCyan: '#4ECDC4', // Turquoise
  neonGreen: '#4CAF50', // Soft Green
  neonOrange: '#FF9800', // Warm Orange
  neonPurple: '#9C27B0', // Soft Purple
  gold: '#FFD93D', // Warm Gold
  silver: '#C0C0C0', // Metallic Silver
  darkPurple: '#6B46C1', // Deep Purple
  midnightBlue: '#2C3E50', // Deep Blue
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// Hyperlocal Focus - Competitive Advantage
export const LOCAL_FEATURES = {
  // Start in one town and go deep
  currentCity: 'Aspen',
  currentRegion: 'Roaring Fork Valley',
  localRadius: 25, // miles
  personalOutreach: true,
  curatedEvents: true,
  realRelationships: true,
};

// Simplicity for Users - Competitive Advantage
export const USER_EXPERIENCE = {
  noAccountRequired: true,
  minimalTaps: true,
  instantValue: true,
  naturalFilters: true,
  smartDefaults: true,
};

// Built for Venues - Competitive Advantage
export const VENUE_FEATURES = {
  googleCalendarSync: true,
  thirtySecondPost: true,
  marketingTool: true,
  noPlatformChange: true,
  exposureFocus: true,
};

// Smart Feed - Competitive Advantage
export const SMART_FEED = {
  trendingLogic: true,
  localCurated: true,
  vibeMatching: true,
  distanceOptimized: true,
  personalizedDiscovery: true,
};

// Social Proof - Competitive Advantage
export const SOCIAL_FEATURES = {
  friendActivity: true,
  subtleViral: true,
  calendarSync: true,
  noFacebookTie: true,
  privacyFocused: true,
};

// Weekend Preview - Competitive Advantage
export const WEEKEND_PREVIEW = {
  thursdayPush: true,
  curatedPicks: true,
  ritualHabit: true,
  friendLikeFeel: true,
  locationBased: true,
};

// Monetization Strategy - Competitive Advantage
export const MONETIZATION = {
  noTicketCompetition: true,
  trafficDriver: true,
  exposureFocus: true,
  venueEnhancement: true,
  frictionless: true,
};

export const EVENT_TYPES: EventType[] = [
  { id: 'music', name: 'Music', icon: 'musical-notes', color: '#FF6B6B' },
  { id: 'food', name: 'Food & Drink', icon: 'restaurant', color: '#4ECDC4' },
  { id: 'nightlife', name: 'Nightlife', icon: 'moon', color: '#45B7D1' },
  { id: 'wellness', name: 'Wellness', icon: 'fitness', color: '#96CEB4' },
  { id: 'art', name: 'Art & Culture', icon: 'color-palette', color: '#DDA0DD' },
  { id: 'outdoor', name: 'Outdoor', icon: 'leaf', color: '#A8E6CF' },
  { id: 'sports', name: 'Sports', icon: 'football', color: '#FFEAA7' },
  { id: 'networking', name: 'Networking', icon: 'people', color: '#98D8C8' },
  { id: 'family', name: 'Family', icon: 'home', color: '#F7DC6F' },
  { id: 'tech', name: 'Tech', icon: 'laptop', color: '#FFB347' },
  { id: 'business', name: 'Business', icon: 'briefcase', color: '#87CEEB' },
  { id: 'education', name: 'Education', icon: 'school', color: '#DDA0DD' },
];

export const VIBE_TYPES: VibeType[] = [
  { id: 'casual', name: 'Casual', icon: 'shirt-outline', color: '#FF6B6B' },
  { id: 'dressy', name: 'Dressy', icon: 'shirt', color: '#4ECDC4' },
  { id: 'outdoors', name: 'Outdoors', icon: 'leaf-outline', color: '#45B7D1' },
  { id: 'indoors', name: 'Indoors', icon: 'home-outline', color: '#96CEB4' },
  { id: 'dog-friendly', name: 'Dog-Friendly', icon: 'paw-outline', color: '#FFEAA7' },
  { id: 'kid-friendly', name: 'Kid-Friendly', icon: 'happy-outline', color: '#DDA0DD' },
  { id: 'romantic', name: 'Romantic', icon: 'heart-outline', color: '#98D8C8' },
  { id: 'energetic', name: 'Energetic', icon: 'flash-outline', color: '#F7DC6F' },
  { id: 'chill', name: 'Chill', icon: 'cafe-outline', color: '#A8E6CF' },
  { id: 'luxury', name: 'Luxury', icon: 'diamond-outline', color: '#87CEEB' },
  { id: 'budget', name: 'Budget-Friendly', icon: 'wallet-outline', color: '#DDA0DD' },
  { id: 'exclusive', name: 'Exclusive', icon: 'star-outline', color: '#FFB347' },
];

export const PRICE_RANGES = [
  { label: 'Free', value: 'Free', icon: 'gift-outline' },
  { label: '$', value: '$', icon: 'cash-outline' },
  { label: '$$', value: '$$', icon: 'card-outline' },
  { label: '$$$', value: '$$$', icon: 'diamond-outline' },
];

export const DATE_RANGES = [
  { label: 'Today', value: 'today', icon: 'today-outline' },
  { label: 'Tomorrow', value: 'tomorrow', icon: 'calendar-outline' },
  { label: 'This Weekend', value: 'weekend', icon: 'sunny-outline' },
  { label: 'Next Week', value: 'next-week', icon: 'calendar-clear-outline' },
  { label: 'Custom Range', value: 'custom', icon: 'calendar-number-outline' },
];

export const DISTANCE_OPTIONS = [
  { label: '5 miles', value: 5 },
  { label: '10 miles', value: 10 },
  { label: '25 miles', value: 25 },
  { label: '50 miles', value: 50 },
];

export const VENUE_TIERS = {
  Free: {
    price: 0,
    eventsPerMonth: 2,
    features: ['Basic listing', 'Event discovery'],
    limitations: ['No analytics', 'No featured placement'],
  },
  Lite: {
    price: 19,
    eventsPerMonth: 'Unlimited',
    features: [
      'Unlimited events',
      'Google Calendar sync',
      '3 images per event',
      'Website & social links',
      'Basic analytics',
    ],
    limitations: ['No ticket links', 'No featured placement'],
  },
  Pro: {
    price: 49,
    eventsPerMonth: 'Unlimited',
    features: [
      'Everything in Lite',
      'Ticket links',
      'Featured listings',
      'Advanced analytics',
      'Priority support',
    ],
    limitations: ['No push notifications', 'No RSVP management'],
  },
  Elite: {
    price: 99,
    eventsPerMonth: 'Unlimited',
    features: [
      'Everything in Pro',
      'Push notifications',
      'RSVP management',
      'Front-page carousel',
      'Dedicated account manager',
    ],
    limitations: ['None'],
  },
}; 