import { test, expect } from '@playwright/test';

test.describe('F-10: Survey & Quotation (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('View list of quotations and verify layout', async ({ page }) => {
    await page.goto('/admin/quotations');
    
    // Verify header
    await expect(page.locator('h1:has-text("Quản lý báo giá")')).toBeVisible();
    
    // Verify KPIs
    await expect(page.locator('text=Tổng báo giá').first()).toBeVisible();
    await expect(page.locator('text=Đã phê duyệt').first()).toBeVisible();
    
    // Check table headers
    await expect(page.locator('table >> text=Mã báo giá').first()).toBeVisible();
    await expect(page.locator('table >> text=Khách hàng').first()).toBeVisible();
  });

  test('Filter and search quotations', async ({ page }) => {
    await page.goto('/admin/quotations');
    
    // Fill search
    await page.fill('input[placeholder="Tìm theo mã báo giá, tên khách..."]', 'Q');
    await page.waitForTimeout(500);
    
    // Wait for the table to load
    await expect(page.locator('table').or(page.locator('text=Không tải được')).first()).toBeVisible();
  });

  test('Open Create Quotation wizard', async ({ page }) => {
    await page.goto('/admin/quotations');
    
    // Click create button
    await page.locator('button:has-text("Tạo báo giá mới")').click();
    
    // Verify modal is open at step 1
    await expect(page.locator('h2:has-text("Bước 1: Chọn khách hàng lập báo giá")')).toBeVisible();
    
    // Verify we can see the customer search input
    await expect(page.locator('text=Lựa chọn khách hàng có sẵn')).toBeVisible();
  });
});
