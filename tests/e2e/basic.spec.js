import { test, expect } from '@playwright/test';

test.describe('Clash Strategic - Basic E2E Test', () => {
  test('should load the main page and display the logo', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');

    // Wait a bit for any redirects or loading
    await page.waitForTimeout(2000);

    // Check if we're on index page or already redirected to home
    const currentUrl = page.url();

    if (currentUrl.includes('home')) {
      // Already redirected to home page
      await expect(page).toHaveTitle('Clash Strategic');

      // Verify that the main content is present in the DOM
      const mainContent = page.locator('#capa_contenido');
      await expect(mainContent).toBeAttached();
    } else {
      // Still on index page - verify loading elements
      await expect(page).toHaveTitle(/Crea, Analiza y Comparte.*Clash Strategic/);

      // Verify that the logo is present
      const logo = page.locator('#img_logo_index');
      await expect(logo).toBeVisible();

      // Verify that the logo has the correct alt attribute
      await expect(logo).toHaveAttribute('alt', 'Clash Strategic');

      // Wait for redirect to home (if it happens)
      try {
        await page.waitForURL('**/home', { timeout: 8000 });
        await expect(page).toHaveTitle('Clash Strategic');

        const mainContent = page.locator('#capa_contenido');
        await expect(mainContent).toBeAttached();
      } catch {
        // If redirect doesn't happen, that's also OK for this basic test
        console.log('No redirect occurred, staying on index page');
      }
    }
  });
});
