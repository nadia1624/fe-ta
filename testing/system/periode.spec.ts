import { test, expect } from '@playwright/test';

/**
 * System Testing (E2E) using Playwright.
 * This test requires both the Back-End and Front-End to be running.
 */
test('Periode Management E2E Flow', async ({ page }) => {
  // Go to login page
  await page.goto('http://localhost:5173/login');

  // Perform Login
  await page.fill('input[type="email"]', 'admin@gmail.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL('**/admin/dashboard');

  // Navigate to Periode Management via sidebar
  // (Assuming there is a sidebar link with this text)
  await page.click('text=Periode Management');
  await expect(page).toHaveURL(/.*periode/);

  // Click "Tambah Periode" button
  await page.click('button:has-text("Tambah Periode")');

  // Fill the form
  const uniqueName = `E2E Test ${Date.now()}`;
  await page.fill('input[name="periode"]', uniqueName);
  await page.fill('input[name="tanggal_mulai"]', '2026-01-01');
  await page.fill('input[name="tanggal_selesai"]', '2026-12-31');
  await page.fill('textarea[name="keterangan"]', 'Created by Playwright E2E Test');

  // Submit the form
  await page.click('[data-testid="modal-container"] button:has-text("Tambah")');

  // Verify success toast or new entry in table
  await expect(page.locator(`text=${uniqueName}`)).toBeVisible();
});
