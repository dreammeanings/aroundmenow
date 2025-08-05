// Clean test script for search functionality
// Run this in the browser console on the discover page

console.log('🔍 Testing clean search functionality...');

// Test 1: Find the search input
const searchInput = document.querySelector('input[placeholder*="Search"]') || 
                   document.querySelector('[data-testid="search-input"]') ||
                   document.querySelector('input[type="text"]');

if (searchInput) {
  console.log('✅ Search input found');
  console.log('📝 Current value:', searchInput.value);
  
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
    } else {
      console.log('❌ No event cards found');
    }
  }, 1000);
  
} else {
  console.log('❌ Search input not found');
}

// Test 3: Find and click the manual test button
console.log('🔍 Looking for manual test button...');

// Look for the bug icon button
const buttons = document.querySelectorAll('button, [role="button"]');
let testButton = null;

buttons.forEach((button, index) => {
  const buttonText = button.textContent || button.innerHTML;
  if (buttonText.includes('🐛') || buttonText.includes('bug')) {
    testButton = button;
    console.log(`✅ Manual test button found at index ${index}`);
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
}

console.log('✅ Clean search test completed'); 