import { test, expect } from '@playwright/test';

test.describe('F-08: Supplier Transaction (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('View supplier purchase orders', async ({ page }) => {
    await page.goto('/admin/suppliers/purchase-orders');
    
    // Verify layout
    await expect(page.locator('h1:has-text("Danh sách thuê/mua của đối tác")')).toBeVisible();
    await expect(page.locator('button:has-text("Tạo đơn thuê/mua mới")')).toBeVisible();
    
    // Open create modal
    await page.locator('button:has-text("Tạo đơn thuê/mua mới")').click();
    await expect(page.locator('text=Tạo đơn thuê/mua mới').nth(1)).toBeVisible();
    
    // We won't submit this complex form as it requires seed data (supplier items), just close it
    await page.locator('button:has-text("Hủy")').click();
  });
});
