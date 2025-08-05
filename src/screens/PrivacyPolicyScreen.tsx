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

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export default function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
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
          <Text style={styles.title}>Privacy Policy</Text>
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
              At Around Me Now, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
            </Text>
          </View>

          {/* Information We Collect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.paragraph}>
              We collect information you provide directly to us, such as when you create an account, update your profile, or contact us. This may include:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletPoint}>• Name, email address, and phone number</Text>
              <Text style={styles.bulletPoint}>• Profile information and preferences</Text>
              <Text style={styles.bulletPoint}>• Location data (with your permission)</Text>
              <Text style={styles.bulletPoint}>• Event preferences and history</Text>
            </View>
          </View>

          {/* How We Use Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the information we collect to:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletPoint}>• Provide and improve our services</Text>
              <Text style={styles.bulletPoint}>• Personalize your experience</Text>
              <Text style={styles.bulletPoint}>• Send you notifications about events</Text>
              <Text style={styles.bulletPoint}>• Communicate with you about our services</Text>
            </View>
          </View>

          {/* Information Sharing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Information Sharing</Text>
            <Text style={styles.paragraph}>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletPoint}>• Service providers who assist in our operations</Text>
              <Text style={styles.bulletPoint}>• Law enforcement when required by law</Text>
              <Text style={styles.bulletPoint}>• Other users (with your consent)</Text>
            </View>
          </View>

          {/* Data Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Security</Text>
            <Text style={styles.paragraph}>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </Text>
          </View>

          {/* Location Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Location Services</Text>
            <Text style={styles.paragraph}>
              Our app may request access to your location to provide nearby event recommendations. You can control location permissions through your device settings. We only collect location data when you grant permission.
            </Text>
          </View>

          {/* Cookies and Tracking */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Cookies and Tracking</Text>
            <Text style={styles.paragraph}>
              We may use cookies and similar technologies to enhance your experience, analyze app usage, and provide personalized content. You can control these settings through your device preferences.
            </Text>
          </View>

          {/* Your Rights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletPoint}>• Access your personal information</Text>
              <Text style={styles.bulletPoint}>• Update or correct your information</Text>
              <Text style={styles.bulletPoint}>• Delete your account</Text>
              <Text style={styles.bulletPoint}>• Opt out of certain communications</Text>
            </View>
          </View>

          {/* Children's Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
            <Text style={styles.paragraph}>
              Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us.
            </Text>
          </View>

          {/* Changes to Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app. Your continued use of the app after such changes constitutes acceptance of the new policy.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us at:
            </Text>
            <Text style={styles.contactInfo}>support@aroundmenow.com</Text>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Privacy Policy</Text>
            <Text style={styles.infoText}>
              We are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we handle your data.
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