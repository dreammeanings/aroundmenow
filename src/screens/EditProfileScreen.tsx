import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';
import { User } from '../types';

interface EditProfileScreenProps {
  onBack: () => void;
}

export default function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { user, updateUser, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [phonePrivacy, setPhonePrivacy] = useState(user?.phonePrivacy || false);
  const [bio, setBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaved, setIsSaved] = useState(true); // Track if settings are saved

  // Sync local state with user data when it changes
  useEffect(() => {
    if (user) {
      console.log('🔄 Syncing local state with user data:', user);
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPhonePrivacy(user.phonePrivacy || false);
      setBio(user.bio || '');
      console.log('✅ Sync completed for EditProfileScreen');
    } else {
      console.log('⚠️ No user data found');
    }
  }, [user]);

  // Refs for text inputs
  const emailInput = useRef<TextInput>(null);
  const phoneInput = useRef<TextInput>(null);
  const bioInput = useRef<TextInput>(null);

  // Track changes
  useEffect(() => {
    const originalData = {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      phonePrivacy: user?.phonePrivacy || false,
      bio: user?.bio || '',
    };
    
    const currentData = { name, email, phone, phonePrivacy, bio };
    const changed = JSON.stringify(originalData) !== JSON.stringify(currentData);
    setHasChanges(changed);
    
    // Reset saved state when changes are detected, or set to true when no changes
    if (changed) {
      setIsSaved(false);
    } else {
      setIsSaved(true);
    }
  }, [name, email, phone, phonePrivacy, bio, user]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Phone number formatting
  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  // Validation functions
  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) return true; // Allow empty phone numbers
    
    const cleaned = phone.replace(/\D/g, '');
    // Accept 10-digit US numbers or 11-digit numbers starting with 1
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
  };

  const getValidationStatus = () => {
    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const phoneValid = validatePhone(phone);
    
    return {
      nameValid,
      emailValid,
      phoneValid,
      allValid: nameValid && emailValid && phoneValid,
    };
  };

  const handleSave = async () => {
    const validation = getValidationStatus();
    
    if (!validation.nameValid) {
      Alert.alert('Error', 'Please enter a valid name (minimum 2 characters)');
      return;
    }

    if (!validation.emailValid) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validation.phoneValid && phone.trim() !== '') {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Saving profile data:', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      });
      
      // Format phone number for backend
      let formattedPhone = phone.trim();
      if (formattedPhone) {
        // Clean the phone number and add +1 for US numbers if needed
        const cleaned = formattedPhone.replace(/\D/g, '');
        if (cleaned.length === 10) {
          formattedPhone = '+1' + cleaned;
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
          formattedPhone = '+' + cleaned;
        } else {
          formattedPhone = cleaned; // Keep as is for other formats
        }
      }
      
      // Send only the fields that the backend accepts
      const updateData: Partial<User> = {};
      
      // Only add name if it's not empty and has minimum length
      if (name.trim().length >= 2) {
        updateData.name = name.trim();
      }
      
      // Only add phone if it's not empty and properly formatted
      if (formattedPhone && formattedPhone.length >= 10) {
        updateData.phone = formattedPhone;
      }
      
      // Add bio field (can be empty string)
      updateData.bio = bio.trim();
      
      // Add phone privacy setting
      updateData.phonePrivacy = phonePrivacy;
      
      // If no valid data to send, show error
      if (Object.keys(updateData).length === 0) {
        Alert.alert('Error', 'Please enter at least your name (minimum 2 characters)');
        setIsLoading(false);
        return;
      }
      
      console.log('📤 Sending profile update data:', updateData);
      console.log('📤 Data being sent to backend:', JSON.stringify(updateData, null, 2));
      
      // Add a small delay to make the save feel more responsive
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await updateUser(updateData);
      
      // Refresh user data to reflect the saved changes
      await refreshUser();
      
      // Set saved state to true after successful save
      setIsSaved(true);
      
      // Enhanced success feedback with more prominent confirmation
      Alert.alert(
        '✅ Profile Saved Successfully!',
        'Your profile information has been updated and saved. You can now return to your profile page.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Add a small delay before going back to make the success message more noticeable
              setTimeout(() => {
                onBack();
              }, 500);
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error saving profile data:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
      Alert.alert(
        '❌ Save Failed',
        error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        [{ text: 'Try Again' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validation = getValidationStatus();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.title}>Edit Profile</Text>
              <TouchableOpacity 
                style={[
                  styles.saveButton, 
                  (!hasChanges || isLoading || !validation.allValid) && styles.saveButtonDisabled,
                  { transform: [{ scale: isLoading ? 0.95 : 1 }] }
                ]}
                onPress={handleSave}
                disabled={!hasChanges || isLoading || !validation.allValid}
                activeOpacity={0.7}
                data-testid="save-button"
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? '💾 Saving...' : isSaved && !hasChanges ? '✅ Saved' : '💾 Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={[
                styles.inputContainer,
                !validation.nameValid && name.trim() !== '' && styles.inputError
              ]}>
                <Ionicons 
                  name="person" 
                  size={20} 
                  color={!validation.nameValid && name.trim() !== '' ? COLORS.error : COLORS.textSecondary} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => emailInput.current?.focus()}
                  data-testid="name-input"
                />
                {!validation.nameValid && name.trim() !== '' && (
                  <Ionicons name="alert-circle" size={16} color={COLORS.error} style={styles.errorIcon} />
                )}
              </View>

              <View style={[
                styles.inputContainer,
                !validation.emailValid && email.trim() !== '' && styles.inputError
              ]}>
                <Ionicons 
                  name="mail" 
                  size={20} 
                  color={!validation.emailValid && email.trim() !== '' ? COLORS.error : COLORS.textSecondary} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  ref={emailInput}
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => phoneInput.current?.focus()}
                  data-testid="email-input"
                />
                {!validation.emailValid && email.trim() !== '' && (
                  <Ionicons name="alert-circle" size={16} color={COLORS.error} style={styles.errorIcon} />
                )}
              </View>

              <View style={[
                styles.inputContainer,
                !validation.phoneValid && phone.trim() !== '' && styles.inputError
              ]}>
                <Ionicons 
                  name="call" 
                  size={20} 
                  color={!validation.phoneValid && phone.trim() !== '' ? COLORS.error : COLORS.textSecondary} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  ref={phoneInput}
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={COLORS.textSecondary}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => bioInput.current?.focus()}
                  data-testid="phone-input"
                />
                {!validation.phoneValid && phone.trim() !== '' && (
                  <Ionicons name="alert-circle" size={16} color={COLORS.error} style={styles.errorIcon} />
                )}
              </View>

              {/* Phone Privacy Toggle */}
              <View style={styles.privacyContainer}>
                <View style={styles.privacyContent}>
                  <Ionicons name="shield-checkmark" size={20} color={COLORS.textSecondary} style={styles.privacyIcon} />
                  <View style={styles.privacyText}>
                    <Text style={styles.privacyTitle}>Keep Phone Number Private</Text>
                    <Text style={styles.privacyDescription}>
                      When enabled, your phone number will only be visible to you and won't be shared with other users
                    </Text>
                  </View>
                </View>
                <Switch
                  value={phonePrivacy}
                  onValueChange={setPhonePrivacy}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                  ios_backgroundColor={COLORS.border}
                  style={{ transform: [{ scale: 1.1 }] }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="chatbubble" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  ref={bioInput}
                  style={[styles.input, styles.bioInput]}
                  placeholder="Tell us about yourself (optional)"
                  placeholderTextColor={COLORS.textSecondary}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  returnKeyType="done"
                  maxLength={500}
                  data-testid="bio-input"
                />
                <Text style={styles.charCount}>{bio.length}/500</Text>
              </View>
            </View>

            {/* Validation Messages */}
            {(!validation.nameValid || !validation.emailValid || !validation.phoneValid) && (
              <View style={styles.validationContainer}>
                {!validation.nameValid && name.trim() !== '' && (
                  <Text style={styles.validationText}>• Name must be at least 2 characters</Text>
                )}
                {!validation.emailValid && email.trim() !== '' && (
                  <Text style={styles.validationText}>• Please enter a valid email address</Text>
                )}
                {!validation.phoneValid && phone.trim() !== '' && (
                  <Text style={styles.validationText}>• Please enter a valid phone number</Text>
                )}
              </View>
            )}

            {/* Info Section */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Profile Information</Text>
              <Text style={styles.infoText}>
                Update your personal information. Your email will be used for account notifications and password recovery.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
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
  form: {
    marginBottom: SPACING.xxl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    marginRight: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.md,
  },
  bioInput: {
    height: 100,
    paddingTop: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  errorIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
  },
  charCount: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.md,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  validationContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  validationText: {
    fontSize: 12,
    color: COLORS.error,
    marginBottom: SPACING.xs,
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
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
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  privacyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    marginRight: SPACING.sm,
  },
  privacyText: {
    marginLeft: SPACING.sm,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  privacyDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SPACING.xs,
  },
}); 