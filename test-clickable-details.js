// Test to check clickable elements in detail
// Run this in the browser console on the discover page

console.log('🔍 Testing clickable elements in detail...');

// Test 1: Look for any clickable elements
const clickableElements = document.querySelectorAll('[onclick], [onPress], [role="button"], [tabindex]');
console.log('🖱️ Clickable elements found:', clickableElements.length);

// Test 2: Check what type of elements these are
Array.from(clickableElements).forEach((element, index) => {
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

// Test 3: Look for any elements with event content
const eventElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club') ||
    el.textContent.includes('$25')
  )
);
console.log('🔍 Elements with event content:', eventElements.length);

// Test 4: Check if any clickable elements contain event content
const clickableEventElements = Array.from(clickableElements).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club') ||
    el.textContent.includes('$25')
  )
);
console.log('🎯 Clickable elements with event content:', clickableEventElements.length);

clickableEventElements.forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  console.log(`Clickable event element ${index + 1}:`, {
    tagName: element.tagName,
    className: element.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    textContent: element.textContent?.substring(0, 100)
  });
});

// Test 5: Look for any elements with specific event card classes
const cardElements = document.querySelectorAll('[class*="card"], [class*="event"]');
console.log('🎴 Card-like elements found:', cardElements.length);

Array.from(cardElements).slice(0, 5).forEach((element, index) => {
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

// Test 6: Look for any elements with "Live Jazz Night" specifically
const jazzElements = eventElements.filter(el => 
  el.textContent && el.textContent.includes('Live Jazz Night')
);
console.log('🎷 Jazz elements found:', jazzElements.length);

jazzElements.slice(0, 5).forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  console.log(`Jazz element ${index + 1}:`, {
    tagName: element.tagName,
    className: element.className,
    width: rect.width,
    height: rect.height,
    display: style.display,
    textContent: element.textContent?.substring(0, 100)
  });
});

console.log('✅ Clickable details test completed'); 