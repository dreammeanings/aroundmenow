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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

interface HelpCenterScreenProps {
  onBack: () => void;
}

export default function HelpCenterScreen({ onBack }: HelpCenterScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'For immediate support, please email us at support@aroundmenow.com or call us at 1-800-AROUND-ME',
      [{ text: 'OK' }]
    );
  };

  const handleFAQ = () => {
    Alert.alert(
      'Frequently Asked Questions',
      'FAQ section will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const handleTutorial = () => {
    Alert.alert(
      'App Tutorial',
      'Interactive tutorial will be available in the next update.',
      [{ text: 'OK' }]
    );
  };

  const renderHelpItem = (icon: string, title: string, description: string, onPress: () => void) => (
    <TouchableOpacity style={styles.helpItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.helpIcon}>
        <Ionicons name={icon as any} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>{title}</Text>
        <Text style={styles.helpDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
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
          <Text style={styles.title}>Help Center</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Quick Help */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Help</Text>
            <View style={styles.helpContainer}>
              {renderHelpItem(
                'help-circle',
                'Frequently Asked Questions',
                'Find answers to common questions',
                handleFAQ
              )}
              {renderHelpItem(
                'play-circle',
                'App Tutorial',
                'Learn how to use the app',
                handleTutorial
              )}
              {renderHelpItem(
                'chatbubble',
                'Contact Support',
                'Get help from our support team',
                handleContactSupport
              )}
            </View>
          </View>

          {/* Popular Topics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Topics</Text>
            <View style={styles.helpContainer}>
              {renderHelpItem(
                'calendar',
                'Event Management',
                'How to find and save events',
                () => Alert.alert('Event Management', 'Event management guide will be available soon.')
              )}
              {renderHelpItem(
                'location',
                'Location Services',
                'Using location features',
                () => Alert.alert('Location Services', 'Location services guide will be available soon.')
              )}
              {renderHelpItem(
                'notifications',
                'Notification Settings',
                'Managing your notifications',
                () => Alert.alert('Notification Settings', 'Notification settings guide will be available soon.')
              )}
              {renderHelpItem(
                'business',
                'Venue Management',
                'Managing your venue dashboard',
                () => Alert.alert('Venue Management', 'Venue management guide will be available soon.')
              )}
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>support@aroundmenow.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>1-800-AROUND-ME</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>24/7 Support Available</Text>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Help Center</Text>
            <Text style={styles.infoText}>
              Find answers to your questions and get support when you need it. Our help center is designed to make your experience as smooth as possible.
            </Text>
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
  helpContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  helpIcon: {
    marginRight: SPACING.md,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  helpDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  contactContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  contactText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
}); 