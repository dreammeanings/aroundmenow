// Test the rendering fix
// Run this in the browser console on the discover page

console.log('🔍 Testing rendering fix...');

// Test 1: Check if search input exists and works
const searchInput = document.querySelector('input[placeholder*="Search"]');
if (searchInput) {
  console.log('✅ Search input found');
  
  // Test 2: Set search value to "jazz"
  searchInput.value = 'jazz';
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  
  console.log('🔍 Set search to "jazz"');
  
  // Test 3: Wait and check for event cards
  setTimeout(() => {
    console.log('🔍 Checking for event cards...');
    
    const eventCards = document.querySelectorAll('[data-testid="event-card"]');
    console.log('📊 Event cards found:', eventCards.length);
    
    if (eventCards.length > 0) {
      console.log('✅ Rendering fix worked! Found event cards');
      eventCards.forEach((card, index) => {
        console.log(`📋 Event card ${index + 1}:`, card.textContent?.substring(0, 100));
      });
    } else {
      console.log('❌ Still no event cards found');
      
      // Check for any elements with jazz content
      const jazzElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.includes('Live Jazz Night')
      );
      console.log('🔍 Elements with "Live Jazz Night":', jazzElements.length);
    }
  }, 2000);
  
} else {
  console.log('❌ Search input not found');
}

console.log('✅ Rendering fix test completed'); 