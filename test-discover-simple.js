const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing Discover page issues...');

// Check for common issues in the DiscoverScreen
const discoverScreenPath = path.join(__dirname, 'src/screens/DiscoverScreen.tsx');

if (fs.existsSync(discoverScreenPath)) {
  const content = fs.readFileSync(discoverScreenPath, 'utf8');
  
  console.log('\n📋 DiscoverScreen Analysis:');
  
  // Check for commented out code
  const commentedCode = content.match(/\/\/.*$/gm);
  if (commentedCode) {
    console.log('⚠️  Found commented code:', commentedCode.length, 'lines');
  }
  
  // Check for console.log statements
  const consoleLogs = content.match(/console\.log\(/g);
  if (consoleLogs) {
    console.log('📝 Found console.log statements:', consoleLogs.length);
  }
  
  // Check for error handling
  const tryCatchBlocks = content.match(/try\s*\{/g);
  if (tryCatchBlocks) {
    console.log('✅ Found try-catch blocks:', tryCatchBlocks.length);
  }
  
  // Check for state updates
  const setStateCalls = content.match(/set[A-Z][a-zA-Z]*\(/g);
  if (setStateCalls) {
    console.log('🔄 Found state updates:', setStateCalls.length);
  }
  
  // Check for useEffect hooks
  const useEffectHooks = content.match(/useEffect\(/g);
  if (useEffectHooks) {
    console.log('⚡ Found useEffect hooks:', useEffectHooks.length);
  }
  
  // Check for potential memory leaks
  const intervalTimeouts = content.match(/setInterval|setTimeout/g);
  if (intervalTimeouts) {
    console.log('⏰ Found timers:', intervalTimeouts.length);
  }
  
  // Check for API calls
  const apiCalls = content.match(/eventService\.|apiService\./g);
  if (apiCalls) {
    console.log('🌐 Found API calls:', apiCalls.length);
  }
  
  // Check for navigation
  const navigationCalls = content.match(/navigation\./g);
  if (navigationCalls) {
    console.log('🧭 Found navigation calls:', navigationCalls.length);
  }
  
  // Check for potential issues
  console.log('\n🔍 Potential Issues Found:');
  
  // Check for unused variables
  const unusedVars = content.match(/const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*useState\([^)]*\)/g);
  if (unusedVars) {
    console.log('⚠️  Potential unused state variables:', unusedVars.length);
  }
  
  // Check for missing error boundaries
  if (!content.includes('ErrorBoundary')) {
    console.log('⚠️  No ErrorBoundary found');
  }
  
  // Check for loading states
  if (content.includes('isLoading')) {
    console.log('✅ Loading state implemented');
  } else {
    console.log('⚠️  No loading state found');
  }
  
  // Check for error states
  if (content.includes('error') || content.includes('Error')) {
    console.log('✅ Error handling found');
  } else {
    console.log('⚠️  No error handling found');
  }
  
  // Check for accessibility
  if (content.includes('accessibilityLabel') || content.includes('accessibilityHint')) {
    console.log('✅ Accessibility features found');
  } else {
    console.log('⚠️  No accessibility features found');
  }
  
  // Check for performance optimizations
  if (content.includes('useCallback') || content.includes('useMemo')) {
    console.log('✅ Performance optimizations found');
  } else {
    console.log('⚠️  No performance optimizations found');
  }
  
  // Check for proper cleanup
  if (content.includes('cleanup') || content.includes('return () =>')) {
    console.log('✅ Cleanup functions found');
  } else {
    console.log('⚠️  No cleanup functions found');
  }
  
} else {
  console.log('❌ DiscoverScreen.tsx not found');
}

// Check EventCard component
const eventCardPath = path.join(__dirname, 'src/components/EventCard.tsx');
if (fs.existsSync(eventCardPath)) {
  const eventCardContent = fs.readFileSync(eventCardPath, 'utf8');
  
  console.log('\n📋 EventCard Analysis:');
  
  // Check for image handling
  if (eventCardContent.includes('onError')) {
    console.log('✅ Image error handling found');
  } else {
    console.log('⚠️  No image error handling found');
  }
  
  // Check for proper date formatting
  if (eventCardContent.includes('formatDate')) {
    console.log('✅ Date formatting found');
  } else {
    console.log('⚠️  No date formatting found');
  }
  
  // Check for price formatting
  if (eventCardContent.includes('formatPrice')) {
    console.log('✅ Price formatting found');
  } else {
    console.log('⚠️  No price formatting found');
  }
  
} else {
  console.log('❌ EventCard.tsx not found');
}

// Check FilterModal component
const filterModalPath = path.join(__dirname, 'src/components/FilterModal.tsx');
if (fs.existsSync(filterModalPath)) {
  const filterModalContent = fs.readFileSync(filterModalPath, 'utf8');
  
  console.log('\n📋 FilterModal Analysis:');
  
  // Check for filter validation
  if (filterModalContent.includes('validation') || filterModalContent.includes('validate')) {
    console.log('✅ Filter validation found');
  } else {
    console.log('⚠️  No filter validation found');
  }
  
  // Check for filter reset functionality
  if (filterModalContent.includes('reset') || filterModalContent.includes('clear')) {
    console.log('✅ Filter reset functionality found');
  } else {
    console.log('⚠️  No filter reset functionality found');
  }
  
} else {
  console.log('❌ FilterModal.tsx not found');
}

// Check Calendar component
const calendarPath = path.join(__dirname, 'src/components/Calendar.tsx');
if (fs.existsSync(calendarPath)) {
  const calendarContent = fs.readFileSync(calendarPath, 'utf8');
  
  console.log('\n📋 Calendar Analysis:');
  
  // Check for date validation
  if (calendarContent.includes('validation') || calendarContent.includes('validate')) {
    console.log('✅ Date validation found');
  } else {
    console.log('⚠️  No date validation found');
  }
  
  // Check for multi-date selection
  if (calendarContent.includes('multi') || calendarContent.includes('multiple')) {
    console.log('✅ Multi-date selection found');
  } else {
    console.log('⚠️  No multi-date selection found');
  }
  
  // Check for range selection
  if (calendarContent.includes('range')) {
    console.log('✅ Range selection found');
  } else {
    console.log('⚠️  No range selection found');
  }
  
} else {
  console.log('❌ Calendar.tsx not found');
}

console.log('\n✅ Analysis complete!');
console.log('\n📝 Recommendations:');
console.log('1. Ensure all API calls have proper error handling');
console.log('2. Add loading states for better UX');
console.log('3. Implement proper cleanup in useEffect hooks');
console.log('4. Add accessibility features for better usability');
console.log('5. Optimize performance with useCallback and useMemo');
console.log('6. Add proper validation for user inputs');
console.log('7. Implement proper error boundaries');
console.log('8. Add proper image error handling');
console.log('9. Ensure consistent date and price formatting');
console.log('10. Add proper filter reset functionality'); 