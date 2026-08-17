import { test, expect } from '@playwright/test';

test.describe('F-05: Policy Configuration (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
    
    // Navigate to policies
    await page.goto('/admin/policies');
  });

  test('View list of policies and verify layout', async ({ page }) => {
    await expect(page.locator('h1:has-text("Chính sách nghiệp vụ")')).toBeVisible();
    await expect(page.locator('table >> text=Mã chính sách').first()).toBeVisible();
    await expect(page.locator('table >> text=Tên chính sách').first()).toBeVisible();
    await expect(page.locator('table >> text=Loại').first()).toBeVisible();
    await expect(page.locator('table >> text=Giá trị').first()).toBeVisible();
    await expect(page.locator('table >> text=Trạng thái').first()).toBeVisible();
  });

  test('Search policy by name or code', async ({ page }) => {
    await page.fill('input[placeholder="Tìm theo mã hoặc tên chính sách..."]', 'DEPOSIT');
    await page.waitForTimeout(1000); // debounce
    // Wait for the table to refresh
    await expect(page.locator('table').first()).toBeVisible();
  });

  test('Filter policy by type', async ({ page }) => {
    const selects = page.locator('select');
    // Select the first one which is Type filter
    await selects.first().selectOption({ label: 'Đặt cọc' });
    await page.waitForTimeout(1000);
    
    // Assuming there is at least one row or empty text
    await expect(page.locator('table').or(page.locator('text=Không tìm thấy')).first()).toBeVisible();
  });

  test('Open create policy modal', async ({ page }) => {
    await page.locator('button:has-text("Tạo chính sách")').click();
    await expect(page.locator('text=Tạo chính sách mới').first()).toBeVisible({ timeout: 5000 });
  });
});
