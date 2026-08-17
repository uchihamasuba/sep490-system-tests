import { test, expect } from '@playwright/test';

// Preserved setup pattern from old tests
// test.beforeEach(async ({ page }) => {
//   await page.goto('/auth/login');
//   await page.fill('input[placeholder="Tên đăng nhập"]', 'admin');
//   await page.fill('input[placeholder="Mật khẩu"]', '123456');
//   await page.locator('button[type="submit"]').click();
// });

test.describe('F-13: Scheduling Assignment (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('View schedule planning and verify layout', async ({ page }) => {
    await page.goto('/admin/coordination/planning');
    
    // Verify layout
    await expect(page.locator('h1:has-text("Lịch điều phối")')).toBeVisible();
    
    // Wait for the loader to disappear
    await expect(page.locator('text=Đang tải kế hoạch điều phối...')).toBeHidden({ timeout: 15000 });
    
    // Verify timeline chart is visible
    // We look for timeline header
    await expect(page.locator('text=Hôm nay').first()).toBeVisible();
  });
});
