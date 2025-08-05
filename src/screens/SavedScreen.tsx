import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import EventCard from '../components/EventCard';
import EventDetailScreen from './EventDetailScreen';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import { analyticsService } from '../services/analyticsService';
import { eventService } from '../services/eventService';

export default function SavedScreen({ navigation }: any) {
  console.log('SavedScreen component rendered');
  
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('SavedScreen useEffect triggered');
    loadSavedEvents();
    analyticsService.trackScreenView('SavedScreen');
  }, []);

  const loadSavedEvents = async () => {
    try {
      console.log('Loading saved events...');
      setIsLoading(true);
      
      const events = await eventService.getSavedEvents();
      console.log('Saved events loaded:', events.length);
      setSavedEvents(events);
    } catch (error) {
      console.error('Error loading saved events:', error);
      setSavedEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSaved = async (eventId: string) => {
    try {
      console.log('Toggling saved event:', eventId);
      
      // Remove from saved events
      const updatedEvents = savedEvents.filter(event => event.id !== eventId);
      setSavedEvents(updatedEvents);
      
      const event = savedEvents.find(e => e.id === eventId);
      if (event) {
        analyticsService.trackEventSave(eventId, event.title, false);
      }
    } catch (error) {
      console.error('Error toggling saved event:', error);
    }
  };

  const handleEventPress = (event: Event) => {
    console.log('Event pressed:', event.title);
    setSelectedEvent(event);
    analyticsService.trackEventDetailView(event.id, event.title);
  };

  const handleExploreEvents = () => {
    console.log('Navigate to Discover');
    navigation.navigate('Discover');
  };

  if (selectedEvent) {
    return (
      <EventDetailScreen
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
        onToggleSaved={() => handleToggleSaved(selectedEvent.id)}
      />
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your saved events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (savedEvents.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No Saved Events</Text>
          <Text style={styles.emptySubtitle}>
            Events you save will appear here for easy access
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={handleExploreEvents}
          >
            <Text style={styles.exploreButtonText}>Explore Events</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saved Events</Text>
        <Text style={styles.subtitle}>
          {savedEvents.length} event{savedEvents.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      {/* Events List */}
      <FlatList
        data={savedEvents}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onToggleSaved={() => handleToggleSaved(item.id)}
            onPress={() => handleEventPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.xs,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  filterTabTextActive: {
    color: COLORS.surface,
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  discoverButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  discoverButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
  },
  exploreButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  separator: {
    height: SPACING.md,
  },
}); 