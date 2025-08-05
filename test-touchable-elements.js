// Test to find TouchableOpacity elements rendered as div elements
// Run this in the browser console on the discover page

console.log('🔍 Testing TouchableOpacity elements...');

// Test 1: Look for div elements with role="button" (TouchableOpacity in React Native web)
const buttonElements = document.querySelectorAll('div[role="button"]');
console.log('🔘 Button elements found:', buttonElements.length);

buttonElements.forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  console.log(`Button element ${index + 1}:`, {
    className: element.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    textContent: element.textContent?.substring(0, 100)
  });
});

// Test 2: Look for any elements with event card content
const eventElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club') ||
    el.textContent.includes('$25')
  )
);
console.log('🔍 Elements with event content:', eventElements.length);

// Test 3: Look for elements with data-testid="event-card"
const eventCards = document.querySelectorAll('[data-testid="event-card"]');
console.log('📦 Event cards with data-testid found:', eventCards.length);

eventCards.forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  console.log(`Event card ${index + 1}:`, {
    tagName: element.tagName,
    className: element.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    textContent: element.textContent?.substring(0, 100)
  });
});

// Test 4: Look for any clickable elements
const clickableElements = document.querySelectorAll('[onclick], [onPress], [role="button"], [tabindex]');
console.log('🖱️ Clickable elements found:', clickableElements.length);

clickableElements.slice(0, 5).forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  console.log(`Clickable element ${index + 1}:`, {
    tagName: element.tagName,
    className: element.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    textContent: element.textContent?.substring(0, 100)
  });
});

// Test 5: Look for elements with specific event card classes
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

console.log('✅ TouchableOpacity test completed'); 