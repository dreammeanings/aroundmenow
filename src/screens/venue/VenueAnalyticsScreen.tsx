import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';

export default function VenueAnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Track your venue performance</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Ionicons name="trending-up" size={24} color={COLORS.success} />
            <Text style={styles.metricNumber}>1,234</Text>
            <Text style={styles.metricLabel}>Total Views</Text>
            <Text style={styles.metricChange}>+12% this week</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Ionicons name="heart" size={24} color={COLORS.error} />
            <Text style={styles.metricNumber}>89</Text>
            <Text style={styles.metricLabel}>Event Saves</Text>
            <Text style={styles.metricChange}>+5% this week</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Events</Text>
          <View style={styles.eventList}>
            <View style={styles.eventItem}>
              <Text style={styles.eventRank}>1</Text>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>Jazz Night</Text>
                <Text style={styles.eventViews}>234 views</Text>
              </View>
              <Ionicons name="trending-up" size={16} color={COLORS.success} />
            </View>
            
            <View style={styles.eventItem}>
              <Text style={styles.eventRank}>2</Text>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>Art Exhibition</Text>
                <Text style={styles.eventViews}>156 views</Text>
              </View>
              <Ionicons name="trending-up" size={16} color={COLORS.success} />
            </View>
            
            <View style={styles.eventItem}>
              <Text style={styles.eventRank}>3</Text>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>Live Music</Text>
                <Text style={styles.eventViews}>98 views</Text>
              </View>
              <Ionicons name="trending-down" size={16} color={COLORS.error} />
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
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  metricChange: {
    fontSize: 12,
    color: COLORS.success,
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
  eventList: {
    gap: SPACING.md,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  eventRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    width: 30,
  },
  eventInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  eventViews: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
}); 