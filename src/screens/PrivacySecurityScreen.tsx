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
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import { apiService } from '../services/apiService';

interface PrivacySecurityScreenProps {
  onBack: () => void;
}

export default function PrivacySecurityScreen({ onBack }: PrivacySecurityScreenProps) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaved, setIsSaved] = useState(true); // Track if settings are saved

  // Privacy and security settings state
  const [profileVisibility, setProfileVisibility] = useState(user?.preferences?.profileVisibility || 'public');
  const [dataSharing, setDataSharing] = useState(user?.preferences?.dataSharing ?? false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(user?.preferences?.analyticsEnabled ?? true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(user?.preferences?.twoFactorAuth ?? false);
  const [loginNotifications, setLoginNotifications] = useState<boolean>(user?.preferences?.loginNotifications ?? true);

  // Debug analytics toggle changes
  const handleAnalyticsToggle = (value: boolean) => {
    console.log('🔄 Analytics toggle changed:', value);
    console.log('📊 Previous analytics value:', analyticsEnabled);
    setAnalyticsEnabled(value);
    console.log('📊 New analytics value set to:', value);
  };

  // Debug login notifications toggle changes
  const handleLoginNotificationsToggle = (value: boolean) => {
    console.log('🔄 Login notifications toggle changed:', value);
    console.log('📊 Previous login notifications value:', loginNotifications);
    setLoginNotifications(value);
    console.log('📊 New login notifications value set to:', value);
  };

  // Sync local state with user data when it changes
  useEffect(() => {
    if (user?.preferences) {
      console.log('🔄 Syncing local state with user data:', user.preferences);
      console.log('📊 Before sync - local state:', {
        profileVisibility,
        dataSharing,
        analyticsEnabled,
        twoFactorAuth,
        loginNotifications
      });
      
      setProfileVisibility(user.preferences.profileVisibility || 'public');
      setDataSharing(user.preferences.dataSharing ?? false);
      setAnalyticsEnabled(user.preferences.analyticsEnabled ?? true);
      setTwoFactorAuth(user.preferences.twoFactorAuth ?? false);
      setLoginNotifications(user.preferences.loginNotifications ?? true);
      
      console.log('✅ Sync completed for PrivacySecurityScreen');
      console.log('📊 After sync - user preferences:', {
        profileVisibility: user.preferences.profileVisibility,
        dataSharing: user.preferences.dataSharing,
        analyticsEnabled: user.preferences.analyticsEnabled,
        twoFactorAuth: user.preferences.twoFactorAuth,
        loginNotifications: user.preferences.loginNotifications
      });
    } else {
      console.log('⚠️ No preferences found in user data');
    }
  }, [user?.preferences]);

  // Track changes - run after local state has been synced
  useEffect(() => {
    // Only run change detection if user data is available
    if (!user?.preferences) return;
    
    const originalSettings = {
      profileVisibility: user.preferences.profileVisibility || 'public',
      dataSharing: user.preferences.dataSharing ?? false,
      analyticsEnabled: user.preferences.analyticsEnabled ?? true,
      twoFactorAuth: user.preferences.twoFactorAuth ?? false,
      loginNotifications: user.preferences.loginNotifications ?? true,
    };
    
    const currentSettings = { profileVisibility, dataSharing, analyticsEnabled, twoFactorAuth, loginNotifications };
    const changed = JSON.stringify(originalSettings) !== JSON.stringify(currentSettings);
    
    console.log('🔍 Change Detection Debug for PrivacySecurityScreen:');
    console.log('📊 Original settings:', originalSettings);
    console.log('📊 Current settings:', currentSettings);
    console.log('📊 Has changes:', changed);
    console.log('📊 Current isSaved:', isSaved);
    console.log('📊 User preferences:', user.preferences);
    console.log('🔍 Analytics specific debug:');
    console.log('   - Original analyticsEnabled:', originalSettings.analyticsEnabled);
    console.log('   - Current analyticsEnabled:', currentSettings.analyticsEnabled);
    console.log('   - Analytics changed:', originalSettings.analyticsEnabled !== currentSettings.analyticsEnabled);
    console.log('🔍 Login notifications specific debug:');
    console.log('   - Original loginNotifications:', originalSettings.loginNotifications);
    console.log('   - Current loginNotifications:', currentSettings.loginNotifications);
    console.log('   - Login notifications changed:', originalSettings.loginNotifications !== currentSettings.loginNotifications);
    
    setHasChanges(changed);
    
    // Reset saved state when changes are detected, or set to true when no changes
    if (changed) {
      console.log('🔄 Setting isSaved to false (changes detected)');
      setIsSaved(false);
    } else {
      console.log('✅ Setting isSaved to true (no changes)');
      setIsSaved(true);
    }
  }, [profileVisibility, dataSharing, analyticsEnabled, twoFactorAuth, loginNotifications, user?.preferences]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      console.log('💾 Starting save process...');
      console.log('📊 Current local state values:', {
        profileVisibility,
        dataSharing,
        analyticsEnabled,
        twoFactorAuth,
        loginNotifications
      });
      console.log('🔍 Analytics save debug:');
      console.log('   - analyticsEnabled type:', typeof analyticsEnabled);
      console.log('   - analyticsEnabled value:', analyticsEnabled);
      console.log('🔍 Login notifications save debug:');
      console.log('   - loginNotifications type:', typeof loginNotifications);
      console.log('   - loginNotifications value:', loginNotifications);
      
      const privacyData = {
        preferences: {
          ...user?.preferences,
          profileVisibility,
          dataSharing,
          analyticsEnabled,
          twoFactorAuth,
          loginNotifications,
        },
      };

      console.log('📤 Sending privacy settings:', privacyData);
      console.log('🔍 Analytics in privacyData:', privacyData.preferences.analyticsEnabled);
      console.log('🔍 Login notifications in privacyData:', privacyData.preferences.loginNotifications);

      // Add a small delay to make the save feel more responsive
      await new Promise(resolve => setTimeout(resolve, 100));

      await apiService.updatePreferences(privacyData.preferences);

      console.log('✅ Privacy settings saved to backend');

      // Refresh user data to reflect the saved changes
      await refreshUser();

      console.log('✅ User data refreshed');

      // Set saved state to true after successful save
      setIsSaved(true);

      console.log('✅ Local state updated - isSaved set to true');

      Alert.alert(
        '✅ Privacy & Security Settings Saved Successfully!',
        'Your privacy and security preferences have been updated and saved.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error saving privacy settings:', error);
      Alert.alert(
        'Error ❌',
        error instanceof Error ? error.message : 'Failed to update privacy settings. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    value: boolean | string,
    onValueChange: (value: any) => void,
    type: 'switch' | 'select' = 'switch',
    options?: string[]
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value as boolean}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
          ios_backgroundColor={COLORS.border}
          style={{ transform: [{ scale: 1.1 }] }}
        />
      ) : (
        <TouchableOpacity 
          style={styles.selectContainer}
          onPress={() => {
            if (options && options.length > 0) {
              // Find current index and cycle to next option
              const currentIndex = options.indexOf(value as string);
              const nextIndex = (currentIndex + 1) % options.length;
              onValueChange(options[nextIndex]);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.selectValue}>{value}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
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
          <Text style={styles.title}>Privacy & Security</Text>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (!hasChanges || isLoading) && styles.saveButtonDisabled,
              { transform: [{ scale: isLoading ? 0.95 : 1 }] }
            ]}
            onPress={handleSaveSettings}
            disabled={!hasChanges || isLoading}
            activeOpacity={0.7}
            data-testid="save-privacy-security-button"
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? '💾 Saving...' : isSaved && !hasChanges ? '✅ Saved' : '💾 Save Settings'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Privacy Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'eye',
                'Profile Visibility',
                'Control who can see your profile information',
                profileVisibility,
                setProfileVisibility,
                'select',
                ['public', 'friends', 'private']
              )}
              {renderSettingItem(
                'share',
                'Data Sharing',
                'Allow sharing of your data for app improvement',
                dataSharing,
                setDataSharing,
                'switch'
              )}
              {renderSettingItem(
                'analytics',
                'Analytics',
                'Help improve the app with anonymous usage data',
                analyticsEnabled,
                handleAnalyticsToggle,
                'switch'
              )}
            </View>
          </View>

          {/* Security Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'shield-checkmark',
                'Two-Factor Authentication',
                'Add an extra layer of security to your account',
                twoFactorAuth,
                setTwoFactorAuth,
                'switch'
              )}
              {renderSettingItem(
                'notifications',
                'Login Notifications',
                'Get notified when someone logs into your account',
                loginNotifications,
                handleLoginNotificationsToggle,
                'switch'
              )}
            </View>
          </View>

          {/* Account Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Security</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  Your account security is our top priority. We use industry-standard encryption to protect your data.
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="lock-closed" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  You can change your password and manage account access from your device settings.
                </Text>
              </View>
            </View>
          </View>

          {/* Data Protection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Protection</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  We never share your personal information with third parties without your explicit consent.
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="trash" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  You can request deletion of your data at any time through our support team.
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
  saveButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
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
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  settingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: SPACING.xs,
  },
  infoContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginLeft: SPACING.sm,
    flex: 1,
  },
}); 