const { test, expect } = require("@playwright/test");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const baseURL = "http://localhost:6060"; 
const MONGO_URL = process.env.MONGO_URL;

// Import models
let userModel;
let productModel;
let orderModel;

// Dynamically import ESM modules
Promise.all([
  import("../models/userModel.js").then((module) => {
    userModel = module.default;
  }),
  import("../models/productModel.js").then((module) => {
    productModel = module.default;
  }),
  import("../models/orderModel.js").then((module) => {
    orderModel = module.default;
  })
]);

test.describe("Braintree Payment Gateway Integration Tests", () => {
  // Test user credentials - using an existing user in your database
  const testUser = {
    email: "user@test.sg", 
    password: "user@test.sg"
  };

  // Connect to MongoDB before tests
  test.beforeAll(async () => {
    try {
      console.log("Connecting to MongoDB for Braintree tests...");
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

  // Disconnect from MongoDB after tests
  test.afterAll(async () => {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }
  });

  // Helper function to login
  async function loginUser(page) {
    await page.goto(`${baseURL}/login`);
    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password").fill(testUser.password);
    await page.getByRole("button", { name: "LOGIN" }).click();
    
    // Wait for navigation to complete
    await page.waitForURL(`${baseURL}`);
    // Check for a common element on the homepage after login
    await expect(page.locator("nav")).toBeVisible();
  }

  // Helper function to add a product to cart
  async function addProductToCart(page) {
    // Navigate to homepage
    await page.goto(`${baseURL}`);
    
    // Click on the first product
    await page.locator(".card").first().click();
    
    // Wait for product page to load
    await page.waitForSelector(".product-details");
    
    // Add to cart
    await page.getByRole("button", { name: /add to cart/i }).click();
    
    // Verify product was added to cart
    await expect(page.getByText(/added to cart/i)).toBeVisible();
  }

  test("Braintree token generation", async ({ page }) => {
    // Login first
    await loginUser(page);
    
    // Add a product to cart first
    await addProductToCart(page);
    
    // Navigate to cart
    await page.getByRole("link", { name: /cart/i }).click();
    
    // Verify we're on the cart page
    await expect(page).toHaveURL(`${baseURL}/cart`);
    
    // Check if the payment section is visible
    // This indirectly tests that the token was generated successfully
    await expect(page.locator("#dropin-container")).toBeVisible({ timeout: 10000 });
  });

  test.skip("Complete payment flow with Braintree", async ({ page }) => {
    // Login
    await loginUser(page);
    
    // Add a product to cart
    await addProductToCart(page);
    
    // Go to cart
    await page.getByRole("link", { name: /cart/i }).click();
    
    // Wait for Braintree to initialize
    await page.waitForSelector("#dropin-container", { timeout: 10000 });
    
    // Note: The actual payment flow test is skipped as it requires Braintree sandbox integration
    // and may vary based on your implementation
  });

  test.skip("Failed payment handling", async ({ page }) => {
    // Login
    await loginUser(page);
    
    // Add a product to cart
    await addProductToCart(page);
    
    // Go to cart
    await page.getByRole("link", { name: /cart/i }).click();
    
    // Wait for Braintree to initialize
    await page.waitForSelector("#dropin-container", { timeout: 10000 });
    
    // Note: The failed payment test is skipped as it requires Braintree sandbox integration
    // and may vary based on your implementation
  });

  test.skip("Order creation after successful payment", async ({ page }) => {
    // Login
    await loginUser(page);
    
    // Add a product to cart
    await addProductToCart(page);
    
    // Go to cart
    await page.getByRole("link", { name: /cart/i }).click();
    
    // Wait for Braintree to initialize
    await page.waitForSelector("#dropin-container", { timeout: 10000 });
    
    // Note: The order creation test is skipped as it requires Braintree sandbox integration
    // and may vary based on your implementation
  });
});
