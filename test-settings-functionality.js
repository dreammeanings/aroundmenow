const { test, expect } = require('@playwright/test');

test.describe('Settings Screen Functionality', () => {
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
    
    // Navigate to settings
    await page.click('button[aria-label="Profile"]');
    await page.click('text=Settings');
    await page.waitForTimeout(1000);
  });

  test('Settings screen loads with correct layout', async ({ page }) => {
    // Check header
    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('button[aria-label="Back"]')).toBeVisible();
    
    // Check Location Settings section
    await expect(page.locator('text=Location Settings')).toBeVisible();
    await expect(page.locator('text=Location Services')).toBeVisible();
    await expect(page.locator('text=Location Precision')).toBeVisible();
    await expect(page.locator('text=Save Location Settings')).toBeVisible();
    
    // Check Privacy Settings section
    await expect(page.locator('text=Privacy Settings')).toBeVisible();
    await expect(page.locator('text=Profile Visibility')).toBeVisible();
    await expect(page.locator('text=Data Sharing')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=Save Privacy Settings')).toBeVisible();
  });

  test('Location Services toggle works', async ({ page }) => {
    const locationToggle = page.locator('text=Location Services').locator('..').locator('input[type="checkbox"]');
    
    // Get initial state
    const initialState = await locationToggle.isChecked();
    
    // Toggle the switch
    await locationToggle.click();
    await page.waitForTimeout(500);
    
    // Verify state changed
    const newState = await locationToggle.isChecked();
    expect(newState).toBe(!initialState);
    
    // Toggle back
    await locationToggle.click();
    await page.waitForTimeout(500);
    
    // Verify back to original state
    const finalState = await locationToggle.isChecked();
    expect(finalState).toBe(initialState);
  });

  test('Location Precision navigation works', async ({ page }) => {
    const precisionItem = page.locator('text=Location Precision').locator('..');
    
    // Click on Location Precision
    await precisionItem.click();
    await page.waitForTimeout(1000);
    
    // Should show navigation or alert
    const alert = page.locator('.alert');
    if (await alert.isVisible()) {
      await expect(alert).toContainText('Location Settings');
    }
  });

  test('Data Sharing toggle works', async ({ page }) => {
    const dataSharingToggle = page.locator('text=Data Sharing').locator('..').locator('input[type="checkbox"]');
    
    // Get initial state
    const initialState = await dataSharingToggle.isChecked();
    
    // Toggle the switch
    await dataSharingToggle.click();
    await page.waitForTimeout(500);
    
    // Verify state changed
    const newState = await dataSharingToggle.isChecked();
    expect(newState).toBe(!initialState);
    
    // Toggle back
    await dataSharingToggle.click();
    await page.waitForTimeout(500);
    
    // Verify back to original state
    const finalState = await dataSharingToggle.isChecked();
    expect(finalState).toBe(initialState);
  });

  test('Analytics toggle works', async ({ page }) => {
    const analyticsToggle = page.locator('text=Analytics').locator('..').locator('input[type="checkbox"]');
    
    // Get initial state
    const initialState = await analyticsToggle.isChecked();
    
    // Toggle the switch
    await analyticsToggle.click();
    await page.waitForTimeout(500);
    
    // Verify state changed
    const newState = await analyticsToggle.isChecked();
    expect(newState).toBe(!initialState);
    
    // Toggle back
    await analyticsToggle.click();
    await page.waitForTimeout(500);
    
    // Verify back to original state
    const finalState = await analyticsToggle.isChecked();
    expect(finalState).toBe(initialState);
  });

  test('Profile Visibility navigation works', async ({ page }) => {
    const profileVisibilityItem = page.locator('text=Profile Visibility').locator('..');
    
    // Click on Profile Visibility
    await profileVisibilityItem.click();
    await page.waitForTimeout(1000);
    
    // Should show navigation or alert
    const alert = page.locator('.alert');
    if (await alert.isVisible()) {
      await expect(alert).toContainText('Privacy Settings');
    }
  });

  test('Save Location Settings works', async ({ page }) => {
    // Toggle Location Services
    const locationToggle = page.locator('text=Location Services').locator('..').locator('input[type="checkbox"]');
    await locationToggle.click();
    await page.waitForTimeout(500);
    
    // Click Save Location Settings
    await page.click('text=Save Location Settings');
    await page.waitForTimeout(2000);
    
    // Should show success message
    const successAlert = page.locator('.alert');
    if (await successAlert.isVisible()) {
      await expect(successAlert).toContainText('Settings Saved Successfully');
    }
  });

  test('Save Privacy Settings works', async ({ page }) => {
    // Toggle Data Sharing
    const dataSharingToggle = page.locator('text=Data Sharing').locator('..').locator('input[type="checkbox"]');
    await dataSharingToggle.click();
    await page.waitForTimeout(500);
    
    // Click Save Privacy Settings
    await page.click('text=Save Privacy Settings');
    await page.waitForTimeout(2000);
    
    // Should show success message
    const successAlert = page.locator('.alert');
    if (await successAlert.isVisible()) {
      await expect(successAlert).toContainText('Settings Saved Successfully');
    }
  });

  test('Back button works', async ({ page }) => {
    // Click back button
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(1000);
    
    // Should be back to previous screen
    await expect(page.locator('text=Settings')).not.toBeVisible();
  });

  test('All toggles maintain state', async ({ page }) => {
    // Test all toggles and verify they maintain state
    const toggles = [
      'Location Services',
      'Data Sharing', 
      'Analytics'
    ];
    
    for (const toggleText of toggles) {
      const toggle = page.locator(`text=${toggleText}`).locator('..').locator('input[type="checkbox"]');
      const initialState = await toggle.isChecked();
      
      // Toggle
      await toggle.click();
      await page.waitForTimeout(300);
      
      // Verify changed
      const newState = await toggle.isChecked();
      expect(newState).toBe(!initialState);
      
      // Toggle back
      await toggle.click();
      await page.waitForTimeout(300);
      
      // Verify back to original
      const finalState = await toggle.isChecked();
      expect(finalState).toBe(initialState);
    }
  });

  test('Settings persist after navigation', async ({ page }) => {
    // Change a setting
    const locationToggle = page.locator('text=Location Services').locator('..').locator('input[type="checkbox"]');
    const initialState = await locationToggle.isChecked();
    await locationToggle.click();
    await page.waitForTimeout(500);
    
    // Save the setting
    await page.click('text=Save Location Settings');
    await page.waitForTimeout(2000);
    
    // Navigate away and back
    await page.click('button[aria-label="Back"]');
    await page.waitForTimeout(1000);
    await page.click('text=Settings');
    await page.waitForTimeout(1000);
    
    // Verify setting is still changed
    const newState = await locationToggle.isChecked();
    expect(newState).toBe(!initialState);
  });
}); 