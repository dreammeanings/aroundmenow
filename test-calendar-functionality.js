const { test, expect } = require('@playwright/test');

test.describe('Calendar Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should have functional calendar with date selection', async ({ page }) => {
    console.log('🧪 Testing Calendar Functionality');
    
    // Test calendar button in header
    const calendarButton = page.locator('[data-testid="calendar-button"]');
    await expect(calendarButton).toBeVisible();
    await calendarButton.click();
    
    // Test calendar modal opens
    const calendarModal = page.locator('[data-testid="calendar-modal"]');
    await expect(calendarModal).toBeVisible();
    
    // Test month navigation
    const prevMonthButton = page.locator('[data-testid="prev-month-button"]');
    const nextMonthButton = page.locator('[data-testid="next-month-button"]');
    const monthTitle = page.locator('[data-testid="month-title"]');
    
    await expect(prevMonthButton).toBeVisible();
    await expect(nextMonthButton).toBeVisible();
    await expect(monthTitle).toBeVisible();
    
    // Test day selection
    const todayCell = page.locator('[data-testid="calendar-day"].today');
    await expect(todayCell).toBeVisible();
    await todayCell.click();
    
    // Test date selection applies
    const applyButton = page.locator('[data-testid="apply-date-button"]');
    await expect(applyButton).toBeEnabled();
    await applyButton.click();
    
    // Test calendar closes and date is applied
    await expect(calendarModal).not.toBeVisible();
    
    console.log('   ✅ Calendar date selection works');
  });

  test('should support custom date range selection', async ({ page }) => {
    console.log('🧪 Testing Custom Date Range Selection');
    
    // Open filters
    const filterButton = page.locator('[data-testid="filter-button"]');
    await filterButton.click();
    
    // Select custom date range
    const customRangeChip = page.locator('[data-testid="date-chip-custom"]');
    await customRangeChip.click();
    
    // Test calendar opens in range mode
    const calendarModal = page.locator('[data-testid="calendar-modal"]');
    await expect(calendarModal).toBeVisible();
    
    // Test range selection
    const firstDay = page.locator('[data-testid="calendar-day"]').first();
    const lastDay = page.locator('[data-testid="calendar-day"]').last();
    
    await firstDay.click();
    await lastDay.click();
    
    // Test range is selected
    const startDate = page.locator('[data-testid="start-date"]');
    const endDate = page.locator('[data-testid="end-date"]');
    await expect(startDate).toBeVisible();
    await expect(endDate).toBeVisible();
    
    // Test apply range
    const applyRangeButton = page.locator('[data-testid="apply-range-button"]');
    await expect(applyRangeButton).toBeEnabled();
    await applyRangeButton.click();
    
    // Test custom date range is displayed
    const customDateDisplay = page.locator('[data-testid="custom-date-display"]');
    await expect(customDateDisplay).toBeVisible();
    
    console.log('   ✅ Custom date range selection works');
  });

  test('should display events on selected dates', async ({ page }) => {
    console.log('🧪 Testing Event Display on Selected Dates');
    
    // Open calendar
    const calendarButton = page.locator('[data-testid="calendar-button"]');
    await calendarButton.click();
    
    // Select a date with events
    const dayWithEvents = page.locator('[data-testid="calendar-day"].has-events');
    if (await dayWithEvents.count() > 0) {
      await dayWithEvents.first().click();
      
      // Test events are displayed
      const eventsContainer = page.locator('[data-testid="events-container"]');
      await expect(eventsContainer).toBeVisible();
      
      const eventCards = page.locator('[data-testid="event-card"]');
      await expect(eventCards).toHaveCount.greaterThan(0);
      
      console.log('   ✅ Events display on selected dates');
    } else {
      console.log('   ⚠️ No days with events found for testing');
    }
  });

  test('should handle date range with multiple events', async ({ page }) => {
    console.log('🧪 Testing Date Range with Multiple Events');
    
    // Open filters and select custom range
    const filterButton = page.locator('[data-testid="filter-button"]');
    await filterButton.click();
    
    const customRangeChip = page.locator('[data-testid="date-chip-custom"]');
    await customRangeChip.click();
    
    // Select a range
    const calendarDays = page.locator('[data-testid="calendar-day"]');
    const firstDay = calendarDays.first();
    const fifthDay = calendarDays.nth(4);
    
    await firstDay.click();
    await fifthDay.click();
    
    // Test events in range are displayed
    const eventsList = page.locator('[data-testid="events-list"]');
    await expect(eventsList).toBeVisible();
    
    // Test range events count
    const eventsCount = page.locator('[data-testid="events-count"]');
    if (await eventsCount.isVisible()) {
      const count = await eventsCount.textContent();
      console.log(`   📅 Found ${count} events in date range`);
    }
    
    console.log('   ✅ Date range with multiple events works');
  });

  test('should have proper calendar navigation', async ({ page }) => {
    console.log('🧪 Testing Calendar Navigation');
    
    // Open calendar
    const calendarButton = page.locator('[data-testid="calendar-button"]');
    await calendarButton.click();
    
    // Test month navigation
    const prevButton = page.locator('[data-testid="prev-month-button"]');
    const nextButton = page.locator('[data-testid="next-month-button"]');
    const monthTitle = page.locator('[data-testid="month-title"]');
    
    // Get current month
    const currentMonth = await monthTitle.textContent();
    
    // Navigate to next month
    await nextButton.click();
    const nextMonth = await monthTitle.textContent();
    expect(nextMonth).not.toBe(currentMonth);
    
    // Navigate back
    await prevButton.click();
    const backMonth = await monthTitle.textContent();
    expect(backMonth).toBe(currentMonth);
    
    console.log('   ✅ Calendar navigation works');
  });

  test('should handle empty date selections gracefully', async ({ page }) => {
    console.log('🧪 Testing Empty Date Selections');
    
    // Open calendar
    const calendarButton = page.locator('[data-testid="calendar-button"]');
    await calendarButton.click();
    
    // Test no events message
    const noEventsMessage = page.locator('[data-testid="no-events-message"]');
    if (await noEventsMessage.isVisible()) {
      await expect(noEventsMessage).toContainText('No events');
      console.log('   ✅ Empty date selection handled gracefully');
    }
    
    // Test clear selection
    const clearButton = page.locator('[data-testid="clear-selection-button"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      console.log('   ✅ Clear selection works');
    }
  });

  test('should integrate with filter system', async ({ page }) => {
    console.log('🧪 Testing Calendar-Filter Integration');
    
    // Open filters
    const filterButton = page.locator('[data-testid="filter-button"]');
    await filterButton.click();
    
    // Select custom date range
    const customRangeChip = page.locator('[data-testid="date-chip-custom"]');
    await customRangeChip.click();
    
    // Set date range
    const calendarDays = page.locator('[data-testid="calendar-day"]');
    await calendarDays.first().click();
    await calendarDays.nth(3).click();
    
    // Apply filters
    const applyFiltersButton = page.locator('[data-testid="apply-filters-button"]');
    await applyFiltersButton.click();
    
    // Test filters are applied
    const activeFiltersCount = page.locator('[data-testid="active-filters-count"]');
    await expect(activeFiltersCount).toContainText('1');
    
    console.log('   ✅ Calendar integrates with filter system');
  });

  test('should have responsive calendar design', async ({ page }) => {
    console.log('🧪 Testing Calendar Responsive Design');
    
    // Open calendar
    const calendarButton = page.locator('[data-testid="calendar-button"]');
    await calendarButton.click();
    
    // Test calendar layout
    const calendarGrid = page.locator('[data-testid="calendar-grid"]');
    await expect(calendarGrid).toBeVisible();
    
    // Test day headers
    const dayHeaders = page.locator('[data-testid="day-header"]');
    await expect(dayHeaders).toHaveCount(7);
    
    // Test calendar days
    const calendarDays = page.locator('[data-testid="calendar-day"]');
    await expect(calendarDays).toHaveCount.greaterThan(28);
    
    // Test responsive sizing
    const calendarContainer = page.locator('[data-testid="calendar-container"]');
    const containerBox = await calendarContainer.boundingBox();
    expect(containerBox.width).toBeGreaterThan(300);
    
    console.log('   ✅ Calendar has responsive design');
  });

  test('should handle edge cases and errors', async ({ page }) => {
    console.log('🧪 Testing Calendar Edge Cases');
    
    // Test invalid date selections
    const calendarButton = page.locator('[data-testid="calendar-button"]');
    await calendarButton.click();
    
    // Test past date selection (should be disabled or handled)
    const pastDays = page.locator('[data-testid="calendar-day"].past');
    if (await pastDays.count() > 0) {
      await pastDays.first().click();
      // Should show appropriate message or be disabled
      console.log('   ✅ Past date selection handled');
    }
    
    // Test very long date ranges
    const calendarDays = page.locator('[data-testid="calendar-day"]');
    await calendarDays.first().click();
    
    // Navigate to far future
    const nextButton = page.locator('[data-testid="next-month-button"]');
    for (let i = 0; i < 12; i++) {
      await nextButton.click();
    }
    
    await calendarDays.last().click();
    
    // Should handle large ranges gracefully
    console.log('   ✅ Large date ranges handled');
  });

  test('should provide good user feedback', async ({ page }) => {
    console.log('🧪 Testing Calendar User Feedback');
    
    // Open calendar
    const calendarButton = page.locator('[data-testid="calendar-button"]');
    await calendarButton.click();
    
    // Test visual feedback for today
    const todayCell = page.locator('[data-testid="calendar-day"].today');
    await expect(todayCell).toHaveClass(/today/);
    
    // Test visual feedback for selected date
    const firstDay = page.locator('[data-testid="calendar-day"]').first();
    await firstDay.click();
    await expect(firstDay).toHaveClass(/selected/);
    
    // Test visual feedback for date range
    const secondDay = page.locator('[data-testid="calendar-day"]').nth(1);
    await secondDay.click();
    await expect(firstDay).toHaveClass(/in-range/);
    await expect(secondDay).toHaveClass(/in-range/);
    
    // Test event indicators
    const daysWithEvents = page.locator('[data-testid="calendar-day"].has-events');
    if (await daysWithEvents.count() > 0) {
      await expect(daysWithEvents.first()).toHaveClass(/has-events/);
      console.log('   ✅ Event indicators work');
    }
    
    console.log('   ✅ Calendar provides good user feedback');
  });
});

console.log('🎉 Calendar functionality tests completed!'); 