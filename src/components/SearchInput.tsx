import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
}

export default function SearchInput({ 
  value, 
  onChangeText, 
  placeholder = "Search events...",
  testID = "search-input"
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<TextInput>(null);

  // Sync with external value
  useEffect(() => {
    if (value !== inputValue) {
      console.log('🔍 SearchInput: Syncing external value:', value);
      setInputValue(value);
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    console.log('🔍 SearchInput handleChangeText called with:', text);
    console.log('🔍 Text length:', text.length);
    console.log('🔍 Previous inputValue:', inputValue);
    console.log('🔍 New text:', text);
    
    setInputValue(text);
    onChangeText(text);
  };

  const handleFocus = () => {
    console.log('🔍 SearchInput focused');
    console.log('🔍 Current inputValue:', inputValue);
    console.log('🔍 External value:', value);
  };

  const handleBlur = () => {
    console.log('🔍 SearchInput blurred');
    console.log('🔍 Final inputValue:', inputValue);
  };

  const handleKeyPress = (e: any) => {
    console.log('🔍 SearchInput key press:', e.nativeEvent?.key);
  };

  const clearInput = () => {
    console.log('🔍 Clearing search input');
    setInputValue('');
    onChangeText('');
  };

  // Force focus and select all text when component mounts
  useEffect(() => {
    if (inputRef.current) {
      console.log('🔍 SearchInput: Setting up input ref');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.textSecondary} />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={inputValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        blurOnSubmit={false}
        keyboardType="default"
        data-testid={testID}
        accessibilityLabel="Search events"
        accessibilityHint="Type to search for events by title, description, venue, or tags"
        // Web-specific props
        {...(Platform.OS === 'web' && {
          onInput: (e: any) => {
            const text = e.target?.value || '';
            console.log('🔍 SearchInput onInput event:', text);
            if (text !== inputValue) {
              console.log('🔍 onInput detected different text, updating');
              setInputValue(text);
              onChangeText(text);
            }
          },
          onChange: (e: any) => {
            const text = e.target?.value || '';
            console.log('🔍 SearchInput onChange event:', text);
            if (text !== inputValue) {
              console.log('🔍 onChange detected different text, updating');
              setInputValue(text);
              onChangeText(text);
            }
          },
        })}
      />
      {inputValue.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearInput}
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
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
  },
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
}); 