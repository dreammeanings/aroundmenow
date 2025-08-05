import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  url?: string;
}

class CalendarService {
  private calendarId: string | null = null;

  // Request calendar permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      return false;
    }
  }

  // Get default calendar
  async getDefaultCalendar(): Promise<string | null> {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.isPrimary);
      return defaultCalendar?.id || calendars[0]?.id || null;
    } catch (error) {
      console.error('Error getting default calendar:', error);
      return null;
    }
  }

  // Add event to calendar
  async addEventToCalendar(event: CalendarEvent): Promise<boolean> {
    try {
      console.log('🔍 CalendarService: Adding event to calendar:', event.title);
      console.log('🔍 CalendarService: Event details:', {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        description: event.description
      });
      
      // Request permissions if not already granted
      const hasPermission = await this.requestPermissions();
      console.log('🔍 CalendarService: Has permission:', hasPermission);
      
      if (!hasPermission) {
        console.log('🔍 CalendarService: No calendar permission');
        Alert.alert(
          'Calendar Permission Required',
          'Around Me Now needs access to your calendar to sync events. Please grant calendar permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              Alert.alert(
                'Enable Calendar Access',
                'To enable calendar access:\n\n📱 iOS: Settings > Privacy & Security > Calendars > Around Me Now\n\n🤖 Android: Settings > Apps > Around Me Now > Permissions > Calendar',
                [{ text: 'OK' }]
              );
            }}
          ]
        );
        return false;
      }

      // Get default calendar if not set
      if (!this.calendarId) {
        console.log('🔍 CalendarService: Getting default calendar');
        this.calendarId = await this.getDefaultCalendar();
        console.log('🔍 CalendarService: Default calendar ID:', this.calendarId);
        
        if (!this.calendarId) {
          console.log('🔍 CalendarService: No default calendar found');
          Alert.alert(
            'No Calendar Found',
            'Please set up a default calendar on your device to sync events. You can do this in your device\'s calendar settings.',
            [{ text: 'OK' }]
          );
          return false;
        }
      }

      // Create calendar event
      const calendarEvent = {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        notes: event.description,
        url: event.url,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        allDay: false,
        alarms: [
          {
            relativeOffset: -60, // 1 hour before
            method: Calendar.AlarmMethod.ALERT
          }
        ]
      };

      console.log('🔍 CalendarService: Creating calendar event with details:', calendarEvent);
      const eventId = await Calendar.createEventAsync(this.calendarId, calendarEvent);
      
      console.log('✅ CalendarService: Event added to calendar successfully:', eventId);
      
      // Verify the event was created
      const createdEvent = await Calendar.getEventAsync(eventId);
      console.log('🔍 CalendarService: Created event verification:', createdEvent);
      
      if (createdEvent) {
        Alert.alert(
          '✅ Event Added to Calendar',
          `${event.title} has been successfully added to your calendar!\n\n📅 Date: ${event.startDate.toLocaleDateString()}\n⏰ Time: ${event.startDate.toLocaleTimeString()}\n📍 Location: ${event.location || 'TBD'}`,
          [{ text: 'OK' }]
        );
        return true;
      } else {
        console.log('❌ CalendarService: Event creation verification failed');
        Alert.alert(
          'Calendar Sync Error',
          'The event was created but could not be verified. Please check your calendar app.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('❌ CalendarService: Error adding event to calendar:', error);
      console.error('❌ CalendarService: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        calendarId: this.calendarId,
        eventTitle: event.title
      });
      
      Alert.alert(
        'Calendar Sync Error',
        `Failed to add event to calendar: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your calendar permissions and try again.`,
        [{ text: 'OK' }]
      );
      return false;
    }
  }

  // Remove event from calendar
  async removeEventFromCalendar(eventId: string): Promise<boolean> {
    try {
      if (!this.calendarId) {
        return false;
      }

      await Calendar.deleteEventAsync(eventId);
      console.log('✅ Event removed from calendar:', eventId);
      return true;
    } catch (error) {
      console.error('Error removing event from calendar:', error);
      return false;
    }
  }

  // Check if event exists in calendar
  async eventExistsInCalendar(eventId: string): Promise<boolean> {
    try {
      if (!this.calendarId) {
        return false;
      }

      const events = await Calendar.getEventsAsync([this.calendarId], new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
      return events.some(event => event.id === eventId);
    } catch (error) {
      console.error('Error checking if event exists in calendar:', error);
      return false;
    }
  }

  // Sync all saved events to calendar
  async syncAllEvents(events: CalendarEvent[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const event of events) {
      const result = await this.addEventToCalendar(event);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    console.log(`📅 Calendar sync completed: ${success} successful, ${failed} failed`);
    return { success, failed };
  }

  // Get calendar sync status
  async getCalendarSyncStatus(): Promise<{
    hasPermission: boolean;
    hasCalendar: boolean;
    isEnabled: boolean;
  }> {
    try {
      const hasPermission = await this.requestPermissions();
      const hasCalendar = await this.getDefaultCalendar() !== null;
      
      return {
        hasPermission,
        hasCalendar,
        isEnabled: hasPermission && hasCalendar,
      };
    } catch (error) {
      console.error('Error getting calendar sync status:', error);
      return {
        hasPermission: false,
        hasCalendar: false,
        isEnabled: false,
      };
    }
  }

  // Simple test method to check if calendar service is accessible
  async simpleTest(): Promise<boolean> {
    try {
      console.log('🔍 CalendarService: Simple test - service is accessible');
      return true;
    } catch (error) {
      console.error('❌ CalendarService: Simple test failed:', error);
      return false;
    }
  }

  // Test method to check if calendar service is working
  async testCalendarService(): Promise<boolean> {
    try {
      console.log('🔍 CalendarService: Testing calendar service...');
      
      const hasPermission = await this.requestPermissions();
      console.log('🔍 CalendarService: Test - Has permission:', hasPermission);
      
      if (!hasPermission) {
        console.log('🔍 CalendarService: Test - No permission, cannot proceed');
        Alert.alert(
          'Calendar Permission Required',
          'Around Me Now needs calendar access to add events to your calendar. Please enable calendar permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Enable Permissions', onPress: () => {
              Alert.alert(
                'Enable Calendar Access',
                'To enable calendar access:\n\n📱 iOS: Settings > Privacy & Security > Calendars > Around Me Now\n\n🤖 Android: Settings > Apps > Around Me Now > Permissions > Calendar\n\nAfter enabling, restart the app and try again.',
                [{ text: 'OK' }]
              );
            }}
          ]
        );
        return false;
      }
      
      const calendarId = await this.getDefaultCalendar();
      console.log('🔍 CalendarService: Test - Default calendar ID:', calendarId);
      
      if (!calendarId) {
        console.log('🔍 CalendarService: Test - No default calendar found');
        Alert.alert(
          'No Calendar Found',
          'Please set up a default calendar on your device to sync events. You can do this in your device\'s calendar settings.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      console.log('🔍 CalendarService: Test - Calendar service is working');
      return true;
    } catch (error) {
      console.error('❌ CalendarService: Test - Error testing calendar service:', error);
      return false;
    }
  }

  // Quick test to check permissions without UI
  async quickPermissionTest(): Promise<{ hasPermission: boolean; hasCalendar: boolean; error?: string }> {
    try {
      console.log('🔍 CalendarService: Quick permission test...');
      
      const hasPermission = await this.requestPermissions();
      console.log('🔍 CalendarService: Quick test - Has permission:', hasPermission);
      
      if (!hasPermission) {
        return { hasPermission: false, hasCalendar: false, error: 'No calendar permission' };
      }
      
      const calendarId = await this.getDefaultCalendar();
      console.log('🔍 CalendarService: Quick test - Default calendar ID:', calendarId);
      
      if (!calendarId) {
        return { hasPermission: true, hasCalendar: false, error: 'No default calendar found' };
      }
      
      return { hasPermission: true, hasCalendar: true };
    } catch (error) {
      console.error('❌ CalendarService: Quick test - Error:', error);
      return { hasPermission: false, hasCalendar: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const calendarService = new CalendarService(); 