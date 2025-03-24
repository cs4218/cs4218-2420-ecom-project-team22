import { test, expect } from "@playwright/test";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

test.beforeAll(async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
});

test("search functionality", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("searchbox", { name: "Search" }).click();
  await page.getByRole("searchbox", { name: "Search" }).click();
  await page.getByRole("searchbox", { name: "Search" }).fill("nus");
  await page.getByRole("searchbox", { name: "Search" }).press("Enter");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Plain NUS T-shirt")).toBeVisible();
});

test("filters work to remove all options", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("checkbox", { name: "Book" }).check();
  await page.getByRole("radio", { name: "$0 to" }).check();
  await page.waitForTimeout(1000);
  await expect(page.getByText("Textbook")).not.toBeVisible();

  await page.getByRole("button", { name: "RESET FILTERS" }).click();
  await page.waitForTimeout(100);
  await expect(page.getByText("Plain NUS T-shirt")).toBeVisible();
});

test("all navigation buttons work as expected", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Categories" }).click();
  await expect(page.getByText("All CategoriesBookClothingElectronicsSoap")).toBeVisible();

  await page.getByRole("link", { name: "Cart" }).click();
  await expect(page.getByText("Cart Summary")).toBeVisible();

  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByText("REGISTER FORM")).toBeVisible();

  await page.getByRole("link", { name: "Login" }).click();
  await expect(page.getByText("LOGIN FORM")).toBeVisible();
});
