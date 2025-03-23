const { test, expect } = require('@playwright/test');

test.describe('UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('http://localhost:3000');
  });

  test('Header navigation and authentication flow', async ({ page }) => {
    // Test navigation links
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Categories' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();

    // Test search input
    await expect(page.getByPlaceholder('Search for a product')).toBeVisible();

    // Test categories dropdown
    await page.getByRole('link', { name: 'Categories' }).click();
    await expect(page.getByRole('link', { name: 'All Categories' })).toBeVisible();
  });

  test('Footer links and content', async ({ page }) => {
    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Test footer content
    await expect(page.getByText('All Rights Reserved')).toBeVisible();
    
    // Test footer links
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('About page content', async ({ page }) => {
    // Navigate to About page
    await page.goto('http://localhost:3000/about');

    // Test page title
    await expect(page).toHaveTitle(/About us/);

    // Test content structure
    await expect(page.getByRole('img', { name: 'contactus' })).toBeVisible();
    await expect(page.getByText('Add text')).toBeVisible();
  });

  test('404 Page Not Found', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('http://localhost:3000/non-existent-page');

    // Test 404 content
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Oops ! Page Not Found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go Back' })).toBeVisible();
  });

  test('Spinner component behavior', async ({ page }) => {
    // Navigate to a protected route without authentication
    await page.goto('http://localhost:3000/dashboard/user');

    // Test spinner content
    await expect(page.getByText('redirecting to you in')).toBeVisible();
    await expect(page.getByRole('status')).toBeVisible();

    // Wait for redirect
    await expect(page).toHaveURL(/.*login/);
  });

  test('Layout structure and responsiveness', async ({ page }) => {
    // Test header presence
    await expect(page.locator('nav.navbar')).toBeVisible();
    
    // Test main content area
    await expect(page.locator('main')).toBeVisible();
    
    // Test footer presence
    await expect(page.locator('.footer')).toBeVisible();

    // Test responsive behavior
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
    await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeVisible();
    
    // Test mobile menu
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('User Dashboard layout and content', async ({ page }) => {
    // Login first (you'll need to implement this)
    await page.goto('http://localhost:3000/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard/user');

    // Test dashboard layout
    await expect(page.getByTestId('user-menu')).toBeVisible();
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(page.getByText('123 Test St')).toBeVisible();
  });

  // General test
  test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'About' }).click();
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.getByRole('link', { name: 'Categories' }).click();
    await page.getByRole('link', { name: 'All Categories' }).click();
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByText('🛒 Virtual VaultSearchHomeCategoriesAll CategoriesRegisterLoginCart0').click();
    await page.getByText('All Rights Reserved © TestingCompAbout|Contact|Privacy Policy').click();
  });
}); 