import { test, expect } from '@playwright/test';

test.describe('NFR-04: Reliability & Accuracy (Web)', () => {
  test('Verify system handles invalid inputs gracefully', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Submit with empty inputs
    await page.locator('button[type="submit"]').click();
    
    // Check if validation message or error toast appears instead of crashing
    // The actual text might vary, but there should be a required field warning
    // This is just a reliability check that it doesn't navigate or throw a 500 error
    await expect(page).toHaveURL(/\/auth\/login/); // Should still be on login page
    
    // Try wrong credentials
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', 'wrongpass');
    await page.locator('button[type="submit"]').click();
    
    // Expect error message to be visible
    const toastOrAlert = page.locator('text=/tài khoản|mật khẩu|sai|không đúng|invalid|error/i');
    await expect(toastOrAlert.first()).toBeVisible({ timeout: 5000 });
  });
});
