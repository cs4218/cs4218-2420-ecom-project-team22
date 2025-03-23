const { test, expect } = require('@playwright/test');

test.describe('User Dashboard Tests', () => {
  // Mock user data
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    address: '123 Test St',
    phone: '1234567890',
    role: 0
  };

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    
    // Wait for the login form to be ready
    await page.waitForSelector('form');
    
    // Fill in login form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    
    // Click login and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('button', { name: 'Login' }).click()
    ]);
    
    // Navigate to dashboard and wait for it to load
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.goto('http://localhost:3000/dashboard/user')
    ]);
    
    // Wait for dashboard content to be visible
    await page.waitForSelector('.dashboard');
  });

  test('UserMenu navigation and structure', async ({ page }) => {
    // Wait for UserMenu to be visible
    await page.waitForSelector('.list-group');
    
    // Test UserMenu presence
    await expect(page.getByText('Dashboard')).toBeVisible();
    
    // Test navigation links
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();

    // Test link classes
    const profileLink = page.getByRole('link', { name: 'Profile' });
    const ordersLink = page.getByRole('link', { name: 'Orders' });
    
    await expect(profileLink).toHaveClass(/list-group-item/);
    await expect(ordersLink).toHaveClass(/list-group-item/);
  });

  test('UserMenu navigation functionality', async ({ page }) => {
    // Test Profile link
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('link', { name: 'Profile' }).click()
    ]);
    await expect(page).toHaveURL(/.*\/dashboard\/user\/profile/);

    // Go back to dashboard
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.goto('http://localhost:3000/dashboard/user')
    ]);

    // Test Orders link
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('link', { name: 'Orders' }).click()
    ]);
    await expect(page).toHaveURL(/.*\/dashboard\/user\/orders/);
  });

  test('Dashboard user information display', async ({ page }) => {
    // Wait for user card to be visible
    await page.waitForSelector('.card');
    
    // Test user information presence
    await expect(page.getByText(mockUser.name)).toBeVisible();
    await expect(page.getByText(mockUser.email)).toBeVisible();
    await expect(page.getByText(mockUser.address)).toBeVisible();

    // Test card styling
    const userCard = page.getByText(mockUser.name).locator('..');
    await expect(userCard).toHaveClass(/card/);
    await expect(userCard).toHaveClass(/w-75/);
  });

  test('Dashboard layout structure', async ({ page }) => {
    // Wait for container to be visible
    await page.waitForSelector('.container-flui');
    
    // Test container classes
    const container = page.getByText(mockUser.name).locator('..').locator('..').locator('..');
    await expect(container).toHaveClass(/container-flui/);
    await expect(container).toHaveClass(/dashboard/);

    // Test row and column structure
    const row = container.locator('.row');
    await expect(row).toBeVisible();
    
    const columns = row.locator('.col-md-3, .col-md-9');
    await expect(columns).toHaveCount(2);
  });

  test('Protected route behavior', async ({ page }) => {
    // Wait for user menu to be visible
    await page.waitForSelector('.list-group');
    
    // Logout
    await page.getByRole('link', { name: mockUser.name }).click();
    await page.getByRole('link', { name: 'Logout' }).click();

    // Try to access dashboard directly
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.goto('http://localhost:3000/dashboard/user')
    ]);

    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('UserMenu active state', async ({ page }) => {
    // Wait for UserMenu to be visible
    await page.waitForSelector('.list-group');
    
    // Navigate to profile page
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('link', { name: 'Profile' }).click()
    ]);

    // Check active state of Profile link
    const profileLink = page.getByRole('link', { name: 'Profile' });
    await expect(profileLink).toHaveClass(/active/);

    // Navigate to orders page
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('link', { name: 'Orders' }).click()
    ]);

    // Check active state of Orders link
    const ordersLink = page.getByRole('link', { name: 'Orders' });
    await expect(ordersLink).toHaveClass(/active/);
  });

  test('Dashboard responsive behavior', async ({ page }) => {
    // Wait for dashboard content to be visible
    await page.waitForSelector('.dashboard');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if UserMenu is still visible
    await expect(page.getByText('Dashboard')).toBeVisible();
    
    // Check if user information is still visible
    await expect(page.getByText(mockUser.name)).toBeVisible();
    await expect(page.getByText(mockUser.email)).toBeVisible();
    await expect(page.getByText(mockUser.address)).toBeVisible();
  });

  test('UserMenu accessibility', async ({ page }) => {
    // Wait for UserMenu to be visible
    await page.waitForSelector('.list-group');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Profile' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Orders' })).toBeFocused();

    // Test ARIA attributes
    const profileLink = page.getByRole('link', { name: 'Profile' });
    await expect(profileLink).toHaveAttribute('aria-current', 'page');
  });
}); 