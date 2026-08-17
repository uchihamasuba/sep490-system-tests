import { test, expect } from '@playwright/test';

test.describe('F-04: Equipment Inventory (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('View list of categories and create new', async ({ page }) => {
    await page.goto('/admin/catalog/categories');
    
    // Verify layout
    await expect(page.locator('h1:has-text("Danh mục lớn")')).toBeVisible();
    await expect(page.locator('table >> text=Tên danh mục').first()).toBeVisible();
    
    // Create new
    await page.locator('button:has-text("Thêm danh mục")').click();
    await expect(page.locator('text=Tạo danh mục thiết bị').first()).toBeVisible();
    
    const timestamp = Date.now();
    const catName = `Category ${timestamp}`;
    
    await page.fill('input[placeholder="VD: Trang thiết bị âm thanh"]', catName);
    await page.fill('textarea[placeholder="Mô tả ngắn về danh mục này..."]', 'Test description');
    
    await page.locator('button:has-text("Tạo danh mục")').click();
    
    // Check if new category is in the table
    await expect(page.locator(`table >> text=${catName}`).first()).toBeVisible({ timeout: 5000 });
  });

  test('View list of equipment and verify layout', async ({ page }) => {
    await page.goto('/admin/catalog');
    
    await expect(page.locator('h1:has-text("Danh sách thiết bị")')).toBeVisible();
    await expect(page.locator('table >> text=Tên thiết bị').first()).toBeVisible();
    await expect(page.locator('table >> text=Loại hàng').first()).toBeVisible();
  });

  test('Filter and search equipment', async ({ page }) => {
    await page.goto('/admin/catalog');
    
    // Fill search
    await page.fill('input[placeholder="Tìm theo mã hoặc tên thiết bị..."]', 'Loa');
    await page.locator('button:has-text("Áp dụng")').click();
    
    // Wait for filter
    await page.waitForTimeout(1000);
    
    // Table should contain something or empty state
    await expect(page.locator('table').or(page.locator('text=Không tìm thấy')).first()).toBeVisible();
  });

});
