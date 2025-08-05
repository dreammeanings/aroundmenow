import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

export default function VenueProfileScreen() {
  const { user, logout } = useAuth();

  const handleEditVenueInfo = () => {
    Alert.alert(
      'Edit Venue Info',
      'Venue information editing will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleEventSettings = () => {
    Alert.alert(
      'Event Settings',
      'Event settings will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleAnalyticsSettings = () => {
    Alert.alert(
      'Analytics Settings',
      'Analytics settings will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleNotifications = () => {
    Alert.alert(
      'Notifications',
      'Notification settings will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacySettings = () => {
    Alert.alert(
      'Privacy Settings',
      'Privacy settings will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'For venue support, please email us at venues@aroundmenow.com or call us at 1-800-VENUE-SUPPORT',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Venue Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your venue settings</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.venueInfo}>
          <View style={styles.venueAvatar}>
            <Ionicons name="business" size={48} color={COLORS.secondary} />
          </View>
          <Text style={styles.venueName}>{user?.name || 'Jazz Club Downtown'}</Text>
          <Text style={styles.venueEmail}>{user?.email || 'venue@jazzclub.com'}</Text>
          <Text style={styles.venueType}>Venue Owner</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue Management</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditVenueInfo}>
              <Ionicons name="business-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.menuText}>Edit Venue Info</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleEventSettings}>
              <Ionicons name="calendar-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.menuText}>Event Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleAnalyticsSettings}>
              <Ionicons name="analytics-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.menuText}>Analytics Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem} onPress={handleNotifications}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.menuText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handlePrivacySettings}>
              <Ionicons name="lock-closed-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.menuText}>Privacy Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleHelpSupport}>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => {
            console.log('🔘 Venue main logout button pressed');
            logout();
          }}
          accessible={true}
          accessibilityLabel="Venue sign out button"
          accessibilityHint="Double tap to sign out of the venue app"
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  venueInfo: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  venueAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  venueEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  venueType: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  menuList: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.error,
    marginLeft: SPACING.sm,
    fontWeight: 'bold',
  },
}); 