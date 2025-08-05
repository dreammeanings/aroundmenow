import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Switch,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { calendarService } from '../services/calendarService';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

export default function NotificationSettingsScreen({ onBack }: NotificationSettingsScreenProps) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaved, setIsSaved] = useState(true); // Track if settings are saved
  const [calendarSyncStatus, setCalendarSyncStatus] = useState<{
    hasPermission: boolean;
    hasCalendar: boolean;
    isEnabled: boolean;
  } | null>(null);

  // Notification settings state
  const [pushNotifications, setPushNotifications] = useState(user?.notificationSettings?.push ?? true);
  const [emailNotifications, setEmailNotifications] = useState(user?.notificationSettings?.email ?? true);
  const [weeklyDigest, setWeeklyDigest] = useState(user?.notificationSettings?.weeklyDigest ?? false);
  const [calendarSync, setCalendarSync] = useState(user?.notificationSettings?.calendarSync ?? false);

  console.log('🔍 Initial State Debug:', {
    userNotificationSettings: user?.notificationSettings,
    pushNotifications,
    emailNotifications,
    weeklyDigest,
    isSaved,
    hasChanges
  });

  // Sync local state with user data when it changes
  useEffect(() => {
    if (user?.notificationSettings) {
      console.log('🔄 Syncing local state with user data:', user.notificationSettings);
      setPushNotifications(user.notificationSettings.push ?? true);
      setEmailNotifications(user.notificationSettings.email ?? true);
      setWeeklyDigest(user.notificationSettings.weeklyDigest ?? false);
      setCalendarSync(user.notificationSettings.calendarSync ?? false);
      console.log('✅ Sync completed for NotificationSettingsScreen');
    } else {
      console.log('⚠️ No notification settings found in user data');
    }
  }, [user?.notificationSettings]);

  // Track changes
  useEffect(() => {
    const originalSettings = {
      push: user?.notificationSettings?.push ?? true,
      email: user?.notificationSettings?.email ?? true,
      weeklyDigest: user?.notificationSettings?.weeklyDigest ?? false,
      calendarSync: user?.notificationSettings?.calendarSync ?? false,
    };
    
    const currentSettings = { push: pushNotifications, email: emailNotifications, weeklyDigest, calendarSync };
    const changed = JSON.stringify(originalSettings) !== JSON.stringify(currentSettings);
    
    console.log('🔍 Change Detection Debug for NotificationSettingsScreen:');
    console.log('📊 Original settings:', originalSettings);
    console.log('📊 Current settings:', currentSettings);
    console.log('📊 Has changes:', changed);
    console.log('📊 Current isSaved:', isSaved);
    console.log('📊 User notification settings:', user?.notificationSettings);
    
    setHasChanges(changed);
    
    // Reset saved state when changes are detected, or set to true when no changes
    if (changed) {
      console.log('🔄 Setting isSaved to false (changes detected)');
      setIsSaved(false);
    } else {
      console.log('✅ Setting isSaved to true (no changes)');
      setIsSaved(true);
    }
  }, [pushNotifications, emailNotifications, weeklyDigest, calendarSync, user]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Check calendar sync status
  React.useEffect(() => {
    const checkCalendarStatus = async () => {
      const status = await calendarService.getCalendarSyncStatus();
      setCalendarSyncStatus(status);
    };
    
    checkCalendarStatus();
  }, []);

  const handleToggle = (setting: 'push' | 'email' | 'weeklyDigest' | 'calendarSync') => {
    switch (setting) {
      case 'push':
        setPushNotifications(!pushNotifications);
        break;
      case 'email':
        setEmailNotifications(!emailNotifications);
        break;
      case 'weeklyDigest':
        setWeeklyDigest(!weeklyDigest);
        break;
      case 'calendarSync':
        setCalendarSync(!calendarSync);
        break;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const notificationData = {
        push: pushNotifications,
        email: emailNotifications,
        weeklyDigest: weeklyDigest,
        calendarSync: calendarSync,
      };

      console.log('📤 Sending notification update data:', notificationData);
      console.log('📤 Data being sent to backend:', JSON.stringify(notificationData, null, 2));

      // Add a small delay to make the save feel more responsive
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use the dedicated notification settings endpoint
      await apiService.updateNotificationSettings(notificationData);

      // Refresh user data to reflect the saved changes
      await refreshUser();

      // Set saved state to true after successful save
      console.log('💾 Save completed, setting isSaved to true');
      setIsSaved(true);

      Alert.alert(
        '✅ Settings Saved Successfully!',
        'Your notification preferences have been updated and saved. You can now return to your profile page.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Add a small delay before going back to make the success message more noticeable
              setTimeout(() => {
                onBack();
              }, 500);
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error saving notification settings:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
      Alert.alert(
        '❌ Save Failed',
        error instanceof Error ? error.message : 'Failed to update notification settings. Please try again.',
        [{ text: 'Try Again' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    value: boolean,
    onToggle: () => void,
    disabled?: boolean
  ) => (
    <View style={[styles.settingItem, disabled && styles.settingItemDisabled]}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, disabled && styles.settingTitleDisabled]}>{title}</Text>
        <Text style={[styles.settingDescription, disabled && styles.settingDescriptionDisabled]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={COLORS.white}
        ios_backgroundColor={COLORS.border}
        style={{ transform: [{ scale: 1.1 }] }}
        data-testid={`${title.toLowerCase().replace(/\s+/g, '-')}-toggle`}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Notification Settings</Text>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (!hasChanges || isLoading) && styles.saveButtonDisabled,
              { transform: [{ scale: isLoading ? 0.95 : 1 }] }
            ]}
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
            activeOpacity={0.7}
            data-testid="save-notification-settings-button"
          >
            <Text style={styles.saveButtonText}>
              {(() => {
                const buttonText = isLoading ? '💾 Saving...' : isSaved && !hasChanges ? '✅ Saved' : '💾 Save Settings';
                console.log('🔍 Button Text Debug:', { isLoading, isSaved, hasChanges, buttonText });
                return buttonText;
              })()}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Push Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'notifications',
                'Push Notifications',
                'Receive instant notifications about events and updates',
                pushNotifications,
                () => handleToggle('push')
              )}
            </View>
          </View>

          {/* Email Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email Notifications</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'mail',
                'Email Notifications',
                'Receive event updates and important information via email',
                emailNotifications,
                () => handleToggle('email')
              )}
            </View>
          </View>

          {/* Digest Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Digest</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'calendar',
                'Weekly Digest',
                'Get a weekly summary of events and activities',
                weeklyDigest,
                () => handleToggle('weeklyDigest')
              )}
            </View>
          </View>

          {/* Calendar Sync */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calendar Integration</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'calendar-outline',
                'Calendar Sync',
                calendarSyncStatus ? 
                  `Automatically add events to your device calendar${calendarSyncStatus.isEnabled ? ' (Ready)' : ' (Permission needed)'}` :
                  'Automatically add events to your device calendar',
                calendarSync,
                () => handleToggle('calendarSync')
              )}
            </View>
            {calendarSyncStatus && !calendarSyncStatus.isEnabled && calendarSync && (
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.infoText}>
                    {!calendarSyncStatus.hasPermission 
                      ? 'Calendar permission is required to sync events. Please grant permission in your device settings.'
                      : 'No calendar found. Please set up a default calendar on your device.'
                    }
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Notification Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Types</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  You'll receive notifications for events near you, friend activities, and important updates.
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  Notifications are sent in real-time to keep you updated on the latest events.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  backButton: {
    padding: SPACING.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: SPACING.lg, // Adjust as needed for spacing
  },
  saveButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'center',
    marginTop: SPACING.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.lg,
  },
  settingsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingItemDisabled: {
    opacity: 0.7,
  },
  settingIcon: {
    marginRight: SPACING.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingTitleDisabled: {
    color: COLORS.textSecondary,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  settingDescriptionDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginLeft: SPACING.sm,
  },
}); 