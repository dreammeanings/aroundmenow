// Web-specific test script for search functionality
// Run this in the browser console on the discover page

console.log('🔍 Starting web search functionality test...');

// Test 1: Check if search input exists (using multiple selectors)
const searchInput = document.querySelector('input[placeholder*="Search"]') || 
                   document.querySelector('[data-testid="search-input"]') ||
                   document.querySelector('input[type="text"]');

if (searchInput) {
  console.log('✅ Search input found');
  console.log('📝 Current search value:', searchInput.value);
  console.log('📝 Input type:', searchInput.type);
  console.log('📝 Input placeholder:', searchInput.placeholder);
} else {
  console.log('❌ Search input not found');
  console.log('🔍 Available inputs:', document.querySelectorAll('input').length);
  document.querySelectorAll('input').forEach((input, index) => {
    console.log(`Input ${index}:`, input.type, input.placeholder, input.value);
  });
}

// Test 2: Check if events are loaded (using multiple selectors)
const eventCards = document.querySelectorAll('[data-testid="event-card"]') ||
                  document.querySelectorAll('[testid="event-card"]') ||
                  document.querySelectorAll('.event-card') ||
                  document.querySelectorAll('[class*="card"]');

console.log('📊 Found event cards:', eventCards.length);

// Test 3: Check for any React components
const reactComponents = document.querySelectorAll('[class*="react"]');
console.log('⚛️  React components found:', reactComponents.length);

// Test 4: Check for any text content that might be events
const eventTexts = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Jazz') || 
    el.textContent.includes('Tech') || 
    el.textContent.includes('Art')
  )
);
console.log('📝 Potential event text elements:', eventTexts.length);
eventTexts.slice(0, 5).forEach((el, index) => {
  console.log(`Text ${index}:`, el.textContent.substring(0, 50));
});

// Test 5: Simulate typing in search (if input found)
if (searchInput) {
  console.log('🔍 Testing search with "jazz"...');
  
  // Try multiple ways to trigger input
  searchInput.value = 'jazz';
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  searchInput.dispatchEvent(new Event('change', { bubbles: true }));
  searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'j' }));
  searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'j' }));
  
  console.log('🔍 After setting value, searchInput.value:', searchInput.value);
  
  // Wait a bit and check results
  setTimeout(() => {
    console.log('🔍 Checking results after 1 second...');
    const updatedEventCards = document.querySelectorAll('[data-testid="event-card"]');
    console.log('🔍 After search, found event cards:', updatedEventCards.length);
    
    if (updatedEventCards.length > 0) {
      console.log('✅ Search is working - found results');
    } else {
      console.log('❌ Search returned no results');
      console.log('🔍 Checking if any elements contain "jazz"...');
      const jazzElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.toLowerCase().includes('jazz')
      );
      console.log('🔍 Elements containing "jazz":', jazzElements.length);
    }
  }, 1000);
}

// Test 6: Check console for any React errors
console.log('🔍 Check the console above for any React errors or warnings');
console.log('🔍 Look for our debug messages starting with 🔍');

console.log('✅ Web search functionality test completed'); 