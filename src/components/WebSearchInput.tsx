import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

interface WebSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function WebSearchInput({ 
  value, 
  onChangeText, 
  placeholder = "Search events...",
  testID = "search-input",
  onFocus,
  onBlur
}: WebSearchInputProps) {
  const inputRef = useRef<TextInput>(null);

  const handleInputChange = (text: string) => {
    console.log('🔍 WebSearchInput: Typing:', text, 'Length:', text.length);
    onChangeText(text);
  };

  const clearInput = () => {
    console.log('🔍 WebSearchInput: Clearing input');
    onChangeText('');
    if (inputRef.current) {
      inputRef.current.clear();
    }
  };

  const handleFocus = () => {
    console.log('🔍 WebSearchInput: Focused');
    onFocus?.();
  };

  const handleBlur = () => {
    console.log('🔍 WebSearchInput: Blurred');
    onBlur?.();
  };

  const handleKeyPress = (e: any) => {
    console.log('🔍 WebSearchInput: Key pressed:', e.nativeEvent.key);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.textSecondary} />
      <TextInput
        ref={inputRef}
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        testID={testID}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        enablesReturnKeyAutomatically={true}
        multiline={false}
        maxLength={1000}
        editable={true}
        selectTextOnFocus={false}
        {...(Platform.OS === 'web' && {
          accessibilityLabel: "Search events"
        })}
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearInput}
          testID="clear-search-button"
        >
          <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  textInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: 'transparent',
    padding: 0,
    minHeight: 20,
    textAlignVertical: 'center',
    ...(Platform.OS === 'web' && {
      outline: 'none',
      border: 'none',
      minWidth: 100,
    }),
  },
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
}); 