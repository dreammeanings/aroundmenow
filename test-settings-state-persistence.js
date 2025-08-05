const { test, expect } = require('@playwright/test');

test.describe('Settings State Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8081');
    
    // Login if needed
    const loginButton = page.locator('text=Login');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.fill('input[placeholder="Email"]', 'test@example.com');
      await page.fill('input[placeholder="Password"]', 'password123');
      await page.click('button:has-text("Login")');
      await page.waitForTimeout(2000);
    }
    
    // Navigate to profile and open settings
    await page.click('button[aria-label="Profile"]');
    await page.waitForTimeout(1000);
    await page.click('button[aria-label="Settings"]');
    await page.waitForTimeout(1000);
  });

  test('Settings persist after navigation', async ({ page }) => {
    // Get initial state of Location Services toggle
    const locationToggle = page.locator('text=Location Services').locator('..').locator('input[type="checkbox"]');
    const initialLocationState = await locationToggle.isChecked();
    
    // Toggle Location Services
    await locationToggle.click();
    await page.waitForTimeout(500);
    
    // Verify toggle changed
    const newLocationState = await locationToggle.isChecked();
    expect(newLocationState).toBe(!initialLocationState);
    
    // Save the setting
    await page.click('text=Save Location Settings');
    await page.waitForTimeout(2000);
    
    // Navigate away
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(1000);
    
    // Navigate back to settings
    await page.click('button[aria-label="Settings"]');
    await page.waitForTimeout(1000);
    
    // Verify setting is still changed
    const finalLocationState = await locationToggle.isChecked();
    expect(finalLocationState).toBe(!initialLocationState);
    
    console.log('✅ Location Services setting persisted correctly');
  });

  test('Privacy settings persist after navigation', async ({ page }) => {
    // Get initial state of Data Sharing toggle
    const dataSharingToggle = page.locator('text=Data Sharing').locator('..').locator('input[type="checkbox"]');
    const initialDataSharingState = await dataSharingToggle.isChecked();
    
    // Toggle Data Sharing
    await dataSharingToggle.click();
    await page.waitForTimeout(500);
    
    // Verify toggle changed
    const newDataSharingState = await dataSharingToggle.isChecked();
    expect(newDataSharingState).toBe(!initialDataSharingState);
    
    // Save the setting
    await page.click('text=Save Privacy Settings');
    await page.waitForTimeout(2000);
    
    // Navigate away
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(1000);
    
    // Navigate back to settings
    await page.click('button[aria-label="Settings"]');
    await page.waitForTimeout(1000);
    
    // Verify setting is still changed
    const finalDataSharingState = await dataSharingToggle.isChecked();
    expect(finalDataSharingState).toBe(!initialDataSharingState);
    
    console.log('✅ Data Sharing setting persisted correctly');
  });

  test('Analytics setting persists after navigation', async ({ page }) => {
    // Get initial state of Analytics toggle
    const analyticsToggle = page.locator('text=Analytics').locator('..').locator('input[type="checkbox"]');
    const initialAnalyticsState = await analyticsToggle.isChecked();
    
    // Toggle Analytics
    await analyticsToggle.click();
    await page.waitForTimeout(500);
    
    // Verify toggle changed
    const newAnalyticsState = await analyticsToggle.isChecked();
    expect(newAnalyticsState).toBe(!initialAnalyticsState);
    
    // Save the setting
    await page.click('text=Save Privacy Settings');
    await page.waitForTimeout(2000);
    
    // Navigate away
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(1000);
    
    // Navigate back to settings
    await page.click('button[aria-label="Settings"]');
    await page.waitForTimeout(1000);
    
    // Verify setting is still changed
    const finalAnalyticsState = await analyticsToggle.isChecked();
    expect(finalAnalyticsState).toBe(!initialAnalyticsState);
    
    console.log('✅ Analytics setting persisted correctly');
  });

  test('Multiple settings persist together', async ({ page }) => {
    // Change multiple settings
    const locationToggle = page.locator('text=Location Services').locator('..').locator('input[type="checkbox"]');
    const dataSharingToggle = page.locator('text=Data Sharing').locator('..').locator('input[type="checkbox"]');
    
    const initialLocationState = await locationToggle.isChecked();
    const initialDataSharingState = await dataSharingToggle.isChecked();
    
    // Toggle both settings
    await locationToggle.click();
    await page.waitForTimeout(300);
    await dataSharingToggle.click();
    await page.waitForTimeout(300);
    
    // Save location settings
    await page.click('text=Save Location Settings');
    await page.waitForTimeout(1000);
    
    // Save privacy settings
    await page.click('text=Save Privacy Settings');
    await page.waitForTimeout(1000);
    
    // Navigate away and back
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(1000);
    await page.click('button[aria-label="Settings"]');
    await page.waitForTimeout(1000);
    
    // Verify both settings persisted
    const finalLocationState = await locationToggle.isChecked();
    const finalDataSharingState = await dataSharingToggle.isChecked();
    
    expect(finalLocationState).toBe(!initialLocationState);
    expect(finalDataSharingState).toBe(!initialDataSharingState);
    
    console.log('✅ Multiple settings persisted correctly');
  });
}); 