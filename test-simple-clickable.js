// Simple test to check clickable elements
// Run this in the browser console on the discover page

console.log('🔍 Testing clickable elements...');

// Test 1: Look for any clickable elements
const clickableElements = document.querySelectorAll('[onclick], [onPress], [role="button"], [tabindex]');
console.log('🖱️ Clickable elements found:', clickableElements.length);

// Test 2: Check if any clickable elements contain event content
let clickableEventElements = 0;
Array.from(clickableElements).forEach((element, index) => {
  if (element.textContent && (
    element.textContent.includes('Live Jazz Night') ||
    element.textContent.includes('Blue Note Jazz Club') ||
    element.textContent.includes('$25')
  )) {
    clickableEventElements++;
    console.log(`🎯 Clickable event element ${clickableEventElements}:`, {
      tagName: element.tagName,
      className: element.className,
      textContent: element.textContent?.substring(0, 100)
    });
  }
});
console.log('🎯 Clickable elements with event content:', clickableEventElements);

// Test 3: Look for any elements with "Live Jazz Night" specifically
const eventElements = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && (
    el.textContent.includes('Live Jazz Night') ||
    el.textContent.includes('Blue Note Jazz Club') ||
    el.textContent.includes('$25')
  )
);
console.log('🔍 Elements with event content:', eventElements.length);

const jazzElements = eventElements.filter(el => 
  el.textContent && el.textContent.includes('Live Jazz Night')
);
console.log('🎷 Jazz elements found:', jazzElements.length);

// Test 4: Check if any jazz elements are clickable
let clickableJazzElements = 0;
jazzElements.forEach((element, index) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  if (rect.width > 0 && rect.height > 0) {
    clickableJazzElements++;
    console.log(`🎷 Clickable jazz element ${clickableJazzElements}:`, {
      tagName: element.tagName,
      className: element.className,
      width: rect.width,
      height: rect.height,
      display: style.display,
      textContent: element.textContent?.substring(0, 100)
    });
  }
});
console.log('🎷 Clickable jazz elements found:', clickableJazzElements);

console.log('✅ Simple clickable test completed'); 