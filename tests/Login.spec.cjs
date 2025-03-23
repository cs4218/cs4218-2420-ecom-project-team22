import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

test('test log in user doesnt exist', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('impossible@email.com');
  await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Password' }).fill('123456789');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await expect(page.getByText("LOGIN FORM")).toBeVisible();
});

test('test log in success', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('TestName');
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail0@email.com');
  await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Password' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Enter Your Phone' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Phone' }).fill('82851229');
  await page.getByRole('textbox', { name: 'Enter Your Address' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Address' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Address' }).fill('Orchard');
  await page.getByPlaceholder('Enter Your DOB').fill('2025-03-04');
  await page.getByRole('textbox', { name: 'What is Your Favorite sports' }).click();
  await page.getByRole('textbox', { name: 'What is Your Favorite sports' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'What is Your Favorite sports' }).fill('Test spot');
  await page.getByRole('button', { name: 'REGISTER' }).click();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
    await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail0@email.com');
    await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Your Password' }).fill('123456789');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page.getByText("All Products")).toBeVisible();
  });


  test('test log in wrong password', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
    await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail@email.com');
    await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Your Password' }).fill('000000000');
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await expect(page.getByText("LOGIN FORM")).toBeVisible();
  });
  