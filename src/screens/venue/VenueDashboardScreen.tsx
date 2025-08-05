import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';

export default function VenueDashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Venue Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back to your venue</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Active Events</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>1,234</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Saved Events</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={32} color={COLORS.secondary} />
              <Text style={styles.actionText}>Create Event</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="analytics" size={32} color={COLORS.secondary} />
              <Text style={styles.actionText}>View Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="settings" size={32} color={COLORS.secondary} />
              <Text style={styles.actionText}>Venue Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.activityText}>Event "Jazz Night" published</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Ionicons name="eye" size={20} color={COLORS.info} />
              <Text style={styles.activityText}>45 views on "Live Music"</Text>
              <Text style={styles.activityTime}>4 hours ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Ionicons name="heart" size={20} color={COLORS.error} />
              <Text style={styles.activityText}>12 saves on "Art Exhibition"</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
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
    textAlign: 'center',
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  activityList: {
    gap: SPACING.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
}); 