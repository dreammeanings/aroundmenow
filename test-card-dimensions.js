// Test to check card dimensions and positioning
// Run this in the browser console on the discover page

console.log('🔍 Testing card dimensions...');

// Test 1: Look for any elements with event content and check their dimensions
const eventElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club') ||
    el.textContent.includes('$25')
  )
);
console.log('🔍 Elements with event content:', eventElements.length);

// Test 2: Check dimensions of these elements
eventElements.forEach((el, index) => {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  console.log(`Event element ${index + 1}:`, {
    tagName: el.tagName,
    className: el.className,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    display: style.display,
    visibility: style.visibility,
    opacity: style.opacity,
    position: style.position,
    textContent: el.textContent?.substring(0, 50)
  });
});

// Test 3: Look for any elements with zero dimensions
const zeroDimensionElements = eventElements.filter(el => {
  const rect = el.getBoundingClientRect();
  return rect.width === 0 || rect.height === 0;
});
console.log('📏 Zero dimension elements:', zeroDimensionElements.length);

// Test 4: Look for elements positioned off-screen
const offScreenElements = eventElements.filter(el => {
  const rect = el.getBoundingClientRect();
  return rect.top < 0 || rect.left < 0 || rect.bottom > window.innerHeight || rect.right > window.innerWidth;
});
console.log('📱 Off-screen elements:', offScreenElements.length);

// Test 5: Check for any parent containers that might be constraining the cards
const parentContainers = document.querySelectorAll('[class*="list"], [class*="flat"], [class*="scroll"], [class*="container"]');
console.log('📋 Parent containers found:', parentContainers.length);

parentContainers.forEach((container, index) => {
  const rect = container.getBoundingClientRect();
  const style = window.getComputedStyle(container);
  console.log(`Parent container ${index + 1}:`, {
    tagName: container.tagName,
    className: container.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    overflow: style.overflow,
    position: style.position
  });
});

// Test 6: Look for any elements with "Live Jazz Night" specifically
const jazzElements = eventElements.filter(el => 
  el.textContent && el.textContent.includes('Live Jazz Night')
);
console.log('🎷 Jazz elements found:', jazzElements.length);

jazzElements.forEach((el, index) => {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  console.log(`Jazz element ${index + 1}:`, {
    tagName: el.tagName,
    className: el.className,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    display: style.display,
    visibility: style.visibility,
    textContent: el.textContent?.substring(0, 100)
  });
});

console.log('✅ Card dimensions test completed'); 