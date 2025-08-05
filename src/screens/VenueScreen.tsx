import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Venue, Event } from '../types';
import { apiService } from '../services/apiService';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import { analyticsService } from '../services/analyticsService';

const { width } = Dimensions.get('window');

export default function VenueScreen() {
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'analytics' | 'settings'>('overview');

  useEffect(() => {
    loadVenueData();
    analyticsService.trackScreenView('VenueScreen');
  }, []);

  const loadVenueData = async () => {
    try {
      setIsLoading(true);
      
      // Load venue data
      const venueResponse = await apiService.getVenues();
      console.log('Venue response:', venueResponse);
      
      if (venueResponse.venues && venueResponse.venues.length > 0) {
        setVenue(venueResponse.venues[0]); // For demo, use first venue
        
        // Load venue events
        const eventsResponse = await apiService.getVenueEvents(venueResponse.venues[0].id);
        console.log('Venue events response:', eventsResponse);
        setEvents(eventsResponse.events || []);
      } else {
        console.log('No venues found');
        setVenue(null);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error loading venue data:', error);
      Alert.alert('Error', 'Failed to load venue data');
      setVenue(null);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.venueCard}>
        <View style={styles.venueHeader}>
          {venue?.logo ? (
            <Image source={{ uri: venue.logo }} style={styles.venueLogo} />
          ) : (
            <View style={styles.venueLogoPlaceholder}>
              <Ionicons name="business" size={32} color={COLORS.primary} />
            </View>
          )}
          <View style={styles.venueInfo}>
            <Text style={styles.venueName}>{venue?.name || 'Your Venue'}</Text>
            <Text style={styles.venueType}>{venue?.venueType || 'Event Space'}</Text>
            <Text style={styles.venueAddress}>
              {venue?.address ? `${venue.address}, ${venue.city}, ${venue.state}` : 'Address TBA'}
            </Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>1.2k</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Saves</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Add Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} activeOpacity={0.8}>
          <Ionicons name="settings" size={24} color={COLORS.primary} />
          <Text style={[styles.actionText, styles.secondaryText]}>Edit Venue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEvents = () => (
    <View style={styles.tabContent}>
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>Your Events</Text>
        <TouchableOpacity style={styles.addEventButton}>
          <Ionicons name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      {events.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No Events Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start by creating your first event to attract customers
          </Text>
          <TouchableOpacity style={styles.createEventButton}>
            <Text style={styles.createEventText}>Create Your First Event</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventStatus}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
              <Text style={styles.eventDate}>
                {event.date ? new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : 'TBD'}
              </Text>
              <View style={styles.eventStats}>
                <View style={styles.eventStat}>
                  <Ionicons name="eye" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.eventStatText}>{event.totalViews || 0} views</Text>
                </View>
                <View style={styles.eventStat}>
                  <Ionicons name="heart" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.eventStatText}>{event.totalSaves || 0} saves</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderAnalytics = () => (
    <View style={styles.tabContent}>
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Performance Overview</Text>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsNumber}>1,247</Text>
            <Text style={styles.analyticsLabel}>Total Views</Text>
            <Text style={styles.analyticsChange}>+12% this week</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsNumber}>89</Text>
            <Text style={styles.analyticsLabel}>Event Saves</Text>
            <Text style={styles.analyticsChange}>+5% this week</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsNumber}>23</Text>
            <Text style={styles.analyticsLabel}>Active Events</Text>
            <Text style={styles.analyticsChange}>+2 this month</Text>
          </View>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsNumber}>4.8</Text>
            <Text style={styles.analyticsLabel}>Avg Rating</Text>
            <Text style={styles.analyticsChange}>+0.2 this month</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Venue Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="business" size={20} color={COLORS.primary} />
          <Text style={styles.settingText}>Edit Venue Information</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="images" size={20} color={COLORS.primary} />
          <Text style={styles.settingText}>Manage Photos</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications" size={20} color={COLORS.primary} />
          <Text style={styles.settingText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="card" size={20} color={COLORS.primary} />
          <Text style={styles.settingText}>Billing & Payments</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreateVenue = () => (
    <View style={styles.tabContent}>
      <View style={styles.emptyState}>
        <Ionicons name="business-outline" size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>No Venues Yet</Text>
        <Text style={styles.emptySubtitle}>
          Create your first venue to start managing events and tracking performance
        </Text>
        <TouchableOpacity style={styles.createVenueButton}>
          <Ionicons name="add-circle" size={24} color={COLORS.white} />
          <Text style={styles.createVenueText}>Create Your First Venue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading venue data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show create venue screen if no venues exist
  if (!venue) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Venue Dashboard</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {renderCreateVenue()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Venue Dashboard</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: 'Overview', icon: 'grid' },
          { key: 'events', label: 'Events', icon: 'calendar' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' },
          { key: 'settings', label: 'Settings', icon: 'settings' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? COLORS.white : COLORS.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </ScrollView>
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
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.xs,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  activeTabText: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: SPACING.lg,
  },
  venueCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  venueLogo: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
  },
  venueLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  venueType: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 2,
  },
  venueAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryText: {
    color: COLORS.primary,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addEventButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  createEventButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  createEventText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  eventStatus: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  eventDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  eventStats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  eventStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  eventStatText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  analyticsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  analyticsItem: {
    width: (width - SPACING.lg * 3) / 2,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  analyticsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  analyticsLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  analyticsChange: {
    fontSize: 10,
    color: COLORS.success,
    marginTop: 2,
  },
  settingsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  createVenueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
    marginTop: SPACING.lg,
  },
  createVenueText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 