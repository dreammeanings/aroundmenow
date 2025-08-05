import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import { analyticsService } from '../services/analyticsService';
import VenueScreen from './VenueScreen';
import EditProfileScreen from './EditProfileScreen';
import NotificationSettingsScreen from './NotificationSettingsScreen';
import SettingsScreen from './SettingsScreen';
import LocationSettingsScreen from './LocationSettingsScreen';
import PrivacySecurityScreen from './PrivacySecurityScreen';
import HelpCenterScreen from './HelpCenterScreen';
import ContactSupportScreen from './ContactSupportScreen';
import TermsOfServiceScreen from './TermsOfServiceScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [showVenueDashboard, setShowVenueDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'venue' | 'edit' | 'notifications' | 'settings' | 'location' | 'privacy' | 'help' | 'contact' | 'terms' | 'privacy-policy'>('profile');

  const handleVenueAccess = () => {
    setActiveTab('venue');
    analyticsService.track({
      type: 'venue_dashboard_access',
      userId: user?.id || 'unknown',
      properties: { source: 'profile_screen' },
    });
  };

  const handleEditProfile = () => {
    setActiveTab('edit');
  };

  const handleNotificationSettings = () => {
    setActiveTab('notifications');
  };

  const handleSettings = () => {
    setActiveTab('settings');
  };

  const handleLocationSettings = () => {
    setActiveTab('location');
  };

  const handlePrivacySecurity = () => {
    setActiveTab('privacy');
  };

  const handleHelpCenter = () => {
    setActiveTab('help');
  };

  const handleContactSupport = () => {
    setActiveTab('contact');
  };

  const handleTermsOfService = () => {
    setActiveTab('terms');
  };

  const handlePrivacyPolicy = () => {
    setActiveTab('privacy-policy');
  };

  const handleBackToProfile = () => {
    setActiveTab('profile');
  };

  // Calculate real user stats (placeholder for now, should come from API)
  const getUserStats = () => {
    // In a real app, these would come from the API
    return {
      eventsAttended: user?.preferences?.eventTypes?.length || 0,
      savedEvents: user?.preferences?.radius ? Math.floor(user.preferences.radius / 10) : 0,
      sharedEvents: user?.preferences?.vibe?.length || 0,
    };
  };

  const stats = getUserStats();

  const renderProfile = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={32} color={COLORS.white} />
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} data-testid="user-name">{user?.name || 'User'}</Text>
            <Text style={styles.userEmail} data-testid="user-email">{user?.email || 'user@example.com'}</Text>
            {user?.phone && (
              <Text style={styles.userPhone} data-testid="user-phone">{user.phone}</Text>
            )}
            {user?.bio && (
              <Text style={styles.userBio} data-testid="user-bio">{user.bio}</Text>
            )}
            <Text style={styles.memberSince} data-testid="member-since">
              Member since {user?.memberSince ? new Date(user.memberSince).toLocaleDateString() : 'Recently'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="calendar" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.eventsAttended}</Text>
          <Text style={styles.statLabel}>Events Attended</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.savedEvents}</Text>
          <Text style={styles.statLabel}>Saved Events</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="share" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.sharedEvents}</Text>
          <Text style={styles.statLabel}>Shared Events</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile} activeOpacity={0.8} data-testid="edit-profile-button">
          <Ionicons name="person" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleNotificationSettings} activeOpacity={0.8} data-testid="notification-settings-button">
          <Ionicons name="notifications" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLocationSettings} activeOpacity={0.8} data-testid="location-settings-button">
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Location Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePrivacySecurity} activeOpacity={0.8} data-testid="privacy-security-button">
          <Ionicons name="shield" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Venue Owner Section */}
      {user?.userType === 'venue' && (
        <View style={styles.venueSection}>
          <Text style={styles.sectionTitle}>Venue Management</Text>
          <TouchableOpacity style={styles.venueButton} onPress={handleVenueAccess} activeOpacity={0.8}>
            <Ionicons name="business" size={24} color={COLORS.white} />
            <Text style={styles.venueButtonText}>Access Venue Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.venueDescription}>
            Manage your venue, create events, and track performance
          </Text>
        </View>
      )}

      {/* Support Section */}
      <View style={styles.supportSection}>
        <Text style={styles.sectionTitle}>Support & Help</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleHelpCenter} activeOpacity={0.8} data-testid="help-center-button">
          <Ionicons name="help-circle" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport} activeOpacity={0.8} data-testid="contact-support-button">
          <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Contact Support</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleTermsOfService} activeOpacity={0.8} data-testid="terms-of-service-button">
          <Ionicons name="document-text" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handlePrivacyPolicy} activeOpacity={0.8} data-testid="privacy-policy-button">
          <Ionicons name="lock-closed" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={() => {
          console.log('🔘 Main logout button pressed');
          logout();
        }} 
        activeOpacity={0.8}
        accessible={true}
        accessibilityLabel="Sign out button"
        accessibilityHint="Double tap to sign out of the app"
        data-testid="logout-button"
      >
        <Ionicons name="log-out" size={20} color={COLORS.white} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  if (activeTab === 'venue') {
    return <VenueScreen />;
  }

  if (activeTab === 'edit') {
    return <EditProfileScreen onBack={handleBackToProfile} />;
  }

  if (activeTab === 'notifications') {
    return <NotificationSettingsScreen onBack={handleBackToProfile} />;
  }

  if (activeTab === 'settings') {
    return (
      <SettingsScreen 
        onBack={handleBackToProfile}
        onNavigateToLocationSettings={handleLocationSettings}
        onNavigateToPrivacySettings={handlePrivacySecurity}
      />
    );
  }

  if (activeTab === 'location') {
    return <LocationSettingsScreen onBack={handleBackToProfile} />;
  }

  if (activeTab === 'privacy') {
    return <PrivacySecurityScreen onBack={handleBackToProfile} />;
  }

  if (activeTab === 'help') {
    return <HelpCenterScreen onBack={handleBackToProfile} />;
  }

  if (activeTab === 'contact') {
    return <ContactSupportScreen onBack={handleBackToProfile} />;
  }

  if (activeTab === 'terms') {
    return <TermsOfServiceScreen onBack={handleBackToProfile} />;
  }

  if (activeTab === 'privacy-policy') {
    return <PrivacyPolicyScreen onBack={handleBackToProfile} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Ionicons name="settings" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {renderProfile()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  settingsButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionsContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  venueSection: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  venueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  venueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  venueDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  supportSection: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.error,
    shadowColor: COLORS.error,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
}); 