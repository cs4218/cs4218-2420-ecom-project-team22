import { test, expect } from "@playwright/test";
const path = require("path");
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

let userModel;
import("../models/userModel.js").then((module) => {
  userModel = module.default;
});

let categoryModel;
import("../models/productModel.js").then((module) => {
  categoryModel = module.default;
});

let productModel;
import("../models/productModel.js").then((module) => {
  productModel = module.default;
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

    await productModel.deleteMany({
      name: {
        $in: ["Rose Soap", "Soapy"],
      },
    });

    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
});

test("admin create, edit and delete product", async ({ page }) => {
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

  // Set up a dummy category to guaranteed we have one to use
  await page.getByRole("link", { name: "Create Category" }).click();
  await expect(page.getByText("Manage Category")).toBeVisible();

  await page.getByRole("textbox", { name: "Enter new category" }).click();
  await page.getByRole("textbox", { name: "Enter new category" }).fill("Soap");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("cell", { name: "Soap" })).toBeVisible();

  // Set up the product
  await page.getByRole("link", { name: "Create Product" }).click();
  await page.locator("#rc_select_0").click();
  await page.getByTitle("Soap").locator("div").click();
  await page.getByRole("textbox", { name: "Product Name" }).click();
  await page.getByRole("textbox", { name: "Product Name" }).fill("Rose Soap");
  await page.getByRole("textbox", { name: "Product Description" }).click();
  await page.getByRole("textbox", { name: "Product Description" }).fill("Nice soap");
  await page.getByPlaceholder("Price").click();
  await page.getByPlaceholder("Price").fill("50");
  await page.getByPlaceholder("Quantity").click();
  await page.getByPlaceholder("Quantity").fill("3");
  await page.locator("#rc_select_1").click();
  await page.getByText("Yes").click();

  // Add a photo in
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByText("Upload Photo").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, "assets/rose-soap.jpeg"));

  // Create the product
  await page.getByTestId("create-product").click();
  await expect(page.getByText("Rose Soap")).toBeVisible();

  // Delete the product and expect for it to be gone
  await page.getByRole("link", { name: "Rose Soap Rose Soap Nice soap" }).click();
  page.on("dialog", async (dialog) => {
    await dialog.accept("yes");
  });

  await page.getByTestId("delete-product").click();
  await expect(page.getByText("Rose Soap")).not.toBeVisible();
});
