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

test.afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
});

test("test admin can create category and delete", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Enter Your Email" }).click();
  await page.getByRole("textbox", { name: "Enter Your Email" }).fill("admin@test.sg");
  await page.getByRole("textbox", { name: "Enter Your Password" }).click();
  await page.getByRole("textbox", { name: "Enter Your Password" }).click();
  await page.getByRole("textbox", { name: "Enter Your Password" }).fill("admin@test.sg");
  await page.getByRole("button", { name: "LOGIN" }).click();
  await expect(page.getByText("All Products")).toBeVisible();

  await page.getByRole("a", { hasText: "admin@test.sg" }).click();
});
