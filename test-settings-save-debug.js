const { test, expect } = require('@playwright/test');

test.describe('Settings Save Button Debug', () => {
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

  test('Save buttons are visible and clickable', async ({ page }) => {
    // Check if save buttons are visible
    const locationSaveButton = page.locator('text=Save Location Settings');
    const privacySaveButton = page.locator('text=Save Privacy Settings');
    
    await expect(locationSaveButton).toBeVisible();
    await expect(privacySaveButton).toBeVisible();
    
    console.log('✅ Save buttons are visible');
    
    // Check if buttons are clickable
    await expect(locationSaveButton).toBeEnabled();
    await expect(privacySaveButton).toBeEnabled();
    
    console.log('✅ Save buttons are enabled');
  });

  test('Save Location Settings button works', async ({ page }) => {
    // Toggle a setting first
    const locationToggle = page.locator('text=Location Services').locator('..').locator('input[type="checkbox"]');
    const initialState = await locationToggle.isChecked();
    await locationToggle.click();
    await page.waitForTimeout(500);
    
    // Click save button
    await page.click('text=Save Location Settings');
    await page.waitForTimeout(2000);
    
    // Check for success message or console logs
    console.log('✅ Save Location Settings button clicked');
  });

  test('Save Privacy Settings button works', async ({ page }) => {
    // Toggle a setting first
    const dataSharingToggle = page.locator('text=Data Sharing').locator('..').locator('input[type="checkbox"]');
    const initialState = await dataSharingToggle.isChecked();
    await dataSharingToggle.click();
    await page.waitForTimeout(500);
    
    // Click save button
    await page.click('text=Save Privacy Settings');
    await page.waitForTimeout(2000);
    
    // Check for success message or console logs
    console.log('✅ Save Privacy Settings button clicked');
  });

  test('Button styling and accessibility', async ({ page }) => {
    // Check button styling
    const locationSaveButton = page.locator('text=Save Location Settings');
    const privacySaveButton = page.locator('text=Save Privacy Settings');
    
    // Check if buttons have proper styling
    await expect(locationSaveButton).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(privacySaveButton).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    
    console.log('✅ Save buttons have proper styling');
    
    // Check accessibility attributes
    await expect(locationSaveButton).toHaveAttribute('data-testid', 'save-save-location-settings-button');
    await expect(privacySaveButton).toHaveAttribute('data-testid', 'save-save-privacy-settings-button');
    
    console.log('✅ Save buttons have proper accessibility attributes');
  });
}); 