import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Event, FilterOptions } from '../types';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import EventCard from '../components/EventCard';
import FilterModal from '../components/FilterModal';
import Calendar from '../components/Calendar';
import ErrorBoundary from '../components/ErrorBoundary';
import WebSearchInput from '../components/WebSearchInput';
import { eventService } from '../services/eventService';
import { analyticsService } from '../services/analyticsService';

const { width } = Dimensions.get('window');

const DiscoverScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [hotNearYou, setHotNearYou] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [calendarMode, setCalendarMode] = useState<'single' | 'range' | 'multi'>('single');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    dateRange: 'today',
    priceRange: [],
    distance: 25,
    eventTypes: [],
    vibe: [],
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'hot'>('all');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Enhanced UI states
  const [searchFocused, setSearchFocused] = useState(false);
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadEvents();
    loadTrendingEvents();
    loadHotNearYou();
    
    // Start pulse animation for trending events
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    pulseAnimation();
    
    return () => {
      console.log('Cleaning up DiscoverScreen...');
    };
  }, []);

  // Enhanced search effect with better UX
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
      setShowQuickFilters(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = events.filter(event => {
      const title = event.title.toLowerCase();
      const description = event.description?.toLowerCase() || '';
      const venue = event.venue?.name?.toLowerCase() || event.venue_name?.toLowerCase() || '';
      const tags = event.tags?.join(' ').toLowerCase() || '';

      return title.includes(query) || 
             description.includes(query) || 
             venue.includes(query) || 
             tags.includes(query);
    });

    setFilteredEvents(filtered);
    setShowQuickFilters(true);
    setForceUpdate(prev => prev + 1);
  }, [searchQuery, events]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await eventService.getEvents();
      
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setUseMockData(false);
      
      analyticsService.track({
        type: 'screen_view',
        userId: 'user123',
        properties: {
          screen: 'Discover',
          eventsCount: eventsData.length,
        },
      });
    } catch (error) {
      console.error('❌ Error loading events:', error);
      setUseMockData(true);
      Alert.alert(
        'Connection Issue', 
        'Unable to load events from server. Showing sample data instead.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingEvents = async () => {
    try {
      const trending = events.filter(event => 
        event.trendingScore && event.trendingScore > 80
      ).slice(0, 5);
      setTrendingEvents(trending);
    } catch (error) {
      console.error('Error loading trending events:', error);
    }
  };

  const loadHotNearYou = async () => {
    try {
      const hot = events.filter(event => 
        event.isLocalCurated || (event.friendsAttending && event.friendsAttending.length > 0)
      ).slice(0, 5);
      setHotNearYou(hot);
    } catch (error) {
      console.error('Error loading hot events:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadEvents(),
      loadTrendingEvents(),
      loadHotNearYou(),
    ]);
    setIsRefreshing(false);
  };

  const handleApplyFilters = async (filters: FilterOptions) => {
    try {
      setSelectedFilters(filters);
      
      if (!useMockData) {
        const filteredEvents = await eventService.getEvents(filters);
        setFilteredEvents(filteredEvents);

        analyticsService.track({
          type: 'filter_apply',
          userId: 'user123',
          properties: {
            filters,
            resultsCount: filteredEvents.length,
          },
        });
      } else {
        let filtered = events;
        
        // Enhanced filtering logic
        if (filters.dateRange === 'today') {
          const today = new Date();
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date || event.start_date);
            return eventDate.toDateString() === today.toDateString();
          });
        } else if (filters.dateRange === 'tomorrow') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date || event.start_date);
            return eventDate.toDateString() === tomorrow.toDateString();
          });
        } else if (filters.dateRange === 'weekend') {
          const now = new Date();
          const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
          const saturday = new Date(now);
          saturday.setDate(now.getDate() + daysUntilSaturday);
          const sunday = new Date(saturday);
          sunday.setDate(saturday.getDate() + 1);
          
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date || event.start_date);
            return eventDate >= saturday && eventDate <= sunday;
          });
        } else if (filters.dateRange === 'custom' && filters.customDateRange) {
          const { start, end } = filters.customDateRange;
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date || event.start_date);
            return eventDate >= start && eventDate <= end;
          });
        }
        
        if (filters.priceRange.length > 0) {
          filtered = filtered.filter(event => {
            const priceRange = event.priceRange || '$';
            return filters.priceRange.includes(priceRange);
          });
        }
        
        if (filters.eventTypes.length > 0) {
          filtered = filtered.filter(event => 
            event.tags?.some(tag => filters.eventTypes.includes(tag)) ||
            event.eventTypes?.some(type => filters.eventTypes.includes(type))
          );
        }
        
        if (filters.vibe.length > 0) {
          filtered = filtered.filter(event => 
            event.vibe && event.vibe.some(vibe => filters.vibe.includes(vibe))
          );
        }
        
        // Place filter - search by venue name, city, or address
        if (filters.place && filters.place.trim() !== '') {
          const placeQuery = filters.place.toLowerCase().trim();
          filtered = filtered.filter(event => {
            const venueName = event.venue?.name?.toLowerCase() || event.venue_name?.toLowerCase() || '';
            const city = event.city?.toLowerCase() || event.venue?.city?.toLowerCase() || '';
            const address = event.address?.toLowerCase() || event.venue?.address?.toLowerCase() || '';
            const state = event.state?.toLowerCase() || event.venue?.state?.toLowerCase() || '';
            
            return venueName.includes(placeQuery) ||
                   city.includes(placeQuery) ||
                   address.includes(placeQuery) ||
                   state.includes(placeQuery);
          });
        }
        
        if (filters.distance && filters.distance !== 25) {
          // More sophisticated distance filtering based on exact values
          filtered = filtered.filter(event => {
            // For very close events (0-5 miles)
            if (filters.distance <= 5) {
              return event.isLocalCurated || 
                     (event.friendsAttending && event.friendsAttending.length > 0) ||
                     (event.trendingScore && event.trendingScore > 90);
            }
            // For nearby events (6-15 miles)
            else if (filters.distance <= 15) {
              return event.isLocalCurated || 
                     (event.friendsAttending && event.friendsAttending.length > 0) ||
                     (event.trendingScore && event.trendingScore > 80) ||
                     event.isFeatured;
            }
            // For local events (16-30 miles)
            else if (filters.distance <= 30) {
              return event.isLocalCurated || 
                     event.isFeatured ||
                     (event.trendingScore && event.trendingScore > 50);
            }
            // For regional events (31-50 miles)
            else if (filters.distance <= 50) {
              return event.isFeatured || 
                     (event.trendingScore && event.trendingScore > 40) ||
                     event.isTrending;
            }
            // For anywhere (51-100 miles)
            else {
              return event.isTrending || 
                     (event.trendingScore && event.trendingScore > 30) ||
                     event.isFeatured;
            }
          });
        }
        
        setFilteredEvents(filtered);
      }
      
      setSearchQuery('');
      
    } catch (error) {
      console.error('Error applying filters:', error);
      Alert.alert(
        'Error', 
        'Failed to apply filters. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleToggleSaved = async (event: Event) => {
    try {
      const updatedEvent = { ...event, isSaved: !event.isSaved };
      
      setEvents(prevEvents => 
        prevEvents.map(e => e.id === event.id ? updatedEvent : e)
      );
      setFilteredEvents(prevEvents => 
        prevEvents.map(e => e.id === event.id ? updatedEvent : e)
      );
      setTrendingEvents(prevEvents => 
        prevEvents.map(e => e.id === event.id ? updatedEvent : e)
      );
      setHotNearYou(prevEvents => 
        prevEvents.map(e => e.id === event.id ? updatedEvent : e)
      );
      
      let success = false;
      if (updatedEvent.isSaved) {
        success = await eventService.saveEvent(event.id);
      } else {
        success = await eventService.unsaveEvent(event.id);
      }
      
      if (!success) {
        throw new Error('Failed to update event save status');
      }
      
      analyticsService.track({
        type: 'event_saved',
        userId: 'user123',
        properties: {
          eventId: event.id,
          eventTitle: event.title,
          isSaved: updatedEvent.isSaved,
        },
      });
      
    } catch (error) {
      console.error('Error saving event:', error);
      
      const revertedEvent = { ...event, isSaved: event.isSaved };
      setEvents(prevEvents => 
        prevEvents.map(e => e.id === event.id ? revertedEvent : e)
      );
      setFilteredEvents(prevEvents => 
        prevEvents.map(e => e.id === event.id ? revertedEvent : e)
      );
      setTrendingEvents(prevEvents => 
        prevEvents.map(e => e.id === event.id ? revertedEvent : e)
      );
      setHotNearYou(prevEvents => 
        prevEvents.map(e => e.id === event.id ? revertedEvent : e)
      );
      
      Alert.alert(
        'Error', 
        'Failed to save event. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleEventPress = (event: Event) => {
    console.log('🔍 DiscoverScreen: Event pressed:', event.title);
    setSelectedEvent(event);
    
    analyticsService.track({
      type: 'event_detail_view',
      userId: 'user123',
      properties: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleDateChange = (date: Date) => {
    setShowCalendar(false);
    setSelectedDate(date);
    
    const filtered = events.filter(event => {
      const eventDate = new Date(event.date || event.start_date);
      return eventDate.toDateString() === date.toDateString();
    });
    
    setFilteredEvents(filtered);
    setActiveTab('all');
    setSearchQuery('');
    
    analyticsService.track({
      type: 'calendar_date_select',
      userId: 'user123',
      properties: {
        selectedDate: date.toISOString(),
        eventsFound: filtered.length,
      },
    });
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setShowCalendar(false);
    
    const filtered = events.filter(event => {
      const eventDate = new Date(event.date || event.start_date);
      return eventDate >= startDate && eventDate <= endDate;
    });
    
    setFilteredEvents(filtered);
    setActiveTab('all');
    setSearchQuery('');
    
    analyticsService.track({
      type: 'calendar_range_select',
      userId: 'user123',
      properties: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        eventsFound: filtered.length,
      },
    });
  };

  const handleMultiDateChange = (dates: Date[]) => {
    setShowCalendar(false);
    setSelectedDates(dates);
    
    const filtered = events.filter(event => {
      const eventDate = new Date(event.date || event.start_date);
      return dates.some(selectedDate => 
        eventDate.toDateString() === selectedDate.toDateString()
      );
    });
    
    setFilteredEvents(filtered);
    setActiveTab('all');
    setSearchQuery('');
    
    analyticsService.track({
      type: 'calendar_multi_select',
      userId: 'user123',
      properties: {
        selectedDates: dates.map(date => date.toISOString()),
        datesCount: dates.length,
        eventsFound: filtered.length,
      },
    });
  };

  const handleTabChange = (tab: 'all' | 'trending' | 'hot') => {
    setActiveTab(tab);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleQuickFilter = (filter: string) => {
    setSelectedQuickFilter(filter);
    setSearchQuery(filter);
    
    // Auto-apply filter after a short delay
    setTimeout(() => {
      setSelectedQuickFilter(null);
    }, 2000);
  };

  const getCurrentEvents = () => {
    if (searchQuery.trim() !== '') {
      return filteredEvents;
    }
    
    let currentEvents;
    switch (activeTab) {
      case 'trending':
        currentEvents = trendingEvents;
        break;
      case 'hot':
        currentEvents = hotNearYou;
        break;
      default:
        currentEvents = filteredEvents;
        break;
    }
    
    return currentEvents;
  };

  const getEventStats = () => {
    const currentEvents = getCurrentEvents();
    const totalEvents = events.length;
    const savedEvents = events.filter(e => e.isSaved).length;
    const trendingCount = trendingEvents.length;
    const hotCount = hotNearYou.length;
    
    return {
      total: totalEvents,
      current: currentEvents.length,
      saved: savedEvents,
      trending: trendingCount,
      hot: hotCount,
    };
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.priceRange.length > 0) count++;
    if (selectedFilters.eventTypes.length > 0) count++;
    if (selectedFilters.vibe.length > 0) count++;
    if (selectedFilters.distance !== 25) count++;
    if (selectedFilters.dateRange !== 'today') count++;
    if (selectedFilters.place && selectedFilters.place.trim() !== '') count++;
    return count;
  };

  const renderEnhancedHeader = () => (
    <View style={styles.header}>
      {/* Enhanced Search Bar */}
      <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
        <View style={styles.searchIconContainer}>
          <Ionicons name="search" size={20} color={searchFocused ? COLORS.primary : COLORS.textSecondary} />
        </View>
        <WebSearchInput
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholder="Discover amazing events..."
          testID="search-input"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <View style={styles.searchActions}>
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.calendarButton, showCalendar && styles.calendarButtonActive]}
            onPress={() => setShowCalendar(true)}
          >
            <Ionicons name="calendar" size={20} color={showCalendar ? COLORS.white : COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.filterButtonActive]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={20} color={getActiveFiltersCount() > 0 ? COLORS.white : COLORS.primary} />
            {getActiveFiltersCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Filters */}
      {showQuickFilters && (
        <View style={styles.quickFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Music', 'Food', 'Art', 'Nightlife', 'Wellness', 'Free'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.quickFilterChip,
                  selectedQuickFilter === filter && styles.quickFilterChipActive
                ]}
                onPress={() => handleQuickFilter(filter)}
              >
                <Text style={[
                  styles.quickFilterText,
                  selectedQuickFilter === filter && styles.quickFilterTextActive
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Enhanced Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => handleTabChange('all')}
        >
          <Ionicons 
            name="grid" 
            size={16} 
            color={activeTab === 'all' ? COLORS.white : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Events
          </Text>
          <View style={[styles.tabBadge, activeTab === 'all' && styles.tabBadgeActive]}>
            <Text style={styles.tabBadgeText}>{getEventStats().current}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => handleTabChange('trending')}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons 
              name="trending-up" 
              size={16} 
              color={activeTab === 'trending' ? COLORS.white : COLORS.warning} 
            />
          </Animated.View>
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>
            Trending
          </Text>
          <View style={[styles.tabBadge, activeTab === 'trending' && styles.tabBadgeActive]}>
            <Text style={styles.tabBadgeText}>{getEventStats().trending}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hot' && styles.activeTab]}
          onPress={() => handleTabChange('hot')}
        >
          <Ionicons 
            name="flame" 
            size={16} 
            color={activeTab === 'hot' ? COLORS.white : COLORS.error} 
          />
          <Text style={[styles.tabText, activeTab === 'hot' && styles.activeTabText]}>
            Hot Near You
          </Text>
          <View style={[styles.tabBadge, activeTab === 'hot' && styles.tabBadgeActive]}>
            <Text style={styles.tabBadgeText}>{getEventStats().hot}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Enhanced Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.statNumber}>{getEventStats().current}</Text>
          <Text style={styles.statLabel}>Events Found</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="heart" size={20} color={COLORS.error} />
          </View>
          <Text style={styles.statNumber}>{getEventStats().saved}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
      </View>

      {useMockData && (
        <View style={styles.mockDataNotice}>
          <Ionicons name="wifi-outline" size={16} color={COLORS.white} />
          <Text style={styles.mockDataText}>Showing sample data (offline mode)</Text>
        </View>
      )}
    </View>
  );

  const renderEvent = ({ item }: { item: Event }) => {
    return (
      <View style={styles.eventCardWrapper}>
        <EventCard
          event={item}
          onPress={() => handleEventPress(item)}
          onToggleSaved={() => handleToggleSaved(item)}
        />
      </View>
    );
  };

  if (selectedEvent) {
    navigation.navigate('EventDetail', { event: selectedEvent });
    setSelectedEvent(null);
    return null;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="compass" size={60} color={COLORS.primary} />
            </Animated.View>
            <Text style={styles.loadingText}>Discovering amazing events...</Text>
            <Text style={styles.loadingSubtext}>Finding the best experiences near you</Text>
          </View>
        ) : (
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <FlatList
              key={`events-${searchQuery}-${activeTab}-${forceUpdate}`}
              data={getCurrentEvents()}
              renderItem={renderEvent}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={renderEnhancedHeader}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={COLORS.primary}
                />
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="calendar-outline" size={60} color={COLORS.textSecondary} />
                  <Text style={styles.emptyText}>No events found</Text>
                  <Text style={styles.emptySubtext}>Try adjusting your filters or search terms</Text>
                  <TouchableOpacity style={styles.emptyActionButton}>
                    <Text style={styles.emptyActionText}>Clear Filters</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </Animated.View>
        )}

        <FilterModal
          visible={showFilters}
          filters={selectedFilters}
          onClose={() => setShowFilters(false)}
          onApply={handleApplyFilters}
          events={events}
        />

        {showCalendar && (
          <Calendar
            visible={showCalendar}
            onClose={() => setShowCalendar(false)}
            onDateSelect={handleDateChange}
            onDateRangeSelect={handleDateRangeChange}
            onMultiDateSelect={handleMultiDateChange}
            events={events}
            selectedDate={selectedDate}
            selectedDates={selectedDates}
            mode={calendarMode}
          />
        )}
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    paddingBottom: SPACING.xl,
    minHeight: 400,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    minHeight: 50,
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.cardBackground,
  },
  searchIconContainer: {
    marginRight: SPACING.sm,
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  clearSearchButton: {
    padding: SPACING.xs,
    marginRight: SPACING.xs,
  },
  calendarButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.xs,
  },
  calendarButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  filterBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickFiltersContainer: {
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  quickFilterChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickFilterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickFilterText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  quickFilterTextActive: {
    color: COLORS.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xs,
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    width: '95%',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  activeTabText: {
    color: COLORS.white,
  },
  tabBadge: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeActive: {
    backgroundColor: COLORS.white,
  },
  tabBadgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    width: '95%',
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  mockDataNotice: {
    backgroundColor: COLORS.warning,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
  },
  mockDataText: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
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
    fontWeight: 'bold',
    marginTop: SPACING.md,
  },
  loadingSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: 'bold',
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  emptyActionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
  },
  emptyActionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventCardWrapper: {
    // Enhanced wrapper for event cards
  },
});

export default DiscoverScreen; 