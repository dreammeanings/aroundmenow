// Debug test for typing issues
// Run this in the browser console on the discover page

console.log('🔍 Debugging typing issues...');

// Test 1: Find the search input
const searchInput = document.querySelector('input[placeholder*="Search"]') || 
                   document.querySelector('[data-testid="search-input"]') ||
                   document.querySelector('input[type="text"]');

if (searchInput) {
  console.log('✅ Search input found');
  console.log('📝 Current value:', searchInput.value);
  console.log('📝 Input type:', searchInput.type);
  console.log('📝 Input tag name:', searchInput.tagName);
  
  // Test 2: Try to type "jazz" character by character
  console.log('🔍 Testing typing "jazz" character by character...');
  
  const testText = 'jazz';
  let currentText = '';
  
  for (let i = 0; i < testText.length; i++) {
    const char = testText[i];
    currentText += char;
    console.log(`🔍 Typing character ${i + 1}: "${char}"`);
    console.log(`🔍 Current text so far: "${currentText}"`);
    
    // Set the value
    searchInput.value = currentText;
    
    // Trigger multiple events to ensure React picks up the change
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
    searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
    
    console.log(`🔍 After typing "${char}", input value is: "${searchInput.value}"`);
    
    // Wait a bit between characters
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('🔍 Final input value:', searchInput.value);
  
  // Test 3: Check if any events are visible after a delay
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

// Test 4: Try clicking the manual test button
console.log('🔍 Looking for manual test button...');

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

console.log('✅ Typing debug test completed'); 