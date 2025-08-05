import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

export default function TermsOfServiceScreen({ onBack }: TermsOfServiceScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Terms of Service</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Last Updated */}
          <View style={styles.section}>
            <Text style={styles.lastUpdated}>Last Updated: December 2024</Text>
          </View>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to Around Me Now. These Terms of Service ("Terms") govern your use of our mobile application and services. By using our app, you agree to these terms and our Privacy Policy.
            </Text>
          </View>

          {/* Acceptance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By downloading, installing, or using the Around Me Now app, you accept and agree to be bound by these Terms. If you do not agree to these Terms, do not use our app.
            </Text>
          </View>

          {/* User Accounts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.paragraph}>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </Text>
          </View>

          {/* Acceptable Use */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
            <Text style={styles.paragraph}>
              You agree to use our app only for lawful purposes and in accordance with these Terms. You may not use our app to:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>
              <Text style={styles.bulletPoint}>• Infringe on the rights of others</Text>
              <Text style={styles.bulletPoint}>• Transmit harmful or malicious content</Text>
              <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
            </View>
          </View>

          {/* Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Privacy</Text>
            <Text style={styles.paragraph}>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our app and explains how we collect, use, and share your information.
            </Text>
          </View>

          {/* Intellectual Property */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
            <Text style={styles.paragraph}>
              The Around Me Now app and its content are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our content without permission.
            </Text>
          </View>

          {/* Limitation of Liability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              To the maximum extent permitted by law, Around Me Now shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our app.
            </Text>
          </View>

          {/* Termination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Termination</Text>
            <Text style={styles.paragraph}>
              We may terminate or suspend your account and access to our app at any time, with or without cause, with or without notice. You may also terminate your account at any time.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
            <Text style={styles.paragraph}>
              We may update these Terms from time to time. We will notify you of any changes by posting the new Terms in the app. Your continued use of the app after such changes constitutes acceptance of the new Terms.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Contact Information</Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms, please contact us at:
            </Text>
            <Text style={styles.contactInfo}>support@aroundmenow.com</Text>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Terms of Service</Text>
            <Text style={styles.infoText}>
              These terms govern your use of the Around Me Now app. Please read them carefully and contact us if you have any questions.
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
  lastUpdated: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  paragraph: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: SPACING.md,
  },
  bulletList: {
    marginLeft: SPACING.md,
  },
  bulletPoint: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: SPACING.xs,
  },
  contactInfo: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.sm,
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