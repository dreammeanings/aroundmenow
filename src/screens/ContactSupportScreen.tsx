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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

interface ContactSupportScreenProps {
  onBack: () => void;
}

export default function ContactSupportScreen({ onBack }: ContactSupportScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@aroundmenow.com?subject=Support Request');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:1-800-AROUND-ME');
  };

  const handleLiveChat = () => {
    Alert.alert(
      'Live Chat',
      'Live chat will be available in the next update. For now, please use email or phone support.',
      [{ text: 'OK' }]
    );
  };

  const handleTicketSystem = () => {
    Alert.alert(
      'Support Ticket',
      'Support ticket system will be available in the next update. For now, please use email or phone support.',
      [{ text: 'OK' }]
    );
  };

  const renderContactItem = (icon: string, title: string, description: string, action: string, onPress: () => void) => (
    <TouchableOpacity style={styles.contactItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.contactIcon}>
        <Ionicons name={icon as any} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactDescription}>{description}</Text>
        <Text style={styles.contactAction}>{action}</Text>
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
          <Text style={styles.title}>Contact Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Contact Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Methods</Text>
            <View style={styles.contactContainer}>
              {renderContactItem(
                'mail',
                'Email Support',
                'Get help via email',
                'support@aroundmenow.com',
                handleEmailSupport
              )}
              {renderContactItem(
                'call',
                'Phone Support',
                'Call our support team',
                '1-800-AROUND-ME',
                handleCallSupport
              )}
              {renderContactItem(
                'chatbubble',
                'Live Chat',
                'Chat with support team',
                'Coming Soon',
                handleLiveChat
              )}
              {renderContactItem(
                'document-text',
                'Support Ticket',
                'Create a support ticket',
                'Coming Soon',
                handleTicketSystem
              )}
            </View>
          </View>

          {/* Support Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support Hours</Text>
            <View style={styles.hoursContainer}>
              <View style={styles.hourItem}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <Text style={styles.hourText}>24/7 Support Available</Text>
              </View>
              <View style={styles.hourItem}>
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
                <Text style={styles.hourText}>Every Day of the Year</Text>
              </View>
              <View style={styles.hourItem}>
                <Ionicons name="globe" size={20} color={COLORS.primary} />
                <Text style={styles.hourText}>Global Support Team</Text>
              </View>
            </View>
          </View>

          {/* Common Issues */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Issues</Text>
            <View style={styles.issuesContainer}>
              <View style={styles.issueItem}>
                <Ionicons name="help-circle" size={20} color={COLORS.primary} />
                <Text style={styles.issueText}>App not working properly</Text>
              </View>
              <View style={styles.issueItem}>
                <Ionicons name="help-circle" size={20} color={COLORS.primary} />
                <Text style={styles.issueText}>Can't find events</Text>
              </View>
              <View style={styles.issueItem}>
                <Ionicons name="help-circle" size={20} color={COLORS.primary} />
                <Text style={styles.issueText}>Payment issues</Text>
              </View>
              <View style={styles.issueItem}>
                <Ionicons name="help-circle" size={20} color={COLORS.primary} />
                <Text style={styles.issueText}>Account problems</Text>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Contact Support</Text>
            <Text style={styles.infoText}>
              Our support team is here to help you with any questions or issues you may have. We're available 24/7 to ensure you get the help you need when you need it.
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
  contactContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactIcon: {
    marginRight: SPACING.md,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  contactAction: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  hoursContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  hourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  hourText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  issuesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  issueText: {
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