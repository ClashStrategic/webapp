import { test, expect } from '@playwright/test';

test.describe('Clash Strategic - Basic E2E Test', () => {
  test('should load the main page and display the logo', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');

    // Verify that the page title is correct
    await expect(page).toHaveTitle(/Crea, Analiza y Comparte: ¡Únete a la Comunidad de Clash Strategic!/);

    // Verify that the logo is present
    const logo = page.locator('#img_logo_index');
    await expect(logo).toBeVisible();

    // Verify that the logo has the correct alt attribute
    await expect(logo).toHaveAttribute('alt', 'Clash Strategic');

    // Verify that the loading bar is present
    const loadingBar = page.locator('#div_lin_loading');
    await expect(loadingBar).toBeVisible();

    // Wait for loading to complete and redirect to home
    // (this may take a few seconds depending on the service worker)
    await page.waitForURL('**/home', { timeout: 10000 });

    // Verify that we are on the home page
    await expect(page).toHaveTitle('Clash Strategic');

    // Verify that the main content is present in the DOM
    const mainContent = page.locator('#capa_contenido');
    await expect(mainContent).toBeAttached();
  });
});
