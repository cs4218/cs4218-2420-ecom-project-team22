import { createProductController, deleteProductController, updateProductController, productCountController, productListController, searchProductController, realtedProductController } from "../controllers/productController.js";
import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

jest.mock("../models/productModel.js");
jest.mock("fs");
jest.mock("slugify", () => jest.fn((name) => name.toLowerCase().replace(/\s+/g, "-")));
jest.mock("braintree", () => ({
    BraintreeGateway: jest.fn().mockImplementation(() => ({
        clientToken: {
            generate: jest.fn((_, cb) => cb(null, { success: true, clientToken: "mock_token" })),
        },
        transaction: {
            sale: jest.fn((_, cb) => cb(null, { success: true })),
        },
    })),
    Environment: {
        Sandbox: "Sandbox",
    },
}));

describe("Product Controller", () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
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
            productModel.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "product123" });
    
            mockReq.params = { id: "product123" };  // Ensure this matches what your controller expects
    
            await deleteProductController(mockReq, mockRes);
    
            expect(productModel.findByIdAndDelete).toHaveBeenCalledWith("product123");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    
        it("should return 500 if product is not found", async () => {
            productModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    
            mockReq.params = { id: "product123" };
    
            await deleteProductController(mockReq, mockRes);
    
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Product not found" });
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
            // Mock the estimatedDocumentCount method to return a specific count
            productModel.find = jest.fn().mockReturnValue({
                estimatedDocumentCount: jest.fn().mockResolvedValue(10)
            });

            // Call the controller
            await productCountController(mockReq, mockRes);

            // Verify the response
            expect(productModel.find).toHaveBeenCalledWith({});
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                total: 10
            });
        });

        it("should handle errors when counting products", async () => {
            // Mock console.log to verify error logging
            console.log = jest.fn();

            // Mock the estimatedDocumentCount method to throw an error
            const mockError = new Error("Database error");
            productModel.find = jest.fn().mockReturnValue({
                estimatedDocumentCount: jest.fn().mockRejectedValue(mockError)
            });

            // Call the controller
            await productCountController(mockReq, mockRes);

            // Verify error handling
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                message: "Error in product count",
                error: mockError,
                success: false
            });
        });
    });

    describe("productListController", () => {
        it("should return products with default pagination (page 1)", async () => {
            // Mock the product model chain methods
            const mockProducts = [
                { _id: "product1", name: "Product 1" },
                { _id: "product2", name: "Product 2" }
            ];
            
            const mockFind = jest.fn().mockReturnThis();
            const mockSelect = jest.fn().mockReturnThis();
            const mockSkip = jest.fn().mockReturnThis();
            const mockLimit = jest.fn().mockReturnThis();
            const mockSort = jest.fn().mockResolvedValue(mockProducts);
            
            productModel.find = mockFind;
            productModel.find().select = mockSelect;
            productModel.find().select().skip = mockSkip;
            productModel.find().select().skip().limit = mockLimit;
            productModel.find().select().skip().limit().sort = mockSort;

            // Call the controller without specifying page
            await productListController(mockReq, mockRes);

            // Verify the correct methods were called with right parameters
            expect(mockFind).toHaveBeenCalledWith({});
            expect(mockSelect).toHaveBeenCalledWith("-photo");
            expect(mockSkip).toHaveBeenCalledWith(0); // (page-1) * perPage = (1-1) * 6 = 0
            expect(mockLimit).toHaveBeenCalledWith(6);
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            
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
            
            const mockFind = jest.fn().mockReturnThis();
            const mockSelect = jest.fn().mockReturnThis();
            const mockSkip = jest.fn().mockReturnThis();
            const mockLimit = jest.fn().mockReturnThis();
            const mockSort = jest.fn().mockResolvedValue(mockProducts);
            
            productModel.find = mockFind;
            productModel.find().select = mockSelect;
            productModel.find().select().skip = mockSkip;
            productModel.find().select().skip().limit = mockLimit;
            productModel.find().select().skip().limit().sort = mockSort;

            // Call the controller with page 2
            await productListController(mockReq, mockRes);

            // Verify the correct methods were called with right parameters
            expect(mockFind).toHaveBeenCalledWith({});
            expect(mockSelect).toHaveBeenCalledWith("-photo");
            expect(mockSkip).toHaveBeenCalledWith(6); // (page-1) * perPage = (2-1) * 6 = 6
            expect(mockLimit).toHaveBeenCalledWith(6);
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            
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
            // Set up request with keyword parameter
            mockReq.params = { keyword: "test" };
            
            // Mock search results
            const mockResults = [
                { _id: "product1", name: "Test Product 1", description: "Description 1" },
                { _id: "product2", name: "Product 2", description: "Test Description 2" }
            ];
            
            // Mock the find method with regex search
            const mockFind = jest.fn().mockReturnThis();
            const mockSelect = jest.fn().mockResolvedValue(mockResults);
            
            productModel.find = mockFind;
            productModel.find().select = mockSelect;
            
            // Mock the response json method
            mockRes.json = jest.fn();
            
            // Call the controller
            await searchProductController(mockReq, mockRes);
            
            // Verify the correct query was constructed
            expect(mockFind).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: "test", $options: "i" } },
                    { description: { $regex: "test", $options: "i" } }
                ]
            });
            
            // Verify photo field is excluded
            expect(mockSelect).toHaveBeenCalledWith("-photo");
            
            // Verify the response
            expect(mockRes.json).toHaveBeenCalledWith(mockResults);
        });
        
        it("should handle errors when searching products", async () => {
            // Set up request with keyword parameter
            mockReq.params = { keyword: "test" };
            
            // Mock console.log to verify error logging
            console.log = jest.fn();
            
            // Mock the find method to throw an error
            const mockError = new Error("Search error");
            productModel.find = jest.fn().mockImplementation(() => {
                throw mockError;
            });
            
            // Call the controller
            await searchProductController(mockReq, mockRes);
            
            // Verify error handling
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
            // Set up request with product ID and category ID parameters
            mockReq.params = { pid: "product1", cid: "category1" };
            
            // Mock related products
            const mockProducts = [
                { _id: "product2", name: "Related Product 2", category: "category1" },
                { _id: "product3", name: "Related Product 3", category: "category1" }
            ];
            
            // Mock the find method chain for related products
            const mockFind = jest.fn().mockReturnThis();
            const mockSelect = jest.fn().mockReturnThis();
            const mockLimit = jest.fn().mockReturnThis();
            const mockPopulate = jest.fn().mockResolvedValue(mockProducts);
            
            productModel.find = mockFind;
            productModel.find().select = mockSelect;
            productModel.find().select().limit = mockLimit;
            productModel.find().select().limit().populate = mockPopulate;
            
            // Call the controller
            await realtedProductController(mockReq, mockRes);
            
            // Verify the correct query was constructed
            expect(mockFind).toHaveBeenCalledWith({
                category: "category1",
                _id: { $ne: "product1" }
            });
            
            // Verify photo field is excluded and limit is set
            expect(mockSelect).toHaveBeenCalledWith("-photo");
            expect(mockLimit).toHaveBeenCalledWith(3);
            expect(mockPopulate).toHaveBeenCalledWith("category");
            
            // Verify the response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });
        
        it("should handle errors when fetching related products", async () => {
            // Set up request with product ID and category ID parameters
            mockReq.params = { pid: "product1", cid: "category1" };
            
            // Mock console.log to verify error logging
            console.log = jest.fn();
            
            // Mock the find method to throw an error
            const mockError = new Error("Database error");
            productModel.find = jest.fn().mockImplementation(() => {
                throw mockError;
            });
            
            // Call the controller
            await realtedProductController(mockReq, mockRes);
            
            // Verify error handling
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "error while geting related product",
                error: mockError
            });
        });
    });
});
