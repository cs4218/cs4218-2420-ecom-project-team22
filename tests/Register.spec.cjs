import { test, expect } from '@playwright/test';
import userModel from '../models/userModel';
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

test.beforeEach(async () => {
  await mongoose.connect(MONGO_URL);
  try {
    await userModel.deleteMany({}); // Deletes all users in the collection
  } catch (error) {
    console.warn("Failed to delete test users. They might not exist.");
  }
});


test('test successfull register', async ({ page }) => {
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
  await expect(page.getByText("LOGIN FORM")).toBeVisible();
});


test('test invalid email with no @', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('TestName');
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail.com');
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
  await expect(page.getByText("REGISTER FORM")).toBeVisible();
});


test('test invalid email with @ at the end', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('TestName');
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail@');
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
  await expect(page.getByText("REGISTER FORM")).toBeVisible();
});


test('test invalid email with @  but no . ', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('TestName');
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail@qwertyuio');
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
  await expect(page.getByText("REGISTER FORM")).toBeVisible();
});


test('test register user already exist', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('TestName');
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail@email.com');
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
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('Test');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('TestName');
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail@email.com');
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
  await expect(page.getByText("REGISTER FORM")).toBeVisible();
});


test('test register success only different email', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('test');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('testName');
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail000@email.com');
  await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Password' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Enter Your Phone' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Phone' }).fill('82821229');
  await page.getByRole('textbox', { name: 'Enter Your Address' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Address' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Address' }).fill('Orchard');
  await page.getByPlaceholder('Enter Your DOB').fill('2025-03-23');
  await page.getByRole('textbox', { name: 'What is Your Favorite sports' }).click();
  await page.getByRole('textbox', { name: 'What is Your Favorite sports' }).fill('qwerty');
  await page.getByRole('button', { name: 'REGISTER' }).click();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('test');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Name' }).fill('testName');
  await page.getByRole('textbox', { name: 'Enter Your Email' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Email' }).fill('testemail001@email.com');
  await page.getByRole('textbox', { name: 'Enter Your Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Password' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Enter Your Phone' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Phone' }).fill('82821229');
  await page.getByRole('textbox', { name: 'Enter Your Address' }).click();
  await page.getByRole('textbox', { name: 'Enter Your Address' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Enter Your Address' }).fill('Orchard');
  await page.getByPlaceholder('Enter Your DOB').fill('2025-03-23');
  await page.getByRole('textbox', { name: 'What is Your Favorite sports' }).click();
  await page.getByRole('textbox', { name: 'What is Your Favorite sports' }).fill('qwerty');
  await page.getByRole('button', { name: 'REGISTER' }).click();
  await expect(page.getByText("LOGIN FORM")).toBeVisible();
});