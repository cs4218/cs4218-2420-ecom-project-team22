import { test, expect } from '@playwright/test';

test('User can log in and update profile successfully', async ({ page }) => {
  // Go to Login Page
  await page.goto('http://localhost:3000/login');

  // Login 
  await page.fill('input[placeholder="Enter Your Email "]', 'e1496978@u.nus.edu');
  await page.fill('input[placeholder="Enter Your Password"]', '1234567890');
  await page.click('button:has-text("LOGIN")');

  // Wait for login success and navigate to the user dashboard manually
  await page.waitForURL(/http:\/\/localhost:3000\/$/); // Ensure login is completed
  await page.goto('http://localhost:3000/dashboard/user');

  // Navigate to the Profile Page
  await page.goto('http://localhost:3000/dashboard/user/profile');

  // Fill out profile update form
  await page.fill('input[placeholder="Enter Your Name"]', 'Updated Name');
  await page.fill('input[placeholder="Enter Your Password"]', '1234567890');
  await page.fill('input[placeholder="Enter Your Phone"]', '1234567890');
  await page.fill('input[placeholder="Enter Your Address"]', '123 New Address');
  await page.click('button:has-text("UPDATE")');

  // Verify the success toast message appears
  await expect(page.locator('text=Profile Updated Successfully')).toBeVisible();

  // Verify updated name appears on the profile page
  await expect(page.locator('text=Updated Name')).toBeVisible();

  // Reverting the data back to original
  await page.fill('input[placeholder="Enter Your Name"]', 'connor');
  await page.fill('input[placeholder="Enter Your Password"]', '1234567890');
  await page.fill('input[placeholder="Enter Your Phone"]', '84339579');
  await page.fill('input[placeholder="Enter Your Address"]', '21 PRINCE GEORGE\'S PARK');
  await page.click('button:has-text("UPDATE")');
});
