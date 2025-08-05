import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import { apiService } from '../services/apiService';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateToLocationSettings?: () => void;
  onNavigateToPrivacySettings?: () => void;
}

export default function SettingsScreen({ 
  onBack, 
  onNavigateToLocationSettings,
  onNavigateToPrivacySettings 
}: SettingsScreenProps) {
  const { user, updateUser, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Location Settings
  const [locationEnabled, setLocationEnabled] = useState(user?.preferences?.locationEnabled ?? true);
  const [locationPrecision, setLocationPrecision] = useState(user?.preferences?.locationPrecision ?? 'high');

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState(user?.preferences?.profileVisibility ?? 'public');
  const [dataSharing, setDataSharing] = useState(user?.preferences?.dataSharing ?? true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(user?.preferences?.analyticsEnabled ?? true);

  // Sync local state with user data when it changes
  React.useEffect(() => {
    if (user?.preferences) {
      console.log('🔄 Syncing local state with user data:', user.preferences);
      setLocationEnabled(user.preferences.locationEnabled ?? true);
      setLocationPrecision(user.preferences.locationPrecision ?? 'high');
      setProfileVisibility(user.preferences.profileVisibility ?? 'public');
      setDataSharing(user.preferences.dataSharing ?? true);
      setAnalyticsEnabled(user.preferences.analyticsEnabled ?? true);
      console.log('✅ Sync completed for SettingsScreen');
    }
  }, [user?.preferences]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveSettings = async (settingsType: string, settings: any) => {
    setIsLoading(true);
    try {
      console.log('🔄 Saving settings:', settingsType, settings);
      
      // Add a small delay to make the save feel more responsive
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use the appropriate API method based on settings type
      if (settingsType === 'Location' || settingsType === 'Privacy' || settingsType === 'Security' || settingsType === 'All') {
        // For preferences, use the dedicated preferences endpoint
        await apiService.updatePreferences(settings.preferences);
      } else {
        // For other settings, use the general profile update
        await updateUser(settings);
      }
      
      // Refresh user data to reflect the saved changes
      await refreshUser();
      console.log('✅ User data refreshed after save');
      
      Alert.alert(
        '✅ Settings Saved Successfully!',
        `Your ${settingsType.toLowerCase()} settings have been updated and saved.`,
        [{ text: 'OK' }]
      );
      
      // Fallback console message
      console.log('✅ Settings saved successfully:', settingsType);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
      
      Alert.alert(
        '❌ Save Failed',
        error instanceof Error ? error.message : 'Failed to update settings. Please try again.',
        [{ text: 'Try Again' }]
      );
      
      // Fallback console message
      console.log('❌ Settings save failed:', settingsType, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLocationSettings = () => {
    console.log('🔘 handleSaveLocationSettings called');
    console.log('📊 Current location settings:', { locationEnabled, locationPrecision });
    const locationSettings = {
      preferences: {
        ...user?.preferences,
        locationEnabled,
        locationPrecision,
      }
    };
    console.log('📤 Sending location settings:', locationSettings);
    handleSaveSettings('Location', locationSettings);
  };

  const handleSavePrivacySettings = () => {
    console.log('🔘 handleSavePrivacySettings called');
    console.log('📊 Current privacy settings:', { profileVisibility, dataSharing, analyticsEnabled });
    const privacySettings = {
      preferences: {
        ...user?.preferences,
        profileVisibility,
        dataSharing,
        analyticsEnabled,
      }
    };
    console.log('📤 Sending privacy settings:', privacySettings);
    handleSaveSettings('Privacy', privacySettings);
  };

  const handleLocationSettings = () => {
    if (onNavigateToLocationSettings) {
      onNavigateToLocationSettings();
    } else {
      // Fallback - show alert with instructions
      Alert.alert(
        'Location Settings',
        'Please use the "Location Settings" button on the main profile screen.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePrivacySettings = () => {
    if (onNavigateToPrivacySettings) {
      onNavigateToPrivacySettings();
    } else {
      // Fallback - show alert with instructions
      Alert.alert(
        'Privacy Settings',
        'Please use the "Privacy & Security" button on the main profile screen.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    value?: boolean,
    onValueChange?: (value: boolean) => void,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress && !onValueChange}
      activeOpacity={0.7}
    >
      <View style={styles.settingInfo}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      {onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor={COLORS.white}
          ios_backgroundColor={COLORS.border}
          style={{ transform: [{ scale: 1.1 }] }}
        />
      )}
      {onPress && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const renderSaveButton = (title: string, onPress: () => void) => (
    <TouchableOpacity 
      style={[
        styles.saveButton, 
        isLoading && styles.saveButtonDisabled,
        { transform: [{ scale: isLoading ? 0.95 : 1 }] }
      ]}
      onPress={() => {
        console.log('🔘 Save button pressed:', title);
        onPress();
      }}
      disabled={isLoading}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`Save ${title}`}
      accessibilityHint={`Double tap to save ${title}`}
      data-testid={`save-${title.toLowerCase().replace(/\s+/g, '-')}-button`}
    >
      <Text style={styles.saveButtonText}>
        {isLoading ? 'Saving...' : title}
      </Text>
    </TouchableOpacity>
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
          <Text style={styles.title}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Location Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Settings</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'location',
                'Location Services',
                'Allow app to access your location for nearby events',
                locationEnabled,
                setLocationEnabled
              )}
              {renderSettingItem(
                'navigate',
                'Location Precision',
                'High precision location for better event discovery',
                undefined,
                undefined,
                handleLocationSettings
              )}
            </View>
            {renderSaveButton('Save Location Settings', handleSaveLocationSettings)}
          </View>

          {/* Privacy Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'eye',
                'Profile Visibility',
                'Control who can see your profile information',
                undefined,
                undefined,
                handlePrivacySettings
              )}
              {renderSettingItem(
                'share',
                'Data Sharing',
                'Share anonymous data to improve app experience',
                dataSharing,
                setDataSharing
              )}
              {renderSettingItem(
                'analytics',
                'Analytics',
                'Help us improve by sharing usage analytics',
                analyticsEnabled,
                setAnalyticsEnabled
              )}
            </View>
            {renderSaveButton('Save Privacy Settings', handleSavePrivacySettings)}
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
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
    width: 40,
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
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: SPACING.md,
  },
  settingText: {
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
  saveButton: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 50,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 