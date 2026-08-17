import { test, expect } from '@playwright/test';

test.describe('NFR-03: Security & RBAC (Web)', () => {
  test('Verify manager cannot access admin settings', async ({ page }) => {
    await page.goto('/auth/login');
    // Login as manager
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'manager');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/manager/);
    
    // Check that "Cài đặt hệ thống" or similar admin-only menu is not visible or accessing it redirects
    // Actually we can just check if we can navigate to a known admin route, e.g. /admin/users (System Users)
    await page.goto('/admin/users');
    
    // Depending on implementation, it might redirect to /admin or show a 403 page
    // Let's assert that we are either redirected or we see an error message instead of the user list
    const hasAccess = await page.locator('h1:has-text("Danh sách tài khoản")').isVisible({ timeout: 2000 }).catch(() => false);
    
    // RBAC: Manager should NOT see the user management page
    expect(hasAccess).toBeFalsy();
  });
});
