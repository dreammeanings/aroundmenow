import * as Location from 'expo-location';
import { LocationObject, LocationAccuracy } from 'expo-location';
import { Event, Location as EventLocation } from '../types';

export interface LocationServiceConfig {
  accuracy: LocationAccuracy;
  timeInterval: number;
  distanceInterval: number;
  geofenceRadius: number;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface GeofenceEvent {
  eventId: string;
  eventTitle: string;
  distance: number;
  entered: boolean;
  timestamp: number;
}

class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;
  private geofenceEvents: Map<string, Event> = new Map();
  private config: LocationServiceConfig = {
    accuracy: LocationAccuracy.High,
    timeInterval: 10000, // 10 seconds
    distanceInterval: 100, // 100 meters
    geofenceRadius: 500, // 500 meters
  };

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied - using fallback');
        return false;
      }

      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        console.log('Background location permission denied - using fallback');
        return false;
      }

      return true;
    } catch (error) {
      console.log('Location permission request failed - using fallback:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<LocationUpdate | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: this.config.accuracy,
      });

      const address = await this.reverseGeocode(location.coords);
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: location.timestamp,
        ...address,
      };
    } catch (error) {
      console.log('Error getting current location - using fallback:', error);
      // Return a fallback location (San Francisco)
      return {
        latitude: 37.78825,
        longitude: -122.4324,
        accuracy: 1000,
        timestamp: Date.now(),
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
      };
    }
  }

  async startLocationTracking(
    onLocationUpdate: (location: LocationUpdate) => void,
    onGeofenceEvent?: (event: GeofenceEvent) => void
  ): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.log('Location permission not granted - location tracking disabled');
      return;
    }

    try {
      // Enable background location updates
      await Location.enableNetworkProviderAsync();

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: this.config.accuracy,
          timeInterval: this.config.timeInterval,
          distanceInterval: this.config.distanceInterval,
        },
        async (location) => {
          const address = await this.reverseGeocode(location.coords);
          const locationUpdate: LocationUpdate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 0,
            timestamp: location.timestamp,
            ...address,
          };

          onLocationUpdate(locationUpdate);

          // Check geofence events
          if (onGeofenceEvent) {
            this.checkGeofenceEvents(locationUpdate, onGeofenceEvent);
          }
        }
      );
    } catch (error) {
      console.log('Location tracking failed - continuing without location services:', error);
      // Continue without location tracking
    }
  }

  stopLocationTracking(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  async reverseGeocode(coords: { latitude: number; longitude: number }): Promise<{
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }> {
    try {
      const results = await Location.reverseGeocodeAsync(coords);
      if (results.length > 0) {
        const result = results[0];
        return {
          address: result.street ? `${result.street} ${result.streetNumber || ''}`.trim() : undefined,
          city: result.city || undefined,
          state: result.region || undefined,
          zipCode: result.postalCode || undefined,
        };
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
    return {};
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance * 0.621371; // Convert to miles
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  addGeofenceEvent(event: Event): void {
    this.geofenceEvents.set(event.id, event);
  }

  removeGeofenceEvent(eventId: string): void {
    this.geofenceEvents.delete(eventId);
  }

  private checkGeofenceEvents(
    currentLocation: LocationUpdate,
    onGeofenceEvent: (event: GeofenceEvent) => void
  ): void {
    this.geofenceEvents.forEach((event, eventId) => {
      if (!event.location) return;
      
      const distance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        event.location.latitude,
        event.location.longitude
      );

      const isWithinGeofence = distance <= this.config.geofenceRadius / 1000; // Convert to km

      if (isWithinGeofence) {
        onGeofenceEvent({
          eventId,
          eventTitle: event.title,
          distance,
          entered: true,
          timestamp: Date.now(),
        });
      }
    });
  }

  async getNearbyEvents(
    events: Event[],
    userLocation: LocationUpdate,
    radius: number
  ): Promise<Event[]> {
    return events.filter(event => {
      if (!event.location) return false;
      
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        event.location.latitude,
        event.location.longitude
      );
      return distance <= radius;
    });
  }

  setConfig(config: Partial<LocationServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const locationService = new LocationService(); 