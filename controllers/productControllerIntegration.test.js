import { getProductController, getSingleProductController } from "../controllers/productController.js";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";

// Mock the productModel and categoryModel
jest.mock("../models/productModel.js");
jest.mock("../models/categoryModel.js");

describe("Product Controller Tests", () => {
  
  // Test getProductController
  it("should fetch all products", async () => {
    const mockProducts = [
      { _id: "1", name: "Product A", description: "Description A", slug: "product-a" },
      { _id: "2", name: "Product B", description: "Description B", slug: "product-b" }
    ];
    
    productModel.find.mockResolvedValue(mockProducts);  // Mock the find method

    const req = {};  // Mocking the request object
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await getProductController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);  // Check if the status was 200
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      countTotal: mockProducts.length,
      message: "All Products",
      products: mockProducts
    });
  });

  // Test getSingleProductController
  it("should fetch a single product by slug", async () => {
    const mockProduct = { _id: "1", name: "Product A", description: "Description A", slug: "product-a" };
    
    productModel.findOne.mockResolvedValue(mockProduct);  // Mock the findOne method

    const req = { params: { slug: "product-a" } };  // Mocking the request with slug
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    await getSingleProductController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "Single Product Fetched",
      product: mockProduct
    });
  });
});
