import { test, expect } from '@playwright/test';

test.describe('F-07: Task Attendance & Work Schedule (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('View master schedule and its tabs', async ({ page }) => {
    await page.goto('/admin/schedule');
    
    // Verify layout
    await expect(page.locator('h1:has-text("Lịch tổng thể")')).toBeVisible();
    
    // Wait for the loader to finish
    await expect(page.locator('text=Đang tải dữ liệu lịch')).toBeHidden({ timeout: 10000 });
    
    // Check KPIs are rendered
    await expect(page.locator('text=Sự kiện trong 7 ngày tới').first()).toBeVisible();
    await expect(page.locator('text=Đơn đang thực hiện').first()).toBeVisible();
    
    // Check default view is Event Calendar
    await expect(page.locator('text=Lọc trạng thái:').first()).toBeVisible();
    
    // Switch to 'Timeline đơn'
    await page.locator('button:has-text("Timeline đơn")').click();
    await expect(page.locator('text=Timeline đơn').first()).toBeVisible();
    
    // Switch to 'Lịch nhân sự'
    await page.locator('button:has-text("Lịch nhân sự")').click();
    await expect(page.locator('text=Lịch nhân sự —').first()).toBeVisible();
    
    // Switch to 'Tải nhân sự'
    await page.locator('button:has-text("Tải nhân sự")').click();
    await expect(page.locator('text=Tải nhân sự theo tuần').first()).toBeVisible();
  });
});
