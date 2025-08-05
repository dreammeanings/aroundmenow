// Test script to debug search functionality
// Run this in the browser console on the discover page

console.log('🔍 Starting search functionality test...');

// Test 1: Check if search input exists
const searchInput = document.querySelector('input[placeholder*="Search"]');
if (searchInput) {
  console.log('✅ Search input found');
  console.log('📝 Current search value:', searchInput.value);
} else {
  console.log('❌ Search input not found');
}

// Test 2: Check if events are loaded
const eventCards = document.querySelectorAll('[data-testid="event-card"]');
console.log('📊 Found event cards:', eventCards.length);

// Test 3: Simulate typing in search
if (searchInput) {
  console.log('🔍 Testing search with "jazz"...');
  
  // Simulate typing
  searchInput.value = 'jazz';
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  
  // Wait a bit and check results
  setTimeout(() => {
    const updatedEventCards = document.querySelectorAll('[data-testid="event-card"]');
    console.log('🔍 After search, found event cards:', updatedEventCards.length);
    
    if (updatedEventCards.length > 0) {
      console.log('✅ Search is working - found results');
    } else {
      console.log('❌ Search returned no results');
    }
  }, 1000);
}

// Test 4: Check for any error messages
const errorMessages = document.querySelectorAll('text="Error", text="Failed", text="Unable"');
if (errorMessages.length > 0) {
  console.log('⚠️  Error messages found:', errorMessages.length);
  errorMessages.forEach((error, index) => {
    console.log(`❌ Error ${index + 1}:`, error.textContent);
  });
} else {
  console.log('✅ No error messages found');
}

// Test 5: Check console for any React errors
console.log('🔍 Check the console above for any React errors or warnings');

console.log('✅ Search functionality test completed'); 