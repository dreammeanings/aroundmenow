import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Share,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import { analyticsService } from '../services/analyticsService';
import { calendarService, CalendarEvent } from '../services/calendarService';

const { width } = Dimensions.get('window');

interface EventCardProps {
  event: Event;
  onToggleSaved: () => void;
  onPress: () => void;
}

export default function EventCard({ event, onToggleSaved, onPress }: EventCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScaleAnim = useRef(new Animated.Value(1)).current;

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice === 0) return 'Free';
    return `$${numPrice}`;
  };

  const getEventTypeIcon = (tags: string[]): any => {
    const typeMap: { [key: string]: any } = {
      music: 'musical-notes',
      food: 'restaurant',
      wellness: 'leaf',
      tech: 'laptop',
      art: 'color-palette',
      outdoor: 'sunny',
      nightlife: 'moon',
      family: 'people',
      networking: 'people-circle',
      comedy: 'happy',
      yoga: 'fitness',
      workshop: 'school',
      festival: 'calendar',
      gallery: 'images',
      jazz: 'musical-note',
      photography: 'camera',
      games: 'game-controller',
      meditation: 'heart',
      cocktails: 'wine',
      business: 'briefcase',
      live: 'radio',
      performance: 'mic',
      market: 'bag',
      fair: 'gift',
      seminar: 'library',
    };

    for (const tag of tags) {
      if (typeMap[tag]) {
        return typeMap[tag];
      }
    }
    return 'calendar';
  };

  const getPriceColor = (priceRange: string): string => {
    switch (priceRange) {
      case 'Free': return COLORS.success;
      case '$': return COLORS.primary;
      case '$$': return COLORS.warning;
      case '$$$': return COLORS.error;
      default: return COLORS.primary;
    }
  };

  const getVenueName = (): string => {
    if (event.venue?.name) return event.venue.name;
    if (event.venue_name) return event.venue_name;
    return 'Venue TBA';
  };

  const getEventDate = (): Date => {
    if (event.date) return typeof event.date === 'string' ? new Date(event.date) : event.date;
    if (event.start_date) return new Date(event.start_date);
    return new Date();
  };

  const getEventTime = (): string => {
    if (event.time) return event.time;
    if (event.start_time) return event.start_time;
    return 'TBD';
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleHeartPress = () => {
    Animated.sequence([
      Animated.spring(heartScaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(heartScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    onToggleSaved();
  };

  const handleShare = async () => {
    console.log('🔍 EventCard: Share button pressed for event:', event.title);
    try {
      const venueName = getVenueName();
      const eventTime = getEventTime();
      const shareMessage = `Check out this event: ${event.title} at ${venueName} on ${formatDate(getEventDate())} at ${eventTime}!`;
      
      console.log('🔍 EventCard: Share message:', shareMessage);
      
      const result = await Share.share({
        message: shareMessage,
        title: event.title,
      });

      if (result.action === Share.sharedAction) {
        analyticsService.trackEventShare(event.id, event.title, 'native');
        Alert.alert('Shared!', 'Event shared successfully');
      }
    } catch (error) {
      console.error('❌ EventCard: Error sharing event:', error);
      Alert.alert('Error', 'Failed to share event');
    }
  };

  const handleAddToCalendar = async () => {
    console.log('🔍 EventCard: Add to Calendar button pressed for event:', event.title);
    try {
      analyticsService.trackCalendarAdd(event.id, event.title);
      
      const calendarEvent: CalendarEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: getEventDate(),
        endDate: new Date(getEventDate().getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
        location: getVenueName(),
        url: event.ticketUrl,
      };
      
      console.log('🔍 EventCard: Calendar event data:', calendarEvent);
      
      const success = await calendarService.addEventToCalendar(calendarEvent);
      
      if (success) {
        Alert.alert(
          '✅ Added to Calendar',
          'Event has been added to your device calendar!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ EventCard: Error adding to calendar:', error);
      Alert.alert('Error', 'Failed to add event to calendar');
    }
  };

  const handleDetails = () => {
    console.log('🔍 EventCard: Details button pressed for event:', event.title);
    onPress(); // This will navigate to the event detail screen
  };

  const getEventStatus = () => {
    const eventDate = getEventDate();
    const now = new Date();
    const timeDiff = eventDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return { status: 'Past', color: COLORS.textSecondary };
    if (daysDiff === 0) return { status: 'Today', color: COLORS.success };
    if (daysDiff === 1) return { status: 'Tomorrow', color: COLORS.warning };
    if (daysDiff <= 7) return { status: 'This Week', color: COLORS.primary };
    return { status: 'Upcoming', color: COLORS.textSecondary };
  };

  const getEventPriority = () => {
    if (event.trendingScore && event.trendingScore > 90) return '🔥 Hot';
    if (event.trendingScore && event.trendingScore > 80) return '📈 Trending';
    if (event.friendsAttending && event.friendsAttending.length > 2) return '👥 Friends Going';
    if (event.isLocalCurated) return '⭐ Local Pick';
    return null;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[styles.card, isPressed && styles.cardPressed]} 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        data-testid="event-card"
        accessibilityLabel={`Event: ${event.title}`}
      >
        {/* Event Image */}
        <View style={styles.imageContainer}>
          {event.images && event.images.length > 0 && event.images[0] ? (
            <Image
              source={{ uri: event.images[0] }}
              style={styles.image}
              resizeMode="cover"
              onError={(error) => {
                console.log('Image failed to load:', event.images?.[0]);
              }}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name={getEventTypeIcon(event.tags || [])} size={48} color={COLORS.primary} />
              <Text style={styles.placeholderText}>{event.title}</Text>
            </View>
          )}
          
          {/* Enhanced Gradient Overlay */}
          <View style={styles.gradientOverlay} />
          
          {/* Event Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: getEventStatus().color }]}>
            <Text style={styles.statusText}>{getEventStatus().status}</Text>
          </View>
          
          {/* Price Badge */}
          <View style={[styles.priceBadge, { backgroundColor: getPriceColor(event.priceRange || 'Free') }]}>
            <Ionicons name="cash-outline" size={12} color={COLORS.white} />
            <Text style={styles.priceText}>{formatPrice(event.price)}</Text>
          </View>
          
          {/* Enhanced Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, event.isSaved && styles.savedButton]}
            onPress={handleHeartPress}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
              <Ionicons 
                name={event.isSaved ? "heart" : "heart-outline"} 
                size={24} 
                color={event.isSaved ? COLORS.error : COLORS.white} 
              />
            </Animated.View>
          </TouchableOpacity>

          {/* Priority Badge */}
          {getEventPriority() && (
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>{getEventPriority()}</Text>
            </View>
          )}

          {/* Social Proof */}
          {event.friendsAttending && event.friendsAttending.length > 0 && (
            <View style={styles.socialProof}>
              <Ionicons name="people" size={14} color={COLORS.white} />
              <Text style={styles.socialProofText}>
                {event.friendsAttending.length} friend{event.friendsAttending.length > 1 ? 's' : ''} interested
              </Text>
            </View>
          )}
        </View>

        {/* Enhanced Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
              {event.description && (
                <Text style={styles.description} numberOfLines={1}>
                  {event.description}
                </Text>
              )}
            </View>
            
            <View style={styles.venueContainer}>
              <Ionicons name="location" size={16} color={COLORS.textSecondary} />
              <Text style={styles.venue} numberOfLines={1}>{getVenueName()}</Text>
            </View>
          </View>

          {/* Enhanced Details */}
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={16} color={COLORS.textSecondary} />
              <Text style={styles.detailText}>
                {formatDate(getEventDate())} • {getEventTime()}
              </Text>
            </View>
            
            {event.distance && (
              <View style={styles.detailItem}>
                <Ionicons name="navigate" size={16} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>{event.distance} miles away</Text>
              </View>
            )}

            {event.currentAttendees && event.currentAttendees > 0 && (
              <View style={styles.detailItem}>
                <Ionicons name="people" size={16} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>{event.currentAttendees} attending</Text>
              </View>
            )}
          </View>

          {/* Enhanced Tags */}
          {event.tags && event.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {event.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Ionicons name={getEventTypeIcon([tag])} size={12} color={COLORS.primary} />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {event.tags.length > 3 && (
                <View style={styles.moreTagsContainer}>
                  <Text style={styles.moreTagsText}>+{event.tags.length - 3} more</Text>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddToCalendar} activeOpacity={0.7}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.actionButtonText}>Add to Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDetails} activeOpacity={0.7}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.actionButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardPressed: {
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary + '15',
  },
  placeholderText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  statusBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  priceText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  saveButton: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  savedButton: {
    backgroundColor: COLORS.error + '20',
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  priorityBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  socialProof: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialProofText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  details: {
    marginBottom: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  moreTagsContainer: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.xs,
  },
  moreTagsText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
}); 