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

interface LocationSettingsScreenProps {
  onBack: () => void;
}

export default function LocationSettingsScreen({ onBack }: LocationSettingsScreenProps) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaved, setIsSaved] = useState(true); // Track if settings are saved

  // Location settings state
  const [locationEnabled, setLocationEnabled] = useState(user?.preferences?.locationEnabled || false);
  const [locationPrecision, setLocationPrecision] = useState(user?.preferences?.locationPrecision || 'high');
  const [radius, setRadius] = useState(user?.preferences?.radius || 25);
  const [showPrecisionOptions, setShowPrecisionOptions] = useState(false);

  // Sync local state with user data when it changes
  useEffect(() => {
    if (user?.preferences) {
      console.log('🔄 Syncing local state with user data:', user.preferences);
      setLocationEnabled(user.preferences.locationEnabled || false);
      setLocationPrecision(user.preferences.locationPrecision || 'high');
      setRadius(user.preferences.radius || 25);
      console.log('✅ Sync completed for LocationSettingsScreen');
    } else {
      console.log('⚠️ No preferences found in user data');
    }
  }, [user?.preferences]);

  // Track changes - run after local state has been synced
  useEffect(() => {
    // Only run change detection if user data is available
    if (!user?.preferences) return;
    
    const originalSettings = {
      locationEnabled: user.preferences.locationEnabled || false,
      locationPrecision: user.preferences.locationPrecision || 'high',
      radius: user.preferences.radius || 25,
    };
    
    const currentSettings = { locationEnabled, locationPrecision, radius };
    const changed = JSON.stringify(originalSettings) !== JSON.stringify(currentSettings);
    
    console.log('🔍 Change Detection Debug for LocationSettingsScreen:');
    console.log('📊 Original settings:', originalSettings);
    console.log('📊 Current settings:', currentSettings);
    console.log('📊 Has changes:', changed);
    console.log('📊 Current isSaved:', isSaved);
    console.log('📊 User preferences:', user.preferences);
    
    setHasChanges(changed);
    
    // Reset saved state when changes are detected, or set to true when no changes
    if (changed) {
      console.log('🔄 Setting isSaved to false (changes detected)');
      setIsSaved(false);
    } else {
      console.log('✅ Setting isSaved to true (no changes)');
      setIsSaved(true);
    }
  }, [locationEnabled, locationPrecision, radius, user?.preferences]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRadiusChange = (newRadius: number) => {
    setRadius(Math.max(5, Math.min(100, newRadius)));
  };

  const handlePrecisionChange = (precision: string) => {
    setLocationPrecision(precision);
    setShowPrecisionOptions(false);
  };

  const getPrecisionDescription = (precision: string) => {
    switch (precision) {
      case 'high':
        return 'Most accurate location tracking';
      case 'medium':
        return 'Balanced accuracy and battery life';
      case 'low':
        return 'Battery efficient, approximate location';
      default:
        return 'Choose location precision level';
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const locationData = {
        preferences: {
          radius: radius, // Use current local state instead of user?.preferences?.radius
          defaultRadius: user?.preferences?.defaultRadius || 25,
          eventTypes: user?.preferences?.eventTypes || [],
          vibe: user?.preferences?.vibe || [],
          priceRange: user?.preferences?.priceRange || [],
          preferredVibe: user?.preferences?.preferredVibe || '',
          // Location Settings
          locationEnabled,
          locationPrecision,
          // Privacy Settings
          profileVisibility: user?.preferences?.profileVisibility || 'public',
          dataSharing: user?.preferences?.dataSharing || false,
          analyticsEnabled: user?.preferences?.analyticsEnabled || true,
          // Security Settings
          twoFactorAuth: user?.preferences?.twoFactorAuth || false,
          loginNotifications: user?.preferences?.loginNotifications || true,
        },
      };

      console.log('📤 Sending location settings:', locationData);

      // Add a small delay to make the save feel more responsive
      await new Promise(resolve => setTimeout(resolve, 100));

      await apiService.updatePreferences(locationData.preferences);

      console.log('✅ Location settings saved to backend');

      // Refresh user data to reflect the saved changes
      await refreshUser();

      console.log('✅ User data refreshed');

      // Set saved state to true after successful save
      setIsSaved(true);

      console.log('✅ Local state updated - isSaved set to true');

      Alert.alert(
        '✅ Location Settings Saved Successfully!',
        'Your location preferences have been updated and saved.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error saving location settings:', error);
      Alert.alert(
        'Error ❌',
        error instanceof Error ? error.message : 'Failed to update location settings. Please try again.'
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
          onPress={() => setShowPrecisionOptions(!showPrecisionOptions)}
          activeOpacity={0.7}
        >
          <Text style={styles.selectValue}>{value}</Text>
          <Ionicons 
            name={showPrecisionOptions ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={COLORS.textSecondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPrecisionOptions = () => {
    if (!showPrecisionOptions) return null;

    const options = ['high', 'medium', 'low'];
    
    return (
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionItem,
              locationPrecision === option && styles.optionItemSelected
            ]}
            onPress={() => handlePrecisionChange(option)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              locationPrecision === option && styles.optionTextSelected
            ]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
            {locationPrecision === option && (
              <Ionicons name="checkmark" size={16} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Location Settings</Text>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (!hasChanges || isLoading) && styles.saveButtonDisabled,
              { transform: [{ scale: isLoading ? 0.95 : 1 }] }
            ]}
            onPress={handleSaveSettings}
            disabled={!hasChanges || isLoading}
            activeOpacity={0.7}
            data-testid="save-location-settings-button"
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? '💾 Saving...' : isSaved && !hasChanges ? '✅ Saved' : '💾 Save Settings'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Location Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Services</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'location',
                'Enable Location Services',
                'Allow the app to access your location for nearby events',
                locationEnabled,
                setLocationEnabled,
                'switch'
              )}
            </View>
          </View>

          {/* Location Precision */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Precision</Text>
            <View style={styles.settingsContainer}>
              {renderSettingItem(
                'navigate',
                'Location Precision',
                getPrecisionDescription(locationPrecision),
                locationPrecision,
                setLocationPrecision,
                'select',
                ['high', 'medium', 'low']
              )}
              {renderPrecisionOptions()}
            </View>
          </View>

          {/* Search Radius */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Radius</Text>
            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Ionicons name="radio" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Event Search Radius</Text>
                  <Text style={styles.settingDescription}>
                    Search for events within {radius} miles of your location
                  </Text>
                </View>
                <View style={styles.radiusContainer}>
                  <TouchableOpacity
                    style={styles.radiusButton}
                    onPress={() => handleRadiusChange(radius - 5)}
                    disabled={radius <= 5}
                  >
                    <Ionicons name="remove" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.radiusValue}>{radius} mi</Text>
                  <TouchableOpacity
                    style={styles.radiusButton}
                    onPress={() => handleRadiusChange(radius + 5)}
                    disabled={radius >= 100}
                  >
                    <Ionicons name="add" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Location Permissions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Permissions</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  Location data is used to find events near you and improve your experience.
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  Your location is never shared with other users without your permission.
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
  radiusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radiusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  radiusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    minWidth: 40,
    textAlign: 'center',
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
  optionsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  optionItemSelected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
}); 