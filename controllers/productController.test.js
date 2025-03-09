import { createProductController, deleteProductController, updateProductController } from "../controllers/productController.js";
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
});
