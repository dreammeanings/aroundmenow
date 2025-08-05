import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { calendarService } from '../services/calendarService';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants';

export default function CalendarTest() {
  const [testResult, setTestResult] = useState<string>('');

  const runCalendarTest = async () => {
    try {
      console.log('🧪 CalendarTest: Starting calendar test...');
      
      // Test 1: Quick permission test
      const permissionTest = await calendarService.quickPermissionTest();
      console.log('🧪 CalendarTest: Permission test result:', permissionTest);
      
      let result = `Calendar Test Results:\n\n`;
      result += `✅ Permission Test:\n`;
      result += `• Has Permission: ${permissionTest.hasPermission}\n`;
      result += `• Has Calendar: ${permissionTest.hasCalendar}\n`;
      if (permissionTest.error) {
        result += `• Error: ${permissionTest.error}\n`;
      }
      
      // Test 2: Full service test
      const serviceTest = await calendarService.testCalendarService();
      result += `\n✅ Service Test:\n`;
      result += `• Service Working: ${serviceTest}\n`;
      
      // Test 3: Try to create a test event
      if (permissionTest.hasPermission && permissionTest.hasCalendar) {
        const testEvent = {
          id: 'test-event',
          title: 'Test Event',
          description: 'This is a test event',
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Tomorrow + 2 hours
          location: 'Test Location',
          url: 'https://example.com'
        };
        
        const createResult = await calendarService.addEventToCalendar(testEvent);
        result += `\n✅ Event Creation Test:\n`;
        result += `• Event Created: ${createResult}\n`;
      }
      
      setTestResult(result);
      Alert.alert('Calendar Test Complete', result);
      
    } catch (error) {
      console.error('❌ CalendarTest: Error during test:', error);
      const errorResult = `Calendar Test Failed:\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setTestResult(errorResult);
      Alert.alert('Calendar Test Failed', errorResult);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.testButton} onPress={runCalendarTest}>
        <Text style={styles.testButtonText}>🧪 Test Calendar</Text>
      </TouchableOpacity>
      
      {testResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Test Results:</Text>
          <Text style={styles.resultText}>{testResult}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  testButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  resultText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
}); 