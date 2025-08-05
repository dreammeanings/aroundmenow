// Test to check if event cards are in DOM but hidden
// Run this in the browser console on the discover page

console.log('🔍 Testing card visibility...');

// Test 1: Check for any elements with event card content
const eventElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club') ||
    el.textContent.includes('$25')
  )
);
console.log('🔍 Elements with event content:', eventElements.length);

// Test 2: Check if any of these elements are hidden
const hiddenElements = eventElements.filter(el => {
  const style = window.getComputedStyle(el);
  return style.display === 'none' || 
         style.visibility === 'hidden' || 
         style.opacity === '0' ||
         style.position === 'absolute' ||
         style.position === 'fixed';
});
console.log('👻 Hidden event elements:', hiddenElements.length);

// Test 3: Look for the actual card containers
const cardContainers = document.querySelectorAll('[data-testid="event-card"]');
console.log('📦 Card containers found:', cardContainers.length);

cardContainers.forEach((card, index) => {
  const style = window.getComputedStyle(card);
  console.log(`Card ${index + 1}:`, {
    display: style.display,
    visibility: style.visibility,
    opacity: style.opacity,
    position: style.position,
    height: style.height,
    width: style.width,
    textContent: card.textContent?.substring(0, 50)
  });
});

// Test 4: Check for any parent containers that might be hiding the cards
const parentContainers = document.querySelectorAll('[class*="list"], [class*="flat"], [class*="scroll"]');
console.log('📋 Parent containers found:', parentContainers.length);

parentContainers.forEach((container, index) => {
  const style = window.getComputedStyle(container);
  console.log(`Container ${index + 1}:`, {
    display: style.display,
    visibility: style.visibility,
    height: style.height,
    width: style.width,
    overflow: style.overflow
  });
});

// Test 5: Look for any elements with "Live Jazz Night" and check their visibility
const jazzElements = eventElements.filter(el => 
  el.textContent && el.textContent.includes('Live Jazz Night')
);
console.log('🎷 Jazz elements found:', jazzElements.length);

jazzElements.forEach((el, index) => {
  const style = window.getComputedStyle(el);
  console.log(`Jazz element ${index + 1}:`, {
    tagName: el.tagName,
    className: el.className,
    display: style.display,
    visibility: style.visibility,
    opacity: style.opacity,
    position: style.position,
    textContent: el.textContent?.substring(0, 100)
  });
});

console.log('✅ Card visibility test completed'); 