import { test, expect } from '@playwright/test';

test.describe('F-03: User Management (Web)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[placeholder="Tên đăng nhập"], input[name="username"]', 'admin');
    await page.fill('input[placeholder="Mật khẩu"], input[name="password"]', '123456');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin/);
    
    // Navigate to User Management
    await page.goto('/admin/settings/users');
  });

  test('View list of users and verify layout', async ({ page }) => {
    await expect(page.locator('h1:has-text("Tài khoản người dùng")')).toBeVisible();
    await expect(page.locator('text=Tên đăng nhập').first()).toBeVisible();
    await expect(page.locator('text=Họ và tên').first()).toBeVisible();
    await expect(page.locator('text=Vai trò').first()).toBeVisible();
    await expect(page.locator('text=Trạng thái').first()).toBeVisible();
  });

  test('Filter users by role', async ({ page }) => {
    await page.locator('button:has-text("Quản trị viên")').click();
    // In the User table, the Role column uses a badge.
    // Wait for the table to refresh
    await page.waitForTimeout(1000);
    await expect(page.locator('table >> text=Quản trị viên').first()).toBeVisible({ timeout: 5000 });
  });

  test('Search user by username', async ({ page }) => {
    await page.fill('input[placeholder="Tìm theo tên đăng nhập, tên..."]', 'manager');
    await page.waitForTimeout(1000);
    await expect(page.locator('table >> text=manager').first()).toBeVisible({ timeout: 5000 });
    // Assuming 'admin' should be filtered out
    await expect(page.locator('table >> text=admin').first()).toBeHidden({ timeout: 5000 });
  });

  test('Create a new user successfully', async ({ page }) => {
    await page.locator('button:has-text("Thêm tài khoản")').click();
    
    await expect(page.locator('text=Tạo người dùng mới')).toBeVisible();
    
    const timestamp = Date.now();
    const newUsername = `staff${timestamp}`;
    const newPhone = `09${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    await page.locator('div:has(> label:has-text("Họ và tên")) >> input').fill('New Staff Member');
    await page.locator('div:has(> label:has-text("Tên đăng nhập")) >> input').fill(newUsername);
    await page.locator('div:has(> label:has-text("Vai trò")) >> select').selectOption('STAFF');
    await page.locator('div:has(> label:has-text("Số điện thoại")) >> input').fill(newPhone);
    await page.locator('div:has(> label:has-text("Email")) >> input').fill(`staff${timestamp}@example.com`);
    await page.locator('input[type="password"]').first().fill('StaffPass123!');
    await page.locator('input[type="password"]').nth(1).fill('StaffPass123!');
    
    await page.locator('button:has-text("Tạo người dùng")').click();
    
    // Wait for modal to close and new user to appear in table
    try {
      await expect(page.locator('text=Tạo người dùng mới')).toBeHidden({ timeout: 5000 });
    } catch (e) {
      const errorMsg = await page.locator('.text-red-600').allTextContents();
      console.log("Error messages on screen:", errorMsg);
      throw e;
    }
    await expect(page.locator(`table >> text=${newUsername}`).first()).toBeVisible({ timeout: 5000 });
  });

  test('Edit an existing user', async ({ page }) => {
    // Search for the admin user first so we know which one we are editing
    await page.fill('input[placeholder="Tìm theo tên đăng nhập, tên..."]', 'manager');
    await page.waitForTimeout(1000);
    
    // Click the edit button
    await page.locator('button[title="Sửa tài khoản"]').first().click();
    
    // Modal opens
    await expect(page.locator('text=Chỉnh sửa người dùng')).toBeVisible({ timeout: 5000 });
    
    // Read the current name and just append a dot to test edit
    const nameInput = page.locator('div:has(> label:has-text("Họ và tên")) >> input');
    const oldName = await nameInput.inputValue();
    const newName = oldName.includes(' Edited') ? oldName.replace(' Edited', '') : `${oldName} Edited`;
    
    await nameInput.fill(newName);
    await page.locator('button:has-text("Lưu thay đổi")').click();
    
    // Wait for modal to close
    await expect(page.locator('text=Chỉnh sửa người dùng')).toBeHidden({ timeout: 5000 });
    await expect(page.locator(`table >> text=${newName}`).first()).toBeVisible({ timeout: 5000 });
  });

  test('Create user fails with duplicate username', async ({ page }) => {
    await page.locator('button:has-text("Thêm tài khoản")').click();
    await page.locator('div:has(> label:has-text("Họ và tên")) >> input').fill('Duplicate Admin');
    await page.locator('div:has(> label:has-text("Tên đăng nhập")) >> input').fill('admin'); // Already exists
    await page.locator('div:has(> label:has-text("Email")) >> input').fill('dupadmin@example.com');
    await page.locator('input[type="password"]').first().fill('StaffPass123!');
    await page.locator('input[type="password"]').nth(1).fill('StaffPass123!');
    await page.locator('button:has-text("Tạo người dùng")').click();
    
    // Error message appears
    await expect(page.locator('text=/tồn tại|sử dụng|thất bại|trùng/i').first()).toBeVisible({ timeout: 5000 });
  });
});
