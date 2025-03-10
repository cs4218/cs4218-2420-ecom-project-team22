// Set up environment variables for Braintree
process.env.BRAINTREE_MERCHANT_ID = "test_merchant_id";
process.env.BRAINTREE_PUBLIC_KEY = "test_public_key";
process.env.BRAINTREE_PRIVATE_KEY = "test_private_key";

// Mock braintree module
jest.mock("braintree", () => {
    return {
        Environment: { Sandbox: "sandbox" },
        BraintreeGateway: jest.fn(() => ({
            clientToken: {
                generate: jest.fn()
            },
            transaction: {
                sale: jest.fn()
            }
        }))
    };
});

// Mock other modules
jest.mock("../models/productModel.js");
jest.mock("../models/categoryModel.js");
jest.mock("../models/orderModel.js");
jest.mock("fs");
jest.mock("slugify", () => jest.fn((name) => name.toLowerCase().replace(/\s+/g, "-")));

// Now import the modules after mocking
import { createProductController, deleteProductController, updateProductController, productCountController, productListController, searchProductController, realtedProductController, productCategoryController } from "../controllers/productController.js";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";

describe("Product Controller", () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
        
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe("createProductController", () => {
        it("should create a product successfully", async () => {
            mockReq.fields = {
                name: "Test Product",
                description: "Test Description",
                price: 100,
                category: "123",
                quantity: 10,
            };
            mockReq.files = { photo: { path: "test/path", type: "image/png", size: 500000 } };

            const mockProduct = {
                save: jest.fn().mockResolvedValue({ _id: "product123", ...mockReq.fields }),
                photo: {},
            };
            productModel.mockImplementation(() => mockProduct);
            fs.readFileSync.mockReturnValue(Buffer.from("test"));

            await createProductController(mockReq, mockRes);

            expect(productModel).toHaveBeenCalledWith({ ...mockReq.fields, slug: "test-product" });
            expect(mockProduct.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe("deleteProductController", () => {
        it("should delete a product successfully", async () => {
            productModel.findByIdAndDelete = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({ _id: "product123" })
            });
    
            mockReq.params = { pid: "product123" };  
    
            await deleteProductController(mockReq, mockRes);
    
            expect(productModel.findByIdAndDelete).toHaveBeenCalledWith("product123");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({ 
                success: true,
                message: "Product Deleted successfully" 
            }));
        });
    
        it("should handle errors when deleting a product", async () => {
            console.log = jest.fn();
            
            const mockError = new Error("Database error");
            productModel.findByIdAndDelete = jest.fn().mockReturnValue({
                select: jest.fn().mockRejectedValue(mockError)
            });
    
            mockReq.params = { pid: "product123" };
    
            await deleteProductController(mockReq, mockRes);
    
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Error while deleting product",
                error: mockError
            });
        });
    });

    describe("updateProductController", () => {
        it("should update a product successfully", async () => {
            mockReq.params = { pid: "product123" };
            mockReq.fields = {
                name: "Updated Product",
                description: "Updated Description",
                price: 150,
                category: "123",
                quantity: 5,
            };
            mockReq.files = { photo: { path: "test/path", type: "image/png", size: 500000 } };
        
            const mockProduct = {
                save: jest.fn().mockResolvedValue({ _id: "product123", ...mockReq.fields }),
                photo: {},
            };
            productModel.findByIdAndUpdate.mockResolvedValue(mockProduct);
            fs.readFileSync.mockReturnValue(Buffer.from("test"));

            await updateProductController(mockReq, mockRes);

            expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith("product123", expect.objectContaining({ name: "Updated Product" }), { new: true });
            expect(mockProduct.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe("productCountController", () => {
        it("should return the total count of products", async () => {
            productModel.find = jest.fn().mockReturnValue({
                estimatedDocumentCount: jest.fn().mockResolvedValue(10)
            });

            await productCountController(mockReq, mockRes);

            expect(productModel.find).toHaveBeenCalledWith({});
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                total: 10
            });
        });

        it("should handle errors when counting products", async () => {
            console.log = jest.fn();

            const mockError = new Error("Database error");
            productModel.find = jest.fn().mockReturnValue({
                estimatedDocumentCount: jest.fn().mockRejectedValue(mockError)
            });

            await productCountController(mockReq, mockRes);

            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Error in product count",
                error: mockError
            });
        });
    });

    describe("productListController", () => {
        beforeEach(() => {
            // Reset mocks before each test
            mockReq.params = {};
            mockRes.status.mockClear();
            mockRes.send.mockClear();
        });
        
        it("should return products with default pagination (page 1)", async () => {
            // Mock the product model chain methods
            const mockProducts = [
                { _id: "product1", name: "Product 1" },
                { _id: "product2", name: "Product 2" }
            ];
            
            // Create a proper mock chain that returns the expected values
            const mockSort = jest.fn().mockResolvedValue(mockProducts);
            const mockLimit = jest.fn().mockReturnValue({ sort: mockSort });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSelect = jest.fn().mockReturnValue({ skip: mockSkip });
            const mockFind = jest.fn().mockReturnValue({ select: mockSelect });
            
            productModel.find = mockFind;
            
            // Call the controller without specifying page
            await productListController(mockReq, mockRes);

            // Verify the response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });

        it("should return products with specified pagination", async () => {
            // Set up request with page parameter
            mockReq.params = { page: "2" };
            
            // Mock the product model chain methods
            const mockProducts = [
                { _id: "product7", name: "Product 7" },
                { _id: "product8", name: "Product 8" }
            ];
            
            // Create a proper mock chain that returns the expected values
            const mockSort = jest.fn().mockResolvedValue(mockProducts);
            const mockLimit = jest.fn().mockReturnValue({ sort: mockSort });
            const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockSelect = jest.fn().mockReturnValue({ skip: mockSkip });
            const mockFind = jest.fn().mockReturnValue({ select: mockSelect });
            
            productModel.find = mockFind;
            
            // Call the controller with page 2
            await productListController(mockReq, mockRes);
            
            // Verify the response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });

        it("should handle errors when fetching products", async () => {
            // Mock console.log to verify error logging
            console.log = jest.fn();

            // Set up request with page parameter to avoid TypeError
            mockReq.params = { page: "1" };

            // Mock the find method to throw an error
            const mockError = new Error("Database error");
            productModel.find = jest.fn().mockImplementation(() => {
                throw mockError;
            });

            // Call the controller
            await productListController(mockReq, mockRes);

            // Verify error handling
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "error in per page ctrl",
                error: mockError
            });
        });
    });

    describe("searchProductController", () => {
        it("should return products matching the search keyword", async () => {
            mockReq.params = { keyword: "test" };
            
            const mockResults = [
                { _id: "product1", name: "Test Product 1", description: "Description 1" },
                { _id: "product2", name: "Product 2", description: "Test Description 2" }
            ];
            
            const mockFind = jest.fn().mockReturnThis();
            const mockSelect = jest.fn().mockResolvedValue(mockResults);
            
            productModel.find = mockFind;
            productModel.find().select = mockSelect;
            
            mockRes.json = jest.fn();
            
            await searchProductController(mockReq, mockRes);
            
            expect(mockFind).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: "test", $options: "i" } },
                    { description: { $regex: "test", $options: "i" } }
                ]
            });
            
            expect(mockSelect).toHaveBeenCalledWith("-photo");
            
            expect(mockRes.json).toHaveBeenCalledWith(mockResults);
        });
        
        it("should handle errors when searching products", async () => {
            mockReq.params = { keyword: "test" };
            
            console.log = jest.fn();
            
            const mockError = new Error("Search error");
            productModel.find = jest.fn().mockImplementation(() => {
                throw mockError;
            });
            
            await searchProductController(mockReq, mockRes);
            
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Error In Search Product API",
                error: mockError
            });
        });
    });
    
    describe("realtedProductController", () => {
        it("should return related products excluding the current product", async () => {
            mockReq.params = { pid: "product1", cid: "category1" };
            
            const mockProducts = [
                { _id: "product2", name: "Related Product 2", category: "category1" },
                { _id: "product3", name: "Related Product 3", category: "category1" }
            ];
            
            const mockFind = jest.fn().mockReturnThis();
            const mockSelect = jest.fn().mockReturnThis();
            const mockLimit = jest.fn().mockReturnThis();
            const mockPopulate = jest.fn().mockResolvedValue(mockProducts);
            
            productModel.find = mockFind;
            productModel.find().select = mockSelect;
            productModel.find().select().limit = mockLimit;
            productModel.find().select().limit().populate = mockPopulate;
            
            await realtedProductController(mockReq, mockRes);
            
            expect(mockFind).toHaveBeenCalledWith({
                category: "category1",
                _id: { $ne: "product1" }
            });
            
            expect(mockSelect).toHaveBeenCalledWith("-photo");
            expect(mockLimit).toHaveBeenCalledWith(3);
            expect(mockPopulate).toHaveBeenCalledWith("category");
            
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });
        
        it("should handle errors when fetching related products", async () => {
            mockReq.params = { pid: "product1", cid: "category1" };
            
            console.log = jest.fn();
            
            const mockError = new Error("Database error");
            productModel.find = jest.fn().mockImplementation(() => {
                throw mockError;
            });
            
            await realtedProductController(mockReq, mockRes);
            
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "error while geting related product",
                error: mockError
            });
        });
    });

    describe("productCategoryController", () => {
        it("should return products by category", async () => {
            mockReq.params = { slug: "test-category" };
            
            const mockCategory = { _id: "category1", name: "Test Category", slug: "test-category" };
            const mockProducts = [
                { _id: "product1", name: "Product 1", category: "category1" },
                { _id: "product2", name: "Product 2", category: "category1" }
            ];
            
            categoryModel.findOne = jest.fn().mockResolvedValue(mockCategory);
            
            productModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProducts)
            });
            
            await productCategoryController(mockReq, mockRes);
            
            expect(categoryModel.findOne).toHaveBeenCalledWith({ slug: "test-category" });
            expect(productModel.find).toHaveBeenCalledWith({ category: mockCategory });
            expect(productModel.find().populate).toHaveBeenCalledWith("category");
            
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                category: mockCategory,
                products: mockProducts
            });
        });
        
        it("should handle case when category is not found", async () => {
            mockReq.params = { slug: "non-existent-category" };
            
            categoryModel.findOne = jest.fn().mockResolvedValue(null);
            
            console.log = jest.fn();
            
            const mockError = new Error("Cannot read properties of null");
            
            productModel.find = jest.fn().mockImplementation(() => {
                throw mockError;
            });
            
            await productCategoryController(mockReq, mockRes);
            
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: "Error While Getting products"
            }));
        });
        
        it("should handle database errors when fetching category", async () => {
            mockReq.params = { slug: "test-category" };
            
            console.log = jest.fn();
            
            const mockError = new Error("Database error");
            categoryModel.findOne = jest.fn().mockRejectedValue(mockError);
            
            await productCategoryController(mockReq, mockRes);
            
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                error: mockError,
                message: "Error While Getting products"
            });
        });
        
        it("should handle database errors when fetching products", async () => {
            mockReq.params = { slug: "test-category" };
            
            const mockCategory = { _id: "category1", name: "Test Category", slug: "test-category" };
            
            console.log = jest.fn();
            
            categoryModel.findOne = jest.fn().mockResolvedValue(mockCategory);
            
            const mockError = new Error("Database error");
            productModel.find = jest.fn().mockImplementation(() => {
                throw mockError;
            });
            
            await productCategoryController(mockReq, mockRes);
            
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                error: mockError,
                message: "Error While Getting products"
            });
        });
    });
});
