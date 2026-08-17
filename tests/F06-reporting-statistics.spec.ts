import { test, expect } from '@playwright/test';

test.describe('F-06: Reporting Statistics (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
    
    // Navigate to revenue report
    await page.goto('/admin/reports/revenue');
  });

  test('View revenue report layout and default tab', async ({ page }) => {
    await expect(page.locator('h1:has-text("Báo cáo tài chính tổng hợp")')).toBeVisible();
    
    // Check default tab "Hiệu quả kinh doanh" (P&L) is active and visible
    await expect(page.locator('button:has-text("Hiệu quả kinh doanh")')).toBeVisible();
    await expect(page.locator('button:has-text("Lưu lượng dòng tiền")')).toBeVisible();
    
    // Wait for the data to load, spinning loader should disappear
    await expect(page.locator('.animate-spin')).toBeHidden({ timeout: 10000 });
    
    // Check if KPIs are visible
    // Depending on data, it either shows "Không có dữ liệu." or KPI tiles.
    const emptyText = page.locator('text=/Không có dữ liệu/i');
    const kpiTile = page.locator('text=Tổng giá trị hợp đồng').first();
    
    await Promise.race([
      expect(emptyText).toBeVisible({ timeout: 10000 }),
      expect(kpiTile).toBeVisible({ timeout: 10000 })
    ]);
  });

  test('Switch to cash flow tab', async ({ page }) => {
    // Wait for load
    await expect(page.locator('.animate-spin')).toBeHidden({ timeout: 10000 });
    
    // Click cash flow tab
    await page.locator('button:has-text("Lưu lượng dòng tiền")').click();
    
    // Check if we have data or empty state
    const emptyText = page.locator('text=/Không có dữ liệu/i');
    const hasData = await page.locator('text=Dòng tiền vào').first().isVisible();
    
    if (hasData) {
      // Verify cash flow KPIs appear
      await expect(page.locator('text=Dòng tiền vào').first()).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Dòng tiền ra').first()).toBeVisible();
      await expect(page.locator('text=Dòng tiền thuần').first()).toBeVisible();
    }
  });

  test('Change date range', async ({ page }) => {
    // Fill the "Từ ngày" input
    const dateInputs = page.locator('input[type="date"]');
    
    await dateInputs.first().fill('2023-01-01');
    
    // Should trigger loading state or update
    await expect(page.locator('.animate-spin')).toBeHidden({ timeout: 10000 });
  });
});
