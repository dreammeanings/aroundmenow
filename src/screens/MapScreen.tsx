import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import { MapView, Marker, PROVIDER_GOOGLE } from '../utils/mapUtils';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
} from '../utils/constants';
import { analyticsService } from '../services/analyticsService';
import EventDetailScreen from './EventDetailScreen';
import { eventService } from '../services/eventService';

export default function MapScreen() {
  console.log('MapScreen component rendered');
  
  const [isMapAvailable, setIsMapAvailable] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });
  const [mapEvents, setMapEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    console.log('MapScreen useEffect triggered');
    checkMapAvailability();
    loadMapEvents();
    analyticsService.trackScreenView('MapScreen');
  }, []);

  const checkMapAvailability = () => {
    const isAvailable = MapView !== null;
    console.log('Map availability check:', isAvailable, 'Platform:', Platform.OS);
    setIsMapAvailable(isAvailable);
  };

  const loadMapEvents = async () => {
    try {
      console.log('Loading map events...');
      const events = await eventService.getEvents();
      console.log('Events loaded for map:', events.length);
      
      const mapEvents = events.map(event => ({
        ...event,
        coordinate: {
          latitude: event.latitude || 37.7749,
          longitude: event.longitude || -122.4194,
        },
        title: event.title,
        description: event.description,
      }));
      setMapEvents(mapEvents);
    } catch (error) {
      console.error('Error loading map events:', error);
      setMapEvents([]);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const getMarkerColor = (priceRange?: string) => {
    switch (priceRange) {
      case 'Free':
        return '#4CAF50';
      case '$':
        return '#FF9800';
      case '$$':
        return '#F44336';
      case '$$$':
        return '#9C27B0';
      default:
        return COLORS.primary;
    }
  };

  const handleLocationButtonPress = () => {
    // Recalculate distances when location button is pressed
    const eventsWithDistance = mapEvents.map(event => ({
      ...event,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        event.coordinate.latitude,
        event.coordinate.longitude
      ),
    }));
    setMapEvents(eventsWithDistance);
  };

  const handleMarkerPress = (event: any) => {
    setSelectedEvent(event);
    analyticsService.track({
      type: 'map_marker_pressed',
      userId: 'user-1',
      properties: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleEventCardPress = (event: Event) => {
    setSelectedEvent(event);
    analyticsService.track({
      type: 'map_event_card_pressed',
      userId: 'user-1',
      properties: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleEventSave = (eventId: string) => {
    console.log('Event saved:', eventId);
    analyticsService.track({
      type: 'event_saved',
      userId: 'user-1',
      properties: {
        eventId,
        source: 'map_screen',
      },
    });
  };

  const handleMapPress = () => {
    console.log('Map pressed');
    analyticsService.track({ 
      type: 'map_interaction', 
      userId: 'user-1', 
      properties: { action: 'map_press' } 
    });
  };

  if (selectedEvent) {
    return (
      <EventDetailScreen
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
        onToggleSaved={() => handleEventSave(selectedEvent.id)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Interactive Map View</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'web' 
            ? 'Experience the full interactive map on mobile with Expo Go'
            : 'Real-time location tracking and event discovery'
          }
        </Text>
      </View>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        {isMapAvailable ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onPress={handleMapPress}
          >
            {mapEvents.map((event) => (
              <Marker
                key={event.id}
                coordinate={event.coordinate}
                title={event.title}
                description={`${event.venue?.name || event.venue_name} • ${event.price === 0 ? 'Free' : `$${event.price}`}`}
                onPress={() => handleMarkerPress(event)}
              >
                <View style={[styles.marker, { backgroundColor: getMarkerColor(event.priceRange) }]}>
                  <Ionicons name="location" size={16} color={COLORS.white} />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={styles.webPlaceholder}>
            <View style={styles.placeholderContent}>
              <Ionicons name="map" size={64} color={COLORS.primary} />
              <Text style={styles.placeholderTitle}>Interactive Map</Text>
              <Text style={styles.placeholderText}>
                {Platform.OS === 'web' 
                  ? 'Scan the QR code with Expo Go to experience the full interactive map with real-time location tracking, custom markers, and event discovery.'
                  : 'Map functionality is being loaded...'
                }
              </Text>
              
              {Platform.OS === 'web' && (
                <View style={styles.webFeatures}>
                  <View style={styles.featureItem}>
                    <Ionicons name="location" size={20} color={COLORS.primary} />
                    <Text style={styles.featureText}>Real-time GPS tracking</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="navigate" size={20} color={COLORS.primary} />
                    <Text style={styles.featureText}>Distance calculations</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="map" size={20} color={COLORS.primary} />
                    <Text style={styles.featureText}>Interactive markers</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="notifications" size={20} color={COLORS.primary} />
                    <Text style={styles.featureText}>Geofence alerts</Text>
                  </View>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.testButton}
                onPress={() => {
                  if (Platform.OS === 'web') {
                    Alert.alert(
                      'Mobile Map Experience', 
                      'To experience the full interactive map:\n\n1. Download Expo Go from your app store\n2. Scan the QR code above\n3. Enjoy real-time location tracking and event discovery!'
                    );
                  } else {
                    Alert.alert('Map Test', 'Map functionality is working on mobile!');
                  }
                }}
              >
                <Text style={styles.testButtonText}>
                  {Platform.OS === 'web' ? 'Learn More' : 'Test Map'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Location Button */}
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={handleLocationButtonPress}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Nearby Events List */}
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Nearby Events</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScroll}
        >
          {mapEvents.slice(0, 5).map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => handleEventCardPress(event)}
              activeOpacity={0.8}
            >
              <View style={styles.eventImage}>
                {event.images && event.images.length > 0 && event.images[0] ? (
                  <Image 
                    source={{ uri: event.images[0] }} 
                    style={styles.eventImageSource}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.eventImageSource, styles.placeholderImage]}>
                    <Ionicons name="calendar" size={32} color={COLORS.primary} />
                  </View>
                )}
                <View style={[styles.priceBadge, { backgroundColor: getMarkerColor(event.priceRange) }]}>
                  <Text style={styles.priceText}>{event.price === 0 ? 'Free' : `$${event.price}`}</Text>
                </View>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                <Text style={styles.eventVenue} numberOfLines={1}>
                  {event.venue?.name || event.venue_name || 'Unknown Venue'}
                </Text>
                <View style={styles.eventMeta}>
                  <Ionicons name="calendar" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.eventTime}>
                    {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'} • {event.time || 'TBD'}
                  </Text>
                </View>
                {event.distance && (
                  <View style={styles.eventDistance}>
                    <Ionicons name="navigate" size={12} color={COLORS.textSecondary} />
                    <Text style={styles.distanceText}>{event.distance.toFixed(1)} miles</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  placeholderContent: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  testButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  eventsScroll: {
    alignItems: 'center',
  },
  eventCard: {
    width: 250,
    height: 150,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.cardBackground,
    marginRight: SPACING.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  eventImageSource: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.lg,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  priceText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventInfo: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  eventVenue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  eventDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
}); 