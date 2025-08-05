import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Share,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import { analyticsService } from '../services/analyticsService';
import { notificationService } from '../services/notificationService';
import { calendarService, CalendarEvent } from '../services/calendarService';
import { apiService } from '../services/apiService';
import CalendarTest from '../components/CalendarTest';

interface EventDetailScreenProps {
  route: any;
  navigation: any;
}

export default function EventDetailScreen({ route, navigation }: EventDetailScreenProps) {
  const { event } = route.params;
  const [isSaved, setIsSaved] = useState(event.isSaved);

  console.log('🔍 EventDetailScreen: Received event data:', {
    id: event.id,
    title: event.title,
    date: event.date,
    venue: event.venue,
    ticketUrl: event.ticketUrl,
    price: event.price
  });

  const handleToggleSaved = () => {
    setIsSaved(!isSaved);
    // Track save/unsave analytics
    analyticsService.trackEventSave(event.id, event.title, !isSaved);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      const venueName = event.venue?.name || 'Unknown venue';
      const eventTime = event.time || 'TBD';
      const shareMessage = `Check out this event: ${event.title} at ${venueName} on ${formatDate(event.date)} at ${eventTime}!`;
      
      const result = await Share.share({
        message: shareMessage,
        title: event.title,
      });

      if (result.action === Share.sharedAction) {
        // Track share analytics
        analyticsService.trackEventShare(event.id, event.title, 'native');
        Alert.alert('Shared!', 'Event shared successfully');
      }
    } catch (error) {
      console.error('Error sharing event:', error);
      Alert.alert('Error', 'Failed to share event');
    }
  };

  const handleAddToCalendar = async () => {
    console.log('🔍 EventDetailScreen: Add to Calendar button pressed for event:', event.title);
    try {
      // Quick permission test first
      console.log('🔍 EventDetailScreen: Running quick permission test...');
      const permissionTest = await calendarService.quickPermissionTest();
      console.log('🔍 EventDetailScreen: Permission test result:', permissionTest);
      
      if (!permissionTest.hasPermission) {
        Alert.alert(
          'Calendar Permission Required',
          `Calendar access is required to add events to your calendar.\n\nError: ${permissionTest.error}\n\nPlease enable calendar permissions in your device settings and try again.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              Alert.alert(
                'Enable Calendar Access',
                'To enable calendar access:\n\n📱 iOS: Settings > Privacy & Security > Calendars > Around Me Now\n\n🤖 Android: Settings > Apps > Around Me Now > Permissions > Calendar\n\nAfter enabling, restart the app and try again.',
                [{ text: 'OK' }]
              );
            }}
          ]
        );
        return;
      }
      
      if (!permissionTest.hasCalendar) {
        Alert.alert(
          'No Calendar Found',
          `No default calendar found on your device.\n\nError: ${permissionTest.error}\n\nPlease set up a default calendar in your device settings.`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Show loading state
      Alert.alert(
        'Adding to Calendar',
        'Please wait while we add the event to your calendar...',
        [],
        { cancelable: false }
      );

      // Track calendar add analytics
      analyticsService.trackCalendarAdd(event.id, event.title);
      
      // Ensure we have a proper Date object
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      console.log('🔍 EventDetailScreen: Event date:', eventDate);
      
      // Convert event to calendar event format
      const calendarEvent: CalendarEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: eventDate,
        endDate: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
        location: event.venue?.name || event.address,
        url: event.ticketUrl,
      };
      
      console.log('🔍 EventDetailScreen: Calendar event data:', calendarEvent);
      
      // Add to device calendar
      const deviceCalendarSuccess = await calendarService.addEventToCalendar(calendarEvent);
      console.log('🔍 EventDetailScreen: Device calendar add result:', deviceCalendarSuccess);
      
      // Also sync to backend calendar
      try {
        console.log('🔍 EventDetailScreen: Syncing to backend calendar...');
        const backendSyncResult = await apiService.syncEventToCalendar(event.id);
        console.log('🔍 EventDetailScreen: Backend calendar sync result:', backendSyncResult);
        
        if (backendSyncResult.success) {
          if (deviceCalendarSuccess) {
            Alert.alert(
              '✅ Added to Calendar',
              `${backendSyncResult.message}\n\n📅 Event Details:\n• ${backendSyncResult.event.title}\n• ${backendSyncResult.event.venue}\n• ${new Date(backendSyncResult.event.startDate).toLocaleDateString()}\n\n🎯 The event has been added to your device calendar and synced to your account!`,
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert(
              '⚠️ Partial Success',
              `${backendSyncResult.message}\n\n📅 Event Details:\n• ${backendSyncResult.event.title}\n• ${backendSyncResult.event.venue}\n• ${new Date(backendSyncResult.event.startDate).toLocaleDateString()}\n\n⚠️ Event was synced to your account but could not be added to your device calendar. Please check your calendar permissions.`,
              [{ text: 'OK' }]
            );
          }
        } else {
          if (deviceCalendarSuccess) {
            Alert.alert(
              '⚠️ Partial Success',
              'Event was added to your device calendar but could not be synced to your account.',
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert(
              'Calendar Sync Error',
              backendSyncResult.message || 'Failed to sync event to calendar.',
              [{ text: 'OK' }]
            );
          }
        }
      } catch (backendError) {
        console.error('❌ EventDetailScreen: Backend calendar sync failed:', backendError);
        if (deviceCalendarSuccess) {
          Alert.alert(
            '⚠️ Partial Success',
            'Event was added to your device calendar but could not be synced to your account.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Calendar Error',
            'Failed to add event to calendar. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('❌ EventDetailScreen: Error adding to calendar:', error);
      Alert.alert('Error', 'Failed to add event to calendar');
    }
  };

  const handleGetDirections = async () => {
    try {
      if (!event.location) {
        Alert.alert('Error', 'Location not available for this event');
        return;
      }
      
      const { latitude, longitude } = event.location;
      const url = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
      
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        // Track directions request analytics
        analyticsService.trackDirectionsRequest(event.id, event.title);
      } else {
        Alert.alert('Error', 'Unable to open maps app');
      }
    } catch (error) {
      console.error('Error opening directions:', error);
      Alert.alert('Error', 'Failed to open directions');
    }
  };

  const handleVenueWebsite = async () => {
    try {
      if (event.venue?.website) {
        const supported = await Linking.canOpenURL(event.venue.website);
        if (supported) {
          await Linking.openURL(event.venue.website);
          // Track venue website click analytics
          analyticsService.trackVenueWebsiteClick(event.venue.id, event.venue.name);
        } else {
          Alert.alert('Error', 'Unable to open website');
        }
      } else {
        Alert.alert('No Website', 'This venue does not have a website');
      }
    } catch (error) {
      console.error('Error opening venue website:', error);
      Alert.alert('Error', 'Failed to open venue website');
    }
  };

  const handleBuyTickets = async () => {
    console.log('🔍 EventDetailScreen: Buy Tickets button pressed for event:', event.title);
    console.log('🔍 EventDetailScreen: Ticket URL:', event.ticketUrl);
    
    try {
      if (event.ticketUrl) {
        console.log('🔍 EventDetailScreen: Opening ticket URL:', event.ticketUrl);
        const supported = await Linking.canOpenURL(event.ticketUrl);
        console.log('🔍 EventDetailScreen: URL supported:', supported);
        
        if (supported) {
          await Linking.openURL(event.ticketUrl);
          // Track ticket purchase analytics
          analyticsService.trackTicketPurchase(event.id, event.title, event.price);
          Alert.alert(
            '✅ Ticket Link Opened',
            `Ticket purchase page has been opened in your browser.\n\n🎫 Event: ${event.title}\n💰 Price: ${formatPrice(event.price)}\n📍 Venue: ${event.venue?.name || 'Unknown venue'}\n\nYou can now complete your ticket purchase!`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Unable to Open Link',
            `The ticket link could not be opened.\n\n🎫 Event: ${event.title}\n💰 Price: ${formatPrice(event.price)}\n📍 Venue: ${event.venue?.name || 'Unknown venue'}\n\nPlease try visiting the venue website directly or contact the venue for ticket information.`,
            [{ text: 'OK' }]
          );
        }
      } else {
        console.log('🔍 EventDetailScreen: No ticket URL, showing purchase dialog');
        // Show ticket purchase options
        Alert.alert(
          'Purchase Tickets',
          `How would you like to purchase tickets for "${event.title}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Buy Through Venue', 
              onPress: async () => {
                try {
                  console.log('🔍 EventDetailScreen: Venue purchase selected');
                  const purchaseResult = await apiService.purchaseTickets(event.id, 1, 'venue');
                  console.log('🔍 EventDetailScreen: Venue purchase result:', purchaseResult);
                  
                  if (purchaseResult.success) {
                    if (purchaseResult.venueUrl) {
                      const supported = await Linking.canOpenURL(purchaseResult.venueUrl);
                      if (supported) {
                        await Linking.openURL(purchaseResult.venueUrl);
                        Alert.alert(
                          '✅ Redirecting to Venue',
                          `${purchaseResult.message}\n\n🎫 Event: ${purchaseResult.event.title}\n💰 Price: ${formatPrice(purchaseResult.event.price)}\n📍 Venue: ${purchaseResult.event.venue}\n\nYou are being redirected to the venue website to complete your purchase.`,
                          [{ text: 'OK' }]
                        );
                      } else {
                        Alert.alert(
                          'Unable to Open Venue Link',
                          'The venue website could not be opened. Please visit the venue website directly.',
                          [{ text: 'OK' }]
                        );
                      }
                    } else {
                      Alert.alert(
                        'Venue Purchase',
                        `${purchaseResult.message}\n\n🎫 Event: ${purchaseResult.event.title}\n💰 Price: ${formatPrice(purchaseResult.event.price)}\n📍 Venue: ${purchaseResult.event.venue}\n\nPlease contact the venue directly to purchase tickets.`,
                        [{ text: 'OK' }]
                      );
                    }
                  } else {
                    Alert.alert(
                      'Purchase Error',
                      purchaseResult.message || 'Failed to process venue purchase. Please try again.',
                      [{ text: 'OK' }]
                    );
                  }
                  
                  // Track ticket purchase analytics
                  analyticsService.trackTicketPurchase(event.id, event.title, event.price);
                } catch (error) {
                  console.error('❌ EventDetailScreen: Venue purchase error:', error);
                  Alert.alert(
                    'Purchase Error',
                    'Failed to process venue purchase. Please try again.',
                    [{ text: 'OK' }]
                  );
                }
              }
            },
            { 
              text: 'Buy Through Platform', 
              onPress: async () => {
                try {
                  console.log('🔍 EventDetailScreen: Platform purchase selected');
                  // Mock payment method ID - in real app, this would come from Stripe
                  const mockPaymentMethodId = 'pm_' + Math.random().toString(36).substr(2, 9);
                  const purchaseResult = await apiService.purchaseTickets(event.id, 1, 'platform', mockPaymentMethodId);
                  console.log('🔍 EventDetailScreen: Platform purchase result:', purchaseResult);
                  
                  if (purchaseResult.success) {
                    Alert.alert(
                      '✅ Tickets Purchased!',
                      `${purchaseResult.message}\n\n🎫 Event: ${purchaseResult.event.title}\n💰 Price: ${formatPrice(purchaseResult.purchaseDetails.totalPrice)}\n📍 Venue: ${purchaseResult.event.venue}\n📦 Quantity: ${purchaseResult.purchaseDetails.quantity}\n💳 Payment: ${purchaseResult.paymentDetails.status}\n\nYour tickets have been purchased successfully! You will receive a confirmation email shortly.`,
                      [{ text: 'OK' }]
                    );
                  } else {
                    Alert.alert(
                      'Purchase Error',
                      purchaseResult.message || 'Failed to process platform purchase. Please try again.',
                      [{ text: 'OK' }]
                    );
                  }
                  
                  // Track ticket purchase analytics
                  analyticsService.trackTicketPurchase(event.id, event.title, event.price);
                } catch (error) {
                  console.error('❌ EventDetailScreen: Platform purchase error:', error);
                  Alert.alert(
                    'Purchase Error',
                    'Failed to process platform purchase. Please try again.',
                    [{ text: 'OK' }]
                  );
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ EventDetailScreen: Error opening ticket link:', error);
      Alert.alert(
        'Error',
        'Failed to open ticket link. Please try again or contact the venue directly.',
        [{ text: 'OK' }]
      );
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string): string => {
    return time;
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleSaved} style={styles.headerButton}>
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={24}
              color={isSaved ? COLORS.error : COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <View style={styles.imageContainer}>
          {event.images && event.images.length > 0 ? (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={48} color={COLORS.gray} />
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="calendar" size={48} color={COLORS.gray} />
            </View>
          )}
          
          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{formatPrice(event.price)}</Text>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.venueContainer}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.venue}>{event.venue?.name || 'Unknown venue'}</Text>
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeItem}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.dateTimeText}>{event.date ? formatDate(event.date) : 'TBD'}</Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <Text style={styles.dateTimeText}>{formatTime(event.time || 'TBD')}</Text>
            </View>
          </View>

          {event.distance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="navigate" size={20} color={COLORS.primary} />
              <Text style={styles.distanceText}>
                {event.distance.toFixed(1)} miles away
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Type</Text>
            <View style={styles.tagsContainer}>
              {event.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Vibe */}
        {event.vibe && event.vibe.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vibe</Text>
            <View style={styles.vibeContainer}>
              {event.vibe.map((vibe: string, index: number) => (
                <View key={index} style={styles.vibeTag}>
                  <Ionicons name="star" size={16} color={COLORS.accent} />
                  <Text style={styles.vibeText}>{vibe}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Venue Details */}
        {event.venue && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Venue</Text>
            <View style={styles.venueDetails}>
              <Text style={styles.venueName}>{event.venue.name}</Text>
              {event.venue.description && (
                <Text style={styles.venueDescription}>{event.venue.description}</Text>
              )}
              
              <View style={styles.venueActions}>
                <TouchableOpacity style={styles.venueAction} onPress={handleGetDirections}>
                  <Ionicons name="navigate" size={20} color={COLORS.primary} />
                  <Text style={styles.venueActionText}>Get Directions</Text>
                </TouchableOpacity>
                
                {event.venue.website && (
                  <TouchableOpacity style={styles.venueAction} onPress={handleVenueWebsite}>
                    <Ionicons name="globe" size={20} color={COLORS.primary} />
                    <Text style={styles.venueActionText}>Visit Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Attendees */}
        {event.attendees && event.attendees > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who's Going</Text>
            <View style={styles.attendeesContainer}>
              <Ionicons name="people" size={20} color={COLORS.primary} />
              <Text style={styles.attendeesText}>
                {event.attendees} people attending
              </Text>
            </View>
          </View>
        )}

        {/* Social Proof */}
        {event.friendsAttending && event.friendsAttending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Friends Going</Text>
            <View style={styles.friendsContainer}>
              <Ionicons name="people-circle" size={20} color={COLORS.primary} />
              <Text style={styles.friendsText}>
                {event.friendsAttending.length} of your friends are attending
              </Text>
            </View>
          </View>
        )}

        {/* Calendar Test Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendar Debug</Text>
          <CalendarTest />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => {
            console.log('🔍 EventDetailScreen: Add to Calendar button TOUCHED');
            handleAddToCalendar();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>Add to Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => {
            console.log('🔍 EventDetailScreen: Buy Tickets button TOUCHED');
            handleBuyTickets();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="ticket-outline" size={20} color={COLORS.white} />
          <Text style={styles.primaryButtonText}>
            Buy Tickets
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: COLORS.surface,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  priceText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventInfo: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: 34,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  venue: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  dateTimeContainer: {
    marginBottom: SPACING.md,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dateTimeText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.secondary + '25',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  tagText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  vibeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vibeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '25',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
  },
  vibeText: {
    fontSize: 14,
    color: COLORS.accent,
    marginLeft: SPACING.xs,
    fontWeight: 'bold',
  },
  venueDetails: {
    marginBottom: SPACING.md,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  venueDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  venueActions: {
    flexDirection: 'row',
  },
  venueAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  venueActionText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  friendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendsText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
}); 