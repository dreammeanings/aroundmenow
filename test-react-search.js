// React-specific test script for search functionality
// Run this in the browser console on the discover page

console.log('🔍 Testing React search functionality...');

// Test 1: Find React components
const reactRoot = document.querySelector('#root') || document.querySelector('[data-reactroot]');
if (reactRoot) {
  console.log('✅ React root found');
  
  // Try to find the search input and trigger React events
  const searchInputElement = document.querySelector('input[placeholder*="Search"]') || 
                     document.querySelector('[data-testid="search-input"]') ||
                     document.querySelector('input[type="text"]');
  
  if (searchInputElement) {
    console.log('✅ Search input found');
    
    // Test 2: Try to trigger React's synthetic events
    console.log('🔍 Testing React synthetic events...');
    
    // Create a synthetic input event
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    Object.defineProperty(inputEvent, 'target', { value: searchInputElement });
    Object.defineProperty(inputEvent, 'currentTarget', { value: searchInputElement });
    
    // Set the value and dispatch the event
    searchInputElement.value = 'jazz';
    searchInputElement.dispatchEvent(inputEvent);
    
    console.log('🔍 Dispatched input event with value "jazz"');
    
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
  
  // Test 3: Try to find and click the manual test button
  console.log('🔍 Looking for manual test button...');
  const buttons = document.querySelectorAll('button');
  let testButton = null;
  
  buttons.forEach((button, index) => {
    const buttonText = button.textContent || button.innerHTML;
    console.log(`Button ${index}:`, buttonText?.substring(0, 30));
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
    console.log('🔍 Available buttons:', buttons.length);
    
    // Look for TouchableOpacity elements that might be the test button
    const touchableElements = document.querySelectorAll('[role="button"]');
    console.log('🔍 Touchable elements found:', touchableElements.length);
    touchableElements.forEach((element, index) => {
      const elementText = element.textContent || element.innerHTML;
      console.log(`Touchable ${index}:`, elementText?.substring(0, 30));
      if (elementText.includes('🐛') || elementText.includes('bug')) {
        console.log(`✅ Manual test button found in touchable element ${index}`);
        element.click();
      }
    });
  }
  
} else {
  console.log('❌ React root not found');
}

// Test 4: Check for any React errors or warnings
console.log('🔍 Check the console above for any React errors or warnings');
console.log('🔍 Look for our debug messages starting with 🔍');

console.log('✅ React search test completed'); 