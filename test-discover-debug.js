const puppeteer = require('puppeteer');

async function testDiscoverPage() {
  console.log('🔍 Starting comprehensive Discover page debug test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 375, height: 812 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log('📱 Console:', msg.text());
    });
    
    page.on('pageerror', error => {
      console.error('❌ Page Error:', error.message);
    });

    // Navigate to the app
    console.log('🌐 Navigating to app...');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle2' });
    
    // Wait for the app to load
    await page.waitForTimeout(3000);
    
    console.log('✅ App loaded successfully');
    
    // Test 1: Check if events are loading
    console.log('\n🧪 Test 1: Event Loading');
    try {
      const eventCards = await page.$$('[data-testid="event-card"]');
      console.log(`📊 Found ${eventCards.length} event cards`);
      
      if (eventCards.length === 0) {
        console.log('⚠️  No event cards found - checking for loading state');
        const loadingText = await page.$eval('body', el => el.textContent);
        console.log('📄 Page content:', loadingText.substring(0, 200));
      }
    } catch (error) {
      console.error('❌ Error checking event cards:', error.message);
    }
    
    // Test 2: Test search functionality
    console.log('\n🧪 Test 2: Search Functionality');
    try {
      const searchInput = await page.$('input[placeholder*="Search"]');
      if (searchInput) {
        await searchInput.type('jazz');
        await page.waitForTimeout(1000);
        
        const searchResults = await page.$$('[data-testid="event-card"]');
        console.log(`🔍 Search results: ${searchResults.length} events found for "jazz"`);
      } else {
        console.log('⚠️  Search input not found');
      }
    } catch (error) {
      console.error('❌ Error testing search:', error.message);
    }
    
    // Test 3: Test filter functionality
    console.log('\n🧪 Test 3: Filter Functionality');
    try {
      const filterButton = await page.$('button[aria-label*="filter"], button:has-text("filter")');
      if (filterButton) {
        await filterButton.click();
        await page.waitForTimeout(1000);
        
        const filterModal = await page.$('[role="dialog"]');
        if (filterModal) {
          console.log('✅ Filter modal opened successfully');
          
          // Try to apply a filter
          const applyButton = await page.$('button:has-text("Apply")');
          if (applyButton) {
            await applyButton.click();
            await page.waitForTimeout(1000);
            console.log('✅ Filter applied successfully');
          }
        } else {
          console.log('⚠️  Filter modal not found');
        }
      } else {
        console.log('⚠️  Filter button not found');
      }
    } catch (error) {
      console.error('❌ Error testing filters:', error.message);
    }
    
    // Test 4: Test calendar functionality
    console.log('\n🧪 Test 4: Calendar Functionality');
    try {
      const calendarButton = await page.$('button[aria-label*="calendar"], button:has-text("calendar")');
      if (calendarButton) {
        await calendarButton.click();
        await page.waitForTimeout(1000);
        
        const calendarModal = await page.$('[role="dialog"]');
        if (calendarModal) {
          console.log('✅ Calendar modal opened successfully');
          
          // Try to select a date
          const dateButtons = await page.$$('button[data-testid*="date"]');
          if (dateButtons.length > 0) {
            await dateButtons[0].click();
            await page.waitForTimeout(1000);
            console.log('✅ Date selected successfully');
          }
        } else {
          console.log('⚠️  Calendar modal not found');
        }
      } else {
        console.log('⚠️  Calendar button not found');
      }
    } catch (error) {
      console.error('❌ Error testing calendar:', error.message);
    }
    
    // Test 5: Test event saving
    console.log('\n🧪 Test 5: Event Saving');
    try {
      const saveButtons = await page.$$('button[aria-label*="save"], button:has-text("heart")');
      if (saveButtons.length > 0) {
        await saveButtons[0].click();
        await page.waitForTimeout(1000);
        console.log('✅ Event save button clicked');
        
        // Check if the button state changed
        const buttonState = await saveButtons[0].evaluate(el => el.textContent);
        console.log('💾 Save button state:', buttonState);
      } else {
        console.log('⚠️  Save buttons not found');
      }
    } catch (error) {
      console.error('❌ Error testing event saving:', error.message);
    }
    
    // Test 6: Test tab navigation
    console.log('\n🧪 Test 6: Tab Navigation');
    try {
      const tabs = await page.$$('button[role="tab"], button:has-text("Trending"), button:has-text("Hot")');
      if (tabs.length > 0) {
        for (let i = 0; i < Math.min(tabs.length, 3); i++) {
          await tabs[i].click();
          await page.waitForTimeout(500);
          console.log(`✅ Tab ${i + 1} clicked`);
        }
      } else {
        console.log('⚠️  Tab buttons not found');
      }
    } catch (error) {
      console.error('❌ Error testing tab navigation:', error.message);
    }
    
    // Test 7: Test refresh functionality
    console.log('\n🧪 Test 7: Refresh Functionality');
    try {
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1000);
      
      // Simulate pull-to-refresh
      await page.mouse.move(200, 100);
      await page.mouse.down();
      await page.mouse.move(200, 300);
      await page.mouse.up();
      await page.waitForTimeout(2000);
      
      console.log('✅ Pull-to-refresh simulated');
    } catch (error) {
      console.error('❌ Error testing refresh:', error.message);
    }
    
    // Test 8: Check for any error states
    console.log('\n🧪 Test 8: Error State Check');
    try {
      const errorMessages = await page.$$('text="Error", text="Failed", text="Unable"');
      if (errorMessages.length > 0) {
        console.log('⚠️  Error messages found on page');
        for (const error of errorMessages) {
          const text = await error.evaluate(el => el.textContent);
          console.log('❌ Error:', text);
        }
      } else {
        console.log('✅ No error messages found');
      }
    } catch (error) {
      console.error('❌ Error checking error states:', error.message);
    }
    
    // Test 9: Performance check
    console.log('\n🧪 Test 9: Performance Check');
    try {
      const metrics = await page.metrics();
      console.log('📊 Performance metrics:', {
        Timestamp: metrics.Timestamp,
        Documents: metrics.Documents,
        Frames: metrics.Frames,
        JSEventListeners: metrics.JSEventListeners,
        Nodes: metrics.Nodes,
        LayoutCount: metrics.LayoutCount,
        RecalcStyleCount: metrics.RecalcStyleCount,
        LayoutDuration: metrics.LayoutDuration,
        RecalcStyleDuration: metrics.RecalcStyleDuration,
        ScriptDuration: metrics.ScriptDuration,
        TaskDuration: metrics.TaskDuration,
        JSHeapUsedSize: metrics.JSHeapUsedSize,
        JSHeapTotalSize: metrics.JSHeapTotalSize,
      });
    } catch (error) {
      console.error('❌ Error checking performance:', error.message);
    }
    
    console.log('\n✅ Comprehensive Discover page debug test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testDiscoverPage().catch(console.error); 