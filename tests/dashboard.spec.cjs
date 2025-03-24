import { test, expect } from '@playwright/test';

test('User dashboard displays correct profile information and can navigate to Profile & Orders', async ({ page }) => {
    /* 
        TEST NULL IN ORDERS
    */


  // Test user credentials
  const testUser = {
    email: 'e1496978@u.nus.edu',
    password: '1234567890',
    name: 'connor',
    address: "21 PRINCE GEORGE'S PARK",
  };

  // Login Page
  await page.goto('http://localhost:3000/login');

  // Login
  await page.fill('input[placeholder="Enter Your Email "]', testUser.email);
  await page.fill('input[placeholder="Enter Your Password"]', testUser.password);
  await page.click('button:has-text("LOGIN")');

  // Wait for login success and navigate to the user dashboard
  await page.waitForURL(/http:\/\/localhost:3000\/$/);
  await page.goto('http://localhost:3000/dashboard/user');

  // Verify profile details in the <h3> tags inside the user card
  const profileCard = page.locator('.card.w-75.p-3 h3');

  await expect(profileCard.nth(0)).toHaveText(testUser.name);
  await expect(profileCard.nth(1)).toHaveText(testUser.email);
  await expect(profileCard.nth(2)).toHaveText(testUser.address);

  // Navigate to Profile Page
  await page.goto('http://localhost:3000/dashboard/user/profile');

  // Verify profile form fields contain the correct user info
  await expect(page.locator('input[placeholder="Enter Your Name"]')).toHaveValue(testUser.name);
  await expect(page.locator('input[placeholder="Enter Your Email "]')).toHaveValue(testUser.email);
  await expect(page.locator('input[placeholder="Enter Your Phone"]')).not.toBeEmpty();
  await expect(page.locator('input[placeholder="Enter Your Address"]')).toHaveValue(testUser.address);

  // Navigate to Orders Page
  await page.goto('http://localhost:3000/dashboard/user/orders');

  // Wait for orders to load (Max 15 seconds)
  const orderTable = page.locator('table:has-text("Status")');
  await orderTable.waitFor({ timeout: 15000 });

  // Verify orders table exists OR show "No Orders Found" message
  if (await orderTable.count() != null) {
    await expect(orderTable).toBeVisible();
    await expect(page.locator('table tbody tr')).toHaveCount(1); // One order exists
  } else {
    await expect(page.locator('text=No Orders Found')).toBeVisible();
  }
});
