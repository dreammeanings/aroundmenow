import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Event } from '../types';

export interface NotificationConfig {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  priority?: Notifications.AndroidNotificationPriority;
  channelId?: string;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  trigger: Notifications.NotificationTriggerInput;
  data?: Record<string, any>;
}

export interface NotificationChannel {
  id: string;
  name: string;
  description?: string;
  importance: Notifications.AndroidImportance;
  sound?: string;
  vibrationPattern?: number[];
}

class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted - using fallback');
        // Continue without notifications
        this.isInitialized = true;
        return;
      }

      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // Create notification channels for Android
      if (Platform.OS === 'android') {
        await this.createNotificationChannels();
      }

      this.isInitialized = true;
    } catch (error) {
      console.log('Notification initialization failed - using fallback:', error);
      // Continue without notifications
      this.isInitialized = true;
    }
  }

  private async createNotificationChannels(): Promise<void> {
    const channels: NotificationChannel[] = [
      {
        id: 'events',
        name: 'Event Notifications',
        description: 'Notifications about events near you',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      },
      {
        id: 'reminders',
        name: 'Event Reminders',
        description: 'Reminders for saved events',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      },
      {
        id: 'geofence',
        name: 'Location Alerts',
        description: 'Notifications when you enter event areas',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 500, 250, 500],
      },
      {
        id: 'weekly',
        name: 'Weekly Digest',
        description: 'Weekly event summaries',
        importance: Notifications.AndroidImportance.LOW,
      },
    ];

    for (const channel of channels) {
      await Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        description: channel.description,
        importance: channel.importance,
        sound: channel.sound,
        vibrationPattern: channel.vibrationPattern,
      });
      this.channels.set(channel.id, channel);
    }
  }

  async sendNotification(config: NotificationConfig): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: config.title,
        body: config.body,
        data: config.data || {},
        sound: config.sound !== false,
      },
      trigger: null, // Send immediately
    });

    return notificationId;
  }

  async scheduleNotification(config: ScheduledNotification): Promise<string> {
    try {
      const { trigger, ...notificationConfig } = config;
      
      // Create proper trigger object
      let notificationTrigger: any;
      
      if (trigger && 'seconds' in trigger) {
        notificationTrigger = {
          type: 'timeInterval',
          seconds: trigger.seconds,
        };
      } else if (trigger && 'hour' in trigger) {
        notificationTrigger = {
          type: 'calendar',
          hour: trigger.hour,
          minute: trigger.minute,
        };
      } else if (trigger && 'date' in trigger) {
        notificationTrigger = {
          type: 'date',
          date: trigger.date,
        };
      } else {
        notificationTrigger = trigger;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationConfig.title,
          body: notificationConfig.body,
          data: notificationConfig.data,
        },
        trigger: notificationTrigger,
      });

      console.log('Notification scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getPendingNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Event-specific notification methods
  async sendEventReminder(event: Event, hoursBefore: number = 2): Promise<string> {
    try {
      const eventTime = new Date(event.date);
      const reminderTime = new Date(eventTime.getTime() - hoursBefore * 60 * 60 * 1000);
      const secondsUntilReminder = Math.floor((reminderTime.getTime() - Date.now()) / 1000);

      if (secondsUntilReminder > 0) {
        return await this.scheduleNotification({
          title: `Reminder: ${event.title}`,
          body: `Your event starts in ${hoursBefore} hours at ${event.venue?.name || 'Unknown venue'}`,
          data: { eventId: event.id, type: 'event_reminder' },
          sound: true,
          channelId: 'reminders',
          trigger: { 
            seconds: secondsUntilReminder 
          }
        });
      } else {
        // Send immediately if reminder time has passed
        return await this.sendNotification({
          title: `Reminder: ${event.title}`,
          body: `Your event starts in ${hoursBefore} hours at ${event.venue?.name || 'Unknown venue'}`,
          data: { eventId: event.id, type: 'event_reminder' },
          sound: true,
          channelId: 'reminders',
        });
      }
    } catch (error) {
      console.log('Event reminder scheduling failed:', error);
      return 'reminder-failed';
    }
  }

  async sendGeofenceNotification(event: Event, distance: number): Promise<string> {
    try {
      return await this.sendNotification({
        title: `You're near ${event.title}!`,
        body: `You're ${distance.toFixed(1)} miles away from this event.`,
        data: { eventId: event.id, type: 'geofence' },
        sound: true,
        channelId: 'geofence',
      });
    } catch (error) {
      console.log('Geofence notification failed:', error);
      return 'geofence-failed';
    }
  }

  async sendWeeklyDigest(events: Event[]): Promise<string> {
    try {
      const eventTitles = events.slice(0, 5).map(event => event.title).join(', ');
      
      return await this.sendNotification({
        title: 'This Week\'s Events',
        body: `Don't miss out: ${eventTitles}${events.length > 5 ? ' and more!' : ''}`,
        data: { type: 'weekly_digest', eventCount: events.length },
        sound: true,
        channelId: 'digest',
      });
    } catch (error) {
      console.log('Weekly digest failed:', error);
      return 'digest-failed';
    }
  }

  async sendNewEventNotification(event: Event): Promise<string> {
    try {
      return await this.sendNotification({
        title: 'New Event Nearby!',
        body: `${event.title} at ${event.venue?.name || 'Unknown venue'} - ${event.price === 0 ? 'Free' : `$${event.price}`}`,
        data: { eventId: event.id, type: 'new_event' },
        sound: true,
        channelId: 'new_events',
      });
    } catch (error) {
      console.log('New event notification failed:', error);
      return 'new-event-failed';
    }
  }

  async sendFriendAttendingNotification(
    event: Event,
    friendName: string
  ): Promise<string> {
    try {
      return await this.sendNotification({
        title: `${friendName} is going!`,
        body: `${friendName} is attending ${event.title} at ${event.venue?.name || 'Unknown venue'}`,
        data: { eventId: event.id, type: 'friend_attending', friendName },
        sound: true,
        channelId: 'social',
      });
    } catch (error) {
      console.log('Friend attending notification failed:', error);
      return 'friend-failed';
    }
  }

  // Schedule recurring notifications
  async scheduleWeeklyDigest(dayOfWeek: number = 0, hour: number = 9): Promise<string> {
    try {
      return await this.scheduleNotification({
        title: 'Weekly Event Digest',
        body: 'Check out this week\'s best events near you!',
        data: { type: 'weekly_digest' },
        sound: true,
        channelId: 'digest',
        trigger: {
          hour,
          minute: 0,
          weekday: dayOfWeek,
        }
      });
    } catch (error) {
      console.log('Weekly digest scheduling failed:', error);
      return 'digest-schedule-failed';
    }
  }

  async scheduleDailyRecommendations(hour: number = 10): Promise<string> {
    try {
      return await this.scheduleNotification({
        title: 'Today\'s Recommendations',
        body: 'Discover amazing events happening today!',
        data: { type: 'daily_recommendations' },
        sound: true,
        channelId: 'recommendations',
        trigger: {
          hour,
          minute: 0,
        }
      });
    } catch (error) {
      console.log('Daily recommendations scheduling failed:', error);
      return 'recommendations-schedule-failed';
    }
  }

  async scheduleGeofenceNotification(
    title: string,
    body: string,
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<string> {
    try {
      // Note: Location-based triggers are not supported in Expo Notifications
      // This is a placeholder for future implementation
      console.log('Location-based notifications not supported in Expo');
      return 'geofence-not-supported';
    } catch (error) {
      console.log('Geofence notification scheduling failed:', error);
      return 'geofence-schedule-failed';
    }
  }

  // Get notification token for server registration
  async getExpoPushToken(): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your Expo project ID
      });
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Handle notification responses
  setNotificationResponseHandler(
    handler: (response: Notifications.NotificationResponse) => void
  ): void {
    Notifications.addNotificationResponseReceivedListener(handler);
  }

  // Handle notification received while app is in foreground
  setNotificationReceivedHandler(
    handler: (notification: Notifications.Notification) => void
  ): void {
    Notifications.addNotificationReceivedListener(handler);
  }

  private async handleNotification(notification: Notifications.Notification): Promise<Notifications.NotificationBehavior> {
    // Handle notification when app is in foreground
    console.log('Received notification:', notification);
    
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  }
}

export const notificationService = new NotificationService(); 