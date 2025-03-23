const { test, expect } = require('@playwright/test');

const baseURL = 'http://localhost:3000';

test.describe('UI Tests', () => {
  
  // Helper function to navigate to a page
  const navigateToPage = async (page, url) => {
    await page.goto(`${baseURL}${url}`);
    await expect(page).toHaveURL(`${baseURL}${url}`);
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await navigateToPage(page, '/');
  });

  test('Header navigation and authentication flow', async ({ page }) => {
    // Test navigation links visibility
    const navLinks = ['Home', 'Categories', 'Register', 'Login', 'Cart'];
    for (const link of navLinks) {
      await expect(page.getByRole('link', { name: link })).toBeVisible();
    }

    // Test search input visibility
    await expect(page.getByPlaceholder('Search for a product')).toBeVisible();

    // Test categories dropdown
    await page.getByRole('link', { name: 'Categories' }).click();
    await expect(page.getByRole('link', { name: 'All Categories' })).toBeVisible();
  });

  test('Footer links and content', async ({ page }) => {
    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Test footer content visibility
    await expect(page.getByText('All Rights Reserved')).toBeVisible();
    
    // Test footer links visibility
    const footerLinks = ['About', 'Contact', 'Privacy Policy'];
    for (const link of footerLinks) {
      await expect(page.getByRole('link', { name: link })).toBeVisible();
    }
  });

  test('About page content', async ({ page }) => {
    // Navigate to About page
    await navigateToPage(page, '/about');

    // Test page title
    await expect(page).toHaveTitle(/About us/);

    // Test content structure
    await expect(page.getByRole('img', { name: 'contactus' })).toBeVisible();
    await expect(page.getByText('Add text')).toBeVisible();
  });

  test('404 Page Not Found', async ({ page }) => {
    // Navigate to non-existent page
    await navigateToPage(page, '/non-existent-page');

    // Test 404 page content visibility
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Oops ! Page Not Found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go Back' })).toBeVisible();
  });

  test('Spinner component behavior', async ({ page }) => {
    // Navigate to a protected route without authentication
    await navigateToPage(page, '/dashboard/user');

    // Test spinner visibility
    await expect(page.getByText('redirecting to you in')).toBeVisible();
    await expect(page.getByRole('status')).toBeVisible();

    // Wait for redirect and check if redirected to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('Layout structure and responsiveness', async ({ page }) => {
    // Test header, content area, and footer visibility
    await expect(page.locator('nav.navbar')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.footer')).toBeVisible();

    // Test responsive behavior for mobile
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
    await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeVisible();
    
    // Test mobile menu toggle
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('User Dashboard layout and content', async ({ page }) => {
    // Login first (you'll need to implement this)
    await navigateToPage(page, '/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Navigate to dashboard
    await navigateToPage(page, '/dashboard/user');

    // Test user dashboard layout and content
    await expect(page.getByTestId('user-menu')).toBeVisible();
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(page.getByText('123 Test St')).toBeVisible();
  });

  test('General navigation and footer interactions', async ({ page }) => {
    await navigateToPage(page, '/');
    
    // Test navigation through header links
    await page.getByRole('link', { name: 'About' }).click();
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.getByRole('link', { name: 'Categories' }).click();
    await page.getByRole('link', { name: 'All Categories' }).click();
    await page.getByRole('link', { name: 'Home' }).click();

    // Test footer content
    await page.getByText('🛒 Virtual VaultSearchHomeCategoriesAll CategoriesRegisterLoginCart0').click();
    await page.getByText('All Rights Reserved © TestingCompAbout|Contact|Privacy Policy').click();
  });
});
