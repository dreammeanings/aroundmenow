// Simple search test script
// Run this in the browser console on the discover page

console.log('🔍 Starting simple search test...');

// Test 1: Find the search input
const searchInput = document.querySelector('input[placeholder*="Search"]') || 
                   document.querySelector('[data-testid="search-input"]') ||
                   document.querySelector('input[type="text"]');

if (searchInput) {
  console.log('✅ Search input found');
  console.log('📝 Current value:', searchInput.value);
  
  // Test 2: Try typing "jazz" character by character
  console.log('🔍 Testing typing "jazz"...');
  
  const testText = 'jazz';
  for (let i = 0; i < testText.length; i++) {
    const char = testText[i];
    console.log(`🔍 Typing character ${i + 1}: "${char}"`);
    
    // Set the value
    searchInput.value = testText.substring(0, i + 1);
    
    // Trigger the input event
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log(`🔍 After typing "${char}", input value is: "${searchInput.value}"`);
    
    // Wait a bit between characters
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('🔍 Final input value:', searchInput.value);
  
  // Test 3: Check if any events are visible
  setTimeout(() => {
    const eventCards = document.querySelectorAll('[data-testid="event-card"]');
    console.log('📊 Event cards found after search:', eventCards.length);
    
    if (eventCards.length > 0) {
      console.log('✅ Search is working! Found event cards');
    } else {
      console.log('❌ No event cards found after search');
    }
  }, 500);
  
} else {
  console.log('❌ Search input not found');
  console.log('🔍 Available inputs:', document.querySelectorAll('input').length);
  document.querySelectorAll('input').forEach((input, index) => {
    console.log(`Input ${index}:`, input.type, input.placeholder, input.value);
  });
}

console.log('✅ Simple search test completed'); 