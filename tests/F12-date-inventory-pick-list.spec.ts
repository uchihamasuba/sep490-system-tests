import { test, expect } from '@playwright/test';

test.describe('F-12: Date Inventory Pick List (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('View date inventory and verify layout', async ({ page }) => {
    await page.goto('/admin/inventory/availability');
    
    // Verify layout
    await expect(page.locator('h1:has-text("Thiết bị đang bị giữ theo đơn")')).toBeVisible();
    await expect(page.locator('input[placeholder="Tìm theo mã đơn, khách hàng, tên thiết bị..."]')).toBeVisible();
    
    // Wait for the loader to disappear
    await expect(page.locator('text=Đang tải danh sách thiết bị...')).toBeHidden({ timeout: 15000 });
  });

  test('Search inventory availability', async ({ page }) => {
    await page.goto('/admin/inventory/availability');
    
    // Fill search
    await page.fill('input[placeholder="Tìm theo mã đơn, khách hàng, tên thiết bị..."]', 'Test');
    await page.waitForTimeout(500);
    
    // Wait for the table to load or empty state
    await expect(page.locator('table').or(page.locator('text=Hiện không có thiết bị nào')).first()).toBeVisible();
  });
  
  test('Filter by shortage only', async ({ page }) => {
    await page.goto('/admin/inventory/availability');
    
    // Wait for the loader to disappear
    await expect(page.locator('text=Đang tải danh sách thiết bị...')).toBeHidden({ timeout: 15000 });
    
    // Click only shortage button
    await page.locator('button:has-text("Chỉ hiện đơn thiếu hàng")').click();
    
    // Should display table or empty state
    await expect(page.locator('table').or(page.locator('text=Hiện không có thiết bị nào')).first()).toBeVisible();
  });
});
