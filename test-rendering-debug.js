// Debug rendering issue
// Run this in the browser console on the discover page

console.log('🔍 Debugging rendering issue...');

// Test 1: Check if there are any event cards
const eventCards = document.querySelectorAll('[data-testid="event-card"]');
console.log('📊 Event cards found:', eventCards.length);

// Test 2: Check if there are any elements with event-like content
const eventElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club') ||
    el.textContent.includes('$25')
  )
);
console.log('🔍 Event-like elements found:', eventElements.length);

eventElements.forEach((el, index) => {
  console.log(`Event-like element ${index + 1}:`, el.textContent?.substring(0, 100));
});

// Test 3: Check if there are any FlatList or list elements
const listElements = document.querySelectorAll('[data-testid*="list"], [class*="list"], [class*="flat"]');
console.log('📋 List elements found:', listElements.length);

listElements.forEach((el, index) => {
  console.log(`List element ${index + 1}:`, el.tagName, el.className);
});

// Test 4: Check for any React Native web specific elements
const rnElements = document.querySelectorAll('[data-testid], [class*="react-native"]');
console.log('📱 React Native elements found:', rnElements.length);

// Test 5: Look for the search results banner
const searchBanner = document.querySelector('div:contains("Found 1 event")');
console.log('🔍 Search banner found:', !!searchBanner);

if (searchBanner) {
  console.log('🔍 Search banner text:', searchBanner.textContent);
}

// Test 6: Check if there are any hidden elements
const hiddenElements = Array.from(document.querySelectorAll('*')).filter(el => {
  const style = window.getComputedStyle(el);
  return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
});

console.log('👻 Hidden elements found:', hiddenElements.length);

// Test 7: Look for any error messages
const errorElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Error') ||
    el.textContent.includes('Failed') ||
    el.textContent.includes('No events')
  )
);
console.log('❌ Error elements found:', errorElements.length);

errorElements.forEach((el, index) => {
  console.log(`Error element ${index + 1}:`, el.textContent?.substring(0, 100));
});

console.log('✅ Rendering debug test completed'); 