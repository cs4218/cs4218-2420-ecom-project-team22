import { test, expect } from "@playwright/test";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

let userModel;
import("../models/userModel.js").then((module) => {
  userModel = module.default;
});

let categoryModel;
import("../models/categoryModel.js").then((module) => {
  categoryModel = module.default;
});

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
    await userModel.deleteMany({
      email: {
        $in: ["newadmin@gmail.com", "newadmin2@gmail.com"],
      },
    });

    await categoryModel.deleteMany({
      name: {
        $in: ["Soap", "Toiletries"],
      },
    });

    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
});

test("admin create, edit and delete category", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  // Registration
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Enter Your Name" }).fill("newadmin");
  await page.getByRole("textbox", { name: "Enter Your Email" }).fill("newadmin@gmail.com");
  await page.getByRole("textbox", { name: "Enter Your Password" }).fill("password");
  await page.getByRole("textbox", { name: "Enter Your Phone" }).fill("543534543");
  await page.getByRole("textbox", { name: "Enter Your Address" }).fill("423 fdasfsad");
  await page.getByPlaceholder("Enter Your DOB").fill("2020-01-01");
  await page.getByRole("textbox", { name: "What is Your Favorite sports" }).fill("basketball");
  await page.getByRole("button", { name: "REGISTER" }).click();

  // Wait for login screen
  await expect(page.getByText("LOGIN FORM")).toBeVisible();

  // Use mongoose to update newadmin@gmail.com to have role: 1
  await userModel.updateOne({ email: "newadmin@gmail.com" }, { role: 1 });

  // Login and Navigation
  await page.getByRole("textbox", { name: "Enter Your Email" }).fill("newadmin@gmail.com");
  await page.getByRole("textbox", { name: "Enter Your Password" }).fill("password");
  await page.getByRole("button", { name: "LOGIN" }).click();
  await expect(page.getByText("All Products")).toBeVisible();

  await page.getByRole("button", { name: "newadmin" }).click();
  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByText("Admin Panel")).toBeVisible();

  await page.getByRole("link", { name: "Create Category" }).click();
  await expect(page.getByText("Manage Category")).toBeVisible();

  await page.getByRole("textbox", { name: "Enter new category" }).click();
  await page.getByRole("textbox", { name: "Enter new category" }).fill("Soap");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("cell", { name: "Soap" })).toBeVisible();

  await page
    .locator("tr", { has: page.getByRole("cell", { name: "Soap" }) })
    .getByRole("button", { name: "Edit" })
    .click();
  await page.getByRole("dialog").getByRole("textbox", { name: "Enter new category" }).click();
  await page.getByRole("dialog").getByRole("textbox", { name: "Enter new category" }).fill("Toiletries");
  await page.getByRole("dialog").getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("cell", { name: "Toiletries" })).toBeVisible();

  await page
    .locator("tr", { has: page.getByRole("cell", { name: "Toiletries" }) })
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(page.getByRole("cell", { name: "Toiletries" })).not.toBeVisible();
});

test("after category creation that it appears in ui", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  // Registration
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Enter Your Name" }).fill("newadmin2");
  await page.getByRole("textbox", { name: "Enter Your Email" }).fill("newadmin2@gmail.com");
  await page.getByRole("textbox", { name: "Enter Your Password" }).fill("password");
  await page.getByRole("textbox", { name: "Enter Your Phone" }).fill("543534543");
  await page.getByRole("textbox", { name: "Enter Your Address" }).fill("423 fdasfsad");
  await page.getByPlaceholder("Enter Your DOB").fill("2020-01-01");
  await page.getByRole("textbox", { name: "What is Your Favorite sports" }).fill("basketball");
  await page.getByRole("button", { name: "REGISTER" }).click();

  // Wait for login screen
  await expect(page.getByText("LOGIN FORM")).toBeVisible();

  // Use mongoose to update newadmin@gmail.com to have role: 1
  await userModel.updateOne({ email: "newadmin2@gmail.com" }, { role: 1 });

  // Login and Navigation
  await page.getByRole("textbox", { name: "Enter Your Email" }).fill("newadmin2@gmail.com");
  await page.getByRole("textbox", { name: "Enter Your Password" }).fill("password");
  await page.getByRole("button", { name: "LOGIN" }).click();
  await expect(page.getByText("All Products")).toBeVisible();

  await page.getByRole("button", { name: "newadmin" }).click();
  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByText("Admin Panel")).toBeVisible();

  // Create Category
  await page.getByRole("link", { name: "Create Category" }).click();
  await expect(page.getByText("Manage Category")).toBeVisible();

  await page.getByRole("textbox", { name: "Enter new category" }).click();
  await page.getByRole("textbox", { name: "Enter new category" }).fill("Soap");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("cell", { name: "Soap" })).toBeVisible();

  // Test visibility in the products
  await page.getByRole("link", { name: "Create Product" }).click();
  await page.getByTestId("category-select").click();
  await expect(page.getByTitle("Soap").locator("div")).toBeVisible();
  await page.getByTitle("Soap").locator("div").click();

  // Test visibility in the main page
  await page.getByRole("link", { name: "Categories" }).click();
  await expect(page.getByRole("link", { name: "Soap" })).toBeVisible();
  await page.getByRole("link", { name: "Soap" }).click();
  await page.getByRole("link", { name: "🛒 Virtual Vault" }).click();
  await expect(page.getByRole("main").getByText("Soap")).toBeVisible();
  await page.getByRole("main").getByText("Soap").click();
});
