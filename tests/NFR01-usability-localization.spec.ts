import { test, expect } from '@playwright/test';

test.describe('NFR-01: Usability & Localization (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('Verify Vietnamese localization is consistent across main modules', async ({ page }) => {
    await page.goto('/admin/catalog');
    
    // Check main navigation items are in Vietnamese
    await expect(page.locator('text=Danh sách người dùng').first()).toBeVisible();
    await expect(page.locator('text=Danh mục & Thiết bị').first()).toBeVisible();
    await expect(page.locator('text=Nhà cung cấp').first()).toBeVisible();
  });
});
