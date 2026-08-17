import { test, expect } from '@playwright/test';

test.describe('F-02: Notifications & Approaching Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'manager');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/manager/);
  });

  test('User can view approaching events in notification bell', async ({ page }) => {
    await page.locator('button[aria-label="Thông báo"]').click();
    await expect(page.locator('text=/Mốc sắp diễn ra/i').first()).toBeVisible();
    
    // There can either be events or an empty state. We wait for one of them to ensure it loaded.
    const emptyText = page.locator('text=/Không có mốc thời gian nào/i');
    const hasEvents = page.locator('text=/Còn .* ngày/i').first();
    
    await Promise.race([
      expect(emptyText).toBeVisible({ timeout: 10000 }),
      expect(hasEvents).toBeVisible({ timeout: 10000 })
    ]);
  });
  
  test('User can dismiss notification dropdown by clicking outside', async ({ page }) => {
    await page.locator('button[aria-label="Thông báo"]').click();
    await expect(page.locator('text=/Mốc sắp diễn ra/i').first()).toBeVisible();
    
    // Click outside to close
    await page.mouse.click(0, 0);
    await expect(page.locator('text=/Mốc sắp diễn ra/i').first()).toBeHidden();
  });
});
