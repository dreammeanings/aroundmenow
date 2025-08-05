// Test to check available events data
// Run this in the browser console on the discover page

console.log('🔍 Checking available events data...');

// Test 1: Check if there are any event cards currently visible
const eventCards = document.querySelectorAll('[data-testid="event-card"]');
console.log('📊 Currently visible event cards:', eventCards.length);

if (eventCards.length > 0) {
  console.log('📋 Sample event titles:');
  eventCards.forEach((card, index) => {
    const title = card.textContent?.substring(0, 100);
    console.log(`Event ${index + 1}:`, title);
  });
}

// Test 2: Look for any elements containing "jazz"
console.log('🔍 Looking for elements containing "jazz"...');
const jazzElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && el.textContent.toLowerCase().includes('jazz')
);
console.log('🔍 Elements containing "jazz":', jazzElements.length);

jazzElements.forEach((el, index) => {
  console.log(`Jazz element ${index + 1}:`, el.textContent?.substring(0, 100));
});

// Test 3: Check for any search-related elements
console.log('🔍 Looking for search-related elements...');
const searchElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && el.textContent.toLowerCase().includes('found')
);
console.log('🔍 Search result elements:', searchElements.length);

searchElements.forEach((el, index) => {
  console.log(`Search element ${index + 1}:`, el.textContent?.substring(0, 100));
});

// Test 4: Check for any elements containing "Live Jazz"
console.log('🔍 Looking for "Live Jazz" specifically...');
const liveJazzElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && el.textContent.toLowerCase().includes('live jazz')
);
console.log('🔍 "Live Jazz" elements:', liveJazzElements.length);

liveJazzElements.forEach((el, index) => {
  console.log(`Live Jazz element ${index + 1}:`, el.textContent?.substring(0, 100));
});

console.log('✅ Events data test completed'); 