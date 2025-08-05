const { test, expect } = require('@playwright/test');

test.describe('Slider Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081');
    await page.waitForLoadState('networkidle');
  });

  test('should open filter modal and access distance slider', async ({ page }) => {
    // Click filter button
    await page.click('ion-icon[name="filter"]');
    
    // Check if filter modal opens
    await expect(page.locator('text=Filters')).toBeVisible();
    
    // Check distance section is present
    await expect(page.locator('text=Distance')).toBeVisible();
    
    // Check distance value is displayed
    await expect(page.locator('text=25 miles')).toBeVisible();
    
    // Check slider track is present
    const sliderTrack = page.locator('.sliderTrack');
    await expect(sliderTrack).toBeVisible();
  });

  test('should display distance labels correctly', async ({ page }) => {
    // Open filter modal
    await page.click('ion-icon[name="filter"]');
    
    // Check distance labels are present
    await expect(page.locator('text=5 mi')).toBeVisible();
    await expect(page.locator('text=25 mi')).toBeVisible();
    await expect(page.locator('text=50 mi')).toBeVisible();
    await expect(page.locator('text=100 mi')).toBeVisible();
  });

  test('should show distance label based on value', async ({ page }) => {
    // Open filter modal
    await page.click('ion-icon[name="filter"]');
    
    // Check default distance label
    await expect(page.locator('text=Local')).toBeVisible();
    await expect(page.locator('text=25 miles')).toBeVisible();
  });

  test('should have functional filter sections', async ({ page }) => {
    // Open filter modal
    await page.click('ion-icon[name="filter"]');
    
    // Check all filter sections are present
    await expect(page.locator('text=When')).toBeVisible();
    await expect(page.locator('text=Distance')).toBeVisible();
    await expect(page.locator('text=Price')).toBeVisible();
    await expect(page.locator('text=Event Types')).toBeVisible();
    await expect(page.locator('text=Vibe')).toBeVisible();
  });

  test('should apply filters correctly', async ({ page }) => {
    // Open filter modal
    await page.click('ion-icon[name="filter"]');
    
    // Select a filter
    await page.click('text=Music');
    
    // Apply filters
    await page.click('text=Apply Filters');
    
    // Verify modal closes
    await expect(page.locator('text=Filters')).not.toBeVisible();
  });

  test('should reset filters correctly', async ({ page }) => {
    // Open filter modal
    await page.click('ion-icon[name="filter"]');
    
    // Apply some filters
    await page.click('text=Music');
    await page.click('text=Free');
    
    // Reset filters
    await page.click('text=Reset');
    
    // Verify filters are reset
    await expect(page.locator('text=Today')).toBeVisible();
    await expect(page.locator('text=25 miles')).toBeVisible();
  });

  test('should show active filter count', async ({ page }) => {
    // Open filter modal
    await page.click('ion-icon[name="filter"]');
    
    // Apply multiple filters
    await page.click('text=Music');
    await page.click('text=Free');
    await page.click('text=Casual');
    
    // Check if filter count is displayed
    await expect(page.locator('text=Apply Filters (3)')).toBeVisible();
  });
});

console.log('✅ Slider functionality test suite created');
console.log('🔧 Tests cover:');
console.log('   - Filter modal opening and accessibility');
console.log('   - Distance slider presence and labels');
console.log('   - Distance value display and labels');
console.log('   - Filter section functionality');
console.log('   - Filter application and reset');
console.log('   - Active filter count display'); 