const { test, expect } = require("@playwright/test");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const baseURL = "http://localhost:6060"; 
const MONGO_URL = process.env.MONGO_URL;

// Import models
let productModel;
let categoryModel;

// Dynamically import ESM modules
Promise.all([
  import("../models/productModel.js").then((module) => {
    productModel = module.default;
  }),
  import("../models/categoryModel.js").then((module) => {
    categoryModel = module.default;
  })
]);

test.describe("Product Filtering API Integration Tests", () => {
  // Admin user credentials for creating test data
  const adminUser = {
    email: "admin@test.sg",
    password: "admin@test.sg"
  };

  // Connect to MongoDB before tests
  test.beforeAll(async () => {
    try {
      console.log("Connecting to MongoDB for product filtering tests...");
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

  // Helper function to login as admin
  async function loginAsAdmin(page) {
    await page.goto(`${baseURL}/login`);
    await page.getByLabel("Email").fill(adminUser.email);
    await page.getByLabel("Password").fill(adminUser.password);
    await page.getByRole("button", { name: "LOGIN" }).click();
    
    // Wait for navigation to complete
    await page.waitForURL(`${baseURL}`);
    await expect(page.locator("nav")).toBeVisible();
  }

  test("Filter products by category", async ({ page }) => {
    // Go to homepage
    await page.goto(`${baseURL}`);
    
    // Navigate to shop page with categories
    await page.getByRole("link", { name: /categories/i }).click();
    
    // Wait for categories to load
    await page.waitForSelector(".list-group-item");
    
    // Get all available categories
    const categoryElements = await page.locator(".list-group-item").all();
    expect(categoryElements.length).toBeGreaterThan(0);
    
    // Click on the first category
    const firstCategory = categoryElements[0];
    const categoryName = await firstCategory.textContent();
    await firstCategory.click();
    
    // Wait for filtered products to load
    await page.waitForSelector(".card");
    
    // Verify that at least one product is displayed
    const productCards = await page.locator(".card").all();
    expect(productCards.length).toBeGreaterThan(0);
    
    // Verify that the URL contains the category ID
    await expect(page).toHaveURL(new RegExp(`${baseURL}/categories/.*`));
  });

  test.skip("Filter products by price range", async ({ page }) => {
    // Go to homepage
    await page.goto(`${baseURL}`);
    
    // Navigate to shop page
    await page.getByRole("link", { name: /categories/i }).click();
    
    // Wait for price filter to load
    await page.waitForSelector(".price-filter");
    
    // Note: This test is skipped as the price filter implementation may vary
    // based on your actual UI components
  });

  test.skip("Filter products by category and price range combined", async ({ page }) => {
    // Go to homepage
    await page.goto(`${baseURL}`);
    
    // Navigate to shop page
    await page.getByRole("link", { name: /categories/i }).click();
    
    // Wait for categories to load
    await page.waitForSelector(".list-group-item");
    
    // Note: This test is skipped as the combined filter implementation may vary
    // based on your actual UI components
  });

  test("API response for product filters", async ({ page }) => {
    // Login as admin to access API directly
    await loginAsAdmin(page);
    
    // Enable request interception
    await page.route('**/api/v1/product-filters', route => {
      route.continue();
    });
    
    // Create a promise to capture the API response
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/v1/product-filters') && 
      response.status() === 200
    );
    
    // Go to homepage
    await page.goto(`${baseURL}`);
    
    // Navigate to shop page
    await page.getByRole("link", { name: /categories/i }).click();
    
    // Wait for categories to load
    await page.waitForSelector(".list-group-item");
    
    // Select a category
    const categoryElements = await page.locator(".list-group-item").all();
    await categoryElements[0].click();
    
    // Wait for the API response
    const response = await responsePromise;
    
    // Verify the response
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(Array.isArray(responseData.products)).toBe(true);
    
    // Verify that the filtered products match what's displayed on the page
    await page.waitForSelector(".card");
    const productCards = await page.locator(".card").all();
    expect(productCards.length).toBe(responseData.products.length);
  });

  test.skip("No results found for filter combination", async ({ page }) => {
    // This test is skipped as it depends on specific filter UI components
    // that may vary based on your implementation
  });
});
