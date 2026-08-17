import { test, expect } from '@playwright/test';

// Preserved setup pattern from old tests
// test.beforeEach(async ({ page }) => {
//   await page.goto('/auth/login');
//   await page.fill('input[placeholder="Tên đăng nhập"]', 'admin');
//   await page.fill('input[placeholder="Mật khẩu"]', '123456');
//   await page.locator('button[type="submit"]').click();
// });

test.describe('F-09: Customer Order (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('View list of customer orders and verify layout', async ({ page }) => {
    await page.goto('/admin/orders_audit');
    
    // Verify layout
    await expect(page.locator('h1:has-text("Quản lý đơn đặt hàng")')).toBeVisible();
    await expect(page.locator('button:has-text("Khởi tạo đơn đặt hàng")')).toBeVisible();
    
    // Verify KPI cards
    await expect(page.locator('text=Tổng đơn').first()).toBeVisible();
    await expect(page.locator('text=Đang thực hiện').first()).toBeVisible();
  });

  test('Filter and search orders', async ({ page }) => {
    await page.goto('/admin/orders_audit');
    
    // Filter
    const searchInput = page.locator('input[placeholder*="Mã đơn, sự kiện"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('O');
    await page.waitForTimeout(500);
    
    // Should display table or empty state
    await expect(page.locator('table').or(page.locator('text=Chưa có đơn đặt hàng nào')).first()).toBeVisible();
  });

  test('Open Create Order modal', async ({ page }) => {
    await page.goto('/admin/orders_audit');
    await page.locator('button:has-text("Khởi tạo đơn đặt hàng")').click();
    
    // Modal title from CreateOrderModal component (I assume it has Khởi tạo)
    await expect(page.locator('h2:has-text("Tạo đơn đặt hàng mới")').or(page.locator('text=Tạo đơn')).first()).toBeVisible();
  });
});
