// Simple test script for search functionality
// Run this in the browser console on the discover page

console.log('🔍 Testing simple search functionality...');

// Test 1: Find the search input
const searchInput = document.querySelector('input[placeholder*="Search"]') || 
                   document.querySelector('[data-testid="search-input"]') ||
                   document.querySelector('input[type="text"]');

if (searchInput) {
  console.log('✅ Search input found');
  console.log('📝 Current value:', searchInput.value);
  console.log('📝 Input type:', searchInput.type);
  console.log('📝 Input placeholder:', searchInput.placeholder);
  
  // Test 2: Try typing "jazz"
  console.log('🔍 Testing typing "jazz"...');
  
  // Set the value
  searchInput.value = 'jazz';
  
  // Trigger the input event
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  
  console.log('🔍 Set search value to "jazz"');
  
  // Wait and check results
  setTimeout(() => {
    console.log('🔍 Checking search results...');
    const eventCards = document.querySelectorAll('[data-testid="event-card"]');
    console.log('📊 Event cards found:', eventCards.length);
    
    if (eventCards.length > 0) {
      console.log('✅ Search is working! Found event cards');
      eventCards.forEach((card, index) => {
        console.log(`📋 Event ${index + 1}:`, card.textContent?.substring(0, 50));
      });
    } else {
      console.log('❌ No event cards found');
    }
  }, 1000);
  
} else {
  console.log('❌ Search input not found');
}

// Test 3: Find the manual test button
console.log('🔍 Looking for manual test button...');

// Look for any element with a bug icon
const allElements = document.querySelectorAll('*');
let testButton = null;

allElements.forEach((element, index) => {
  const elementText = element.textContent || element.innerHTML;
  if (elementText.includes('🐛') || elementText.includes('bug')) {
    testButton = element;
    console.log(`✅ Manual test button found at index ${index}`);
    console.log('🔍 Element:', element.tagName, element.className);
  }
});

if (testButton) {
  console.log('🔍 Clicking manual test button...');
  testButton.click();
  
  setTimeout(() => {
    console.log('🔍 After clicking manual test button:');
    const eventCards = document.querySelectorAll('[data-testid="event-card"]');
    console.log('📊 Event cards found after manual test:', eventCards.length);
    
    if (eventCards.length > 0) {
      console.log('✅ Manual test worked! Found event cards');
    } else {
      console.log('❌ Manual test did not work');
    }
  }, 500);
} else {
  console.log('❌ Manual test button not found');
  
  // List all elements with icons
  const iconElements = document.querySelectorAll('[class*="icon"], [class*="Ionicons"]');
  console.log('🔍 Icon elements found:', iconElements.length);
  iconElements.slice(0, 10).forEach((element, index) => {
    console.log(`Icon element ${index}:`, element.tagName, element.className);
  });
}

console.log('✅ Simple search test completed'); 