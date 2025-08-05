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

export default function VenueEventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Events</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>Jazz Night</Text>
            <View style={styles.eventStatus}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
          <Text style={styles.eventDate}>Tonight at 8:00 PM</Text>
          <Text style={styles.eventDescription}>Live jazz music with local artists</Text>
          <View style={styles.eventStats}>
            <View style={styles.stat}>
              <Ionicons name="eye" size={16} color={COLORS.info} />
              <Text style={styles.statText}>45 views</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="heart" size={16} color={COLORS.error} />
              <Text style={styles.statText}>12 saves</Text>
            </View>
          </View>
        </View>

        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>Art Exhibition</Text>
            <View style={styles.eventStatus}>
              <Ionicons name="time" size={16} color={COLORS.warning} />
              <Text style={styles.statusText}>Upcoming</Text>
            </View>
          </View>
          <Text style={styles.eventDate}>Tomorrow at 6:00 PM</Text>
          <Text style={styles.eventDescription}>Local artists showcase their work</Text>
          <View style={styles.eventStats}>
            <View style={styles.stat}>
              <Ionicons name="eye" size={16} color={COLORS.info} />
              <Text style={styles.statText}>23 views</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="heart" size={16} color={COLORS.error} />
              <Text style={styles.statText}>8 saves</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  eventStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  eventDate: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  eventStats: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
}); 