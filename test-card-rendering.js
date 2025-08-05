// Test to check if event cards are now rendering properly
// Run this in the browser console on the discover page

console.log('🔍 Testing card rendering...');

// Test 1: Look for elements with event content
const eventElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club') ||
    el.textContent.includes('$25')
  )
);
console.log('🔍 Elements with event content:', eventElements.length);

// Test 2: Look for TouchableOpacity elements (which should be the event cards)
const touchableElements = document.querySelectorAll('[role="button"], [data-testid="event-card"]');
console.log('📱 Touchable elements found:', touchableElements.length);

touchableElements.forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  console.log(`Touchable element ${index + 1}:`, {
    tagName: element.tagName,
    className: element.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    textContent: element.textContent?.substring(0, 100)
  });
});

// Test 3: Look for any div elements that might be event cards
const divElements = Array.from(document.querySelectorAll('div')).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club')
  )
);
console.log('📦 Div elements with event content:', divElements.length);

divElements.slice(0, 5).forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  console.log(`Div element ${index + 1}:`, {
    className: element.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    textContent: element.textContent?.substring(0, 100)
  });
});

// Test 4: Check if there are any elements with specific event card classes
const cardElements = document.querySelectorAll('[class*="card"], [class*="event"]');
console.log('🎴 Card-like elements found:', cardElements.length);

cardElements.slice(0, 5).forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  console.log(`Card element ${index + 1}:`, {
    tagName: element.tagName,
    className: element.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    textContent: element.textContent?.substring(0, 100)
  });
});

console.log('✅ Card rendering test completed'); 