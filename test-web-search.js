// Test script for the new WebSearchInput component
// Run this in the browser console on the discover page

console.log('🔍 Testing new WebSearchInput component...');

// Test 1: Find the search input
const searchInput = document.querySelector('input[placeholder*="Search"]') || 
                   document.querySelector('[data-testid="search-input"]') ||
                   document.querySelector('input[type="text"]');

if (searchInput) {
  console.log('✅ WebSearchInput found');
  console.log('📝 Current value:', searchInput.value);
  console.log('📝 Input type:', searchInput.type);
  console.log('📝 Input placeholder:', searchInput.placeholder);
  console.log('📝 Input tag name:', searchInput.tagName);
  
  // Test 2: Try typing "jazz" character by character
  console.log('🔍 Testing typing "jazz"...');
  
  const testText = 'jazz';
  let currentText = '';
  
  for (let i = 0; i < testText.length; i++) {
    const char = testText[i];
    currentText += char;
    console.log(`🔍 Typing character ${i + 1}: "${char}"`);
    console.log(`🔍 Current text so far: "${currentText}"`);
    
    // Set the value
    searchInput.value = currentText;
    
    // Trigger the input event
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log(`🔍 After typing "${char}", input value is: "${searchInput.value}"`);
    
    // Wait a bit between characters
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('🔍 Final input value:', searchInput.value);
  
  // Test 3: Check if any events are visible after a delay
  setTimeout(() => {
    const eventCards = document.querySelectorAll('[data-testid="event-card"]');
    console.log('📊 Event cards found after search:', eventCards.length);
    
    if (eventCards.length > 0) {
      console.log('✅ Search is working! Found event cards');
      eventCards.forEach((card, index) => {
        console.log(`📋 Event ${index + 1}:`, card.textContent?.substring(0, 50));
      });
    } else {
      console.log('❌ No event cards found after search');
      
      // Check if there are any elements with "jazz" in the text
      const jazzElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.toLowerCase().includes('jazz')
      );
      console.log('🔍 Elements containing "jazz":', jazzElements.length);
      jazzElements.slice(0, 3).forEach((el, index) => {
        console.log(`🔍 Jazz element ${index + 1}:`, el.textContent?.substring(0, 50));
      });
    }
  }, 1000);
  
} else {
  console.log('❌ WebSearchInput not found');
  console.log('🔍 Available inputs:', document.querySelectorAll('input').length);
  document.querySelectorAll('input').forEach((input, index) => {
    console.log(`Input ${index}:`, input.type, input.placeholder, input.value, input.tagName);
  });
}

// Test 4: Check for any React errors
console.log('🔍 Check the console above for any React errors or warnings');
console.log('🔍 Look for our debug messages starting with 🔍');

console.log('✅ WebSearchInput component test completed'); 