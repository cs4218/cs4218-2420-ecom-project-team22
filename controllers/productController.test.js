// Set environment variables for Braintree
process.env.BRAINTREE_MERCHANT_ID = "test_merchant_id";
process.env.BRAINTREE_PUBLIC_KEY = "test_public_key";
process.env.BRAINTREE_PRIVATE_KEY = "test_private_key";

// Mock other modules first
jest.mock("../models/productModel.js");
jest.mock("../models/categoryModel.js");
jest.mock("../models/orderModel.js");
jest.mock("fs");
jest.mock("slugify", () => jest.fn((name) => name.toLowerCase().replace(/\s+/g, "-")));

// Mock braintree module
jest.mock("braintree", () => {
    return {
        Environment: {
            Sandbox: "sandbox"
        },
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

// Import modules after mocking
import { createProductController, deleteProductController, updateProductController, productCountController, productListController, searchProductController, realtedProductController, productCategoryController, getProductController, getSingleProductController, productPhotoController, productFiltersController } from "../controllers/productController.js";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import orderModel from "../models/orderModel.js";
import braintree from "braintree";

// Get the mock gateway for testing
const gateway = new braintree.BraintreeGateway();

// Define local versions of the Braintree controllers for testing
const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const brainTreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

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
        beforeEach(() => {
            // Set up default request with valid fields
            mockReq.fields = {
                name: "Test Product",
                description: "Test Description",
                price: 100,
                category: "test-category",
                quantity: 10,
                shipping: true
            };
            mockReq.files = {
                photo: {
                    size: 500000,
                    path: "/tmp/test-photo.jpg",
                    type: "image/jpeg"
                }
            };
            
            // Mock product model
            productModel.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({
                    _id: "product1",
                    ...mockReq.fields,
                    slug: "test-product"
                }),
                photo: {
                    data: null,
                    contentType: null
                }
            }));
            
            // Mock fs.readFileSync
            fs.readFileSync.mockReturnValue(Buffer.from("test-image"));
        });

        it("should create a product successfully", async () => {
            await createProductController(mockReq, mockRes);
            
            expect(productModel).toHaveBeenCalledWith({
                ...mockReq.fields,
                slug: "test-product"
            });
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: "Product Created Successfully"
            }));
        });
        
        it("should validate name is required", async () => {
            mockReq.fields.name = "";
            
            await createProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Name is Required" });
        });
        
        it("should validate description is required", async () => {
            mockReq.fields.description = "";
            
            await createProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Description is Required" });
        });
        
        it("should validate price is required", async () => {
            mockReq.fields.price = "";
            
            await createProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Price is Required" });
        });
        
        it("should validate category is required", async () => {
            mockReq.fields.category = "";
            
            await createProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Category is Required" });
        });
        
        it("should validate quantity is required", async () => {
            mockReq.fields.quantity = "";
            
            await createProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Quantity is Required" });
        });
        
        it("should validate photo size", async () => {
            mockReq.files.photo.size = 2000000; // 2MB (exceeds limit)
            
            await createProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "photo is Required and should be less then 1mb" });
        });

        it("should handle errors during product creation", async () => {
            // Mock request with file
            mockReq.fields = { name: "Test Product", description: "Test Description", price: "100", quantity: "10", category: "test-category" };
            mockReq.files = { photo: { path: "test/path" } };

            // Mock error during product creation
            const mockError = new Error("Product creation failed");
            productModel.mockImplementationOnce(() => {
                throw mockError;
            });

            // Mock console.log
            console.log = jest.fn();

            await createProductController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                error: expect.any(Error),
                message: "Error in crearing product"
            });
        });
    });

    describe("deleteProductController", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            mockRes.status.mockReturnThis();
            mockRes.send.mockReturnThis();
        });

        it("should delete a product successfully", async () => {
            // Mock request with product ID
            mockReq.params = { pid: "test-product-id" };
            
            // Mock successful product deletion
            productModel.findByIdAndDelete = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({})
            });
            
            await deleteProductController(mockReq, mockRes);
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({ 
                success: true, 
                message: "Product Deleted successfully" 
            });
        });

        it("should handle errors during product deletion", async () => {
            // Mock request with params
            mockReq.params = { pid: "test-product-id" };

            // Create a mock implementation that simulates an error
            productModel.findByIdAndDelete = jest.fn().mockImplementation(() => {
                throw new Error("Product deletion failed");
            });

            // Mock console.log to prevent actual logging
            console.log = jest.fn();

            await deleteProductController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                error: expect.any(Error),
                message: "Error while deleting product"
            });
        });
    });

    describe("updateProductController", () => {
        it("should update a product successfully", async () => {
            // Setup request
            mockReq.params = { pid: "product123" };
            mockReq.fields = {
                name: "Updated Product",
                description: "Updated description",
                price: "150",
                category: "category123",
                quantity: "20",
                shipping: "true"
            };
            mockReq.files = {
                photo: {
                    path: "/path/to/photo.jpg",
                    type: "image/jpeg",
                    size: 500000 // 500KB
                }
            };
            
            // Mock fs.readFileSync
            fs.readFileSync.mockReturnValue(Buffer.from("test-image-data"));
            
            // Mock finding and updating the product
            const mockUpdatedProduct = {
                _id: "product123",
                name: "Updated Product",
                description: "Updated description",
                price: 150,
                category: "category123",
                quantity: 20,
                shipping: true,
                slug: "updated-product",
                photo: {
                    data: Buffer.from("test-image-data"),
                    contentType: "image/jpeg"
                },
                save: jest.fn().mockResolvedValue()
            };
            
            productModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedProduct);
            
            await updateProductController(mockReq, mockRes);
            
            // Verify findByIdAndUpdate was called with correct params
            expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "product123",
                { ...mockReq.fields, slug: "updated-product" },
                { new: true }
            );
            
            // Verify photo was set correctly
            expect(mockUpdatedProduct.photo.data).toEqual(Buffer.from("test-image-data"));
            expect(mockUpdatedProduct.photo.contentType).toBe("image/jpeg");
            
            // Verify save was called
            expect(mockUpdatedProduct.save).toHaveBeenCalled();
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: "Product Updated Successfully",
                products: mockUpdatedProduct
            });
        });
        
        it("should update a product without changing the photo", async () => {
            // Setup request with no photo
            mockReq.params = { pid: "product123" };
            mockReq.fields = {
                name: "Updated Product",
                description: "Updated description",
                price: "150",
                category: "category123",
                quantity: "20",
                shipping: "true"
            };
            mockReq.files = {}; // No photo
            
            // Mock finding and updating the product
            const mockUpdatedProduct = {
                _id: "product123",
                name: "Updated Product",
                description: "Updated description",
                price: 150,
                category: "category123",
                quantity: 20,
                shipping: true,
                slug: "updated-product",
                photo: {
                    data: Buffer.from("existing-photo"),
                    contentType: "image/jpeg"
                },
                save: jest.fn().mockResolvedValue()
            };
            
            productModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedProduct);
            
            await updateProductController(mockReq, mockRes);
            
            // Verify findByIdAndUpdate was called with correct params
            expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "product123",
                { ...mockReq.fields, slug: "updated-product" },
                { new: true }
            );
            
            // Verify save was called
            expect(mockUpdatedProduct.save).toHaveBeenCalled();
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: "Product Updated Successfully",
                products: mockUpdatedProduct
            });
        });
        
        it("should handle validation errors when updating a product", async () => {
            // Setup request with missing required fields
            mockReq.params = { pid: "product123" };
            mockReq.fields = {
                // Missing name and other required fields
            };
            mockReq.files = {};
            
            await updateProductController(mockReq, mockRes);
            
            // Verify validation error response
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Name is Required" });
        });

        it("should handle errors during product update", async () => {
            // Mock request with file and params
            mockReq.fields = { name: "Updated Product", description: "Updated Description", price: "150", quantity: "15", category: "updated-category" };
            mockReq.files = { photo: { path: "updated/path" } };
            mockReq.params = { pid: "test-product-id" };

            // Mock error during product update
            const mockError = new Error("Product update failed");
            productModel.findByIdAndUpdate.mockRejectedValueOnce(mockError);

            // Mock console.log
            console.log = jest.fn();

            await updateProductController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                error: expect.any(Error),
                message: "Error in Updte product"
            });
        });
    });

    describe("productCountController", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            mockRes.status.mockReturnThis();
            mockRes.send.mockReturnThis();
        });

        it("should return the total count of products", async () => {
            // Mock successful product count
            const mockEstimatedDocumentCount = jest.fn().mockResolvedValue(10);
            productModel.find = jest.fn().mockReturnValue({
                estimatedDocumentCount: mockEstimatedDocumentCount
            });
            
            await productCountController(mockReq, mockRes);
            
            // Verify the mock was called
            expect(productModel.find).toHaveBeenCalledWith({});
            expect(mockEstimatedDocumentCount).toHaveBeenCalled();
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                total: 10
            });
        });
        
        it("should handle case when no products are found", async () => {
            // Mock no products found
            const mockEstimatedDocumentCount = jest.fn().mockResolvedValue(0);
            productModel.find = jest.fn().mockReturnValue({
                estimatedDocumentCount: mockEstimatedDocumentCount
            });
            
            await productCountController(mockReq, mockRes);
            
            // Verify the mock was called
            expect(productModel.find).toHaveBeenCalledWith({});
            expect(mockEstimatedDocumentCount).toHaveBeenCalled();
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                total: 0
            });
        });

        it("should handle errors during product count", async () => {
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            productModel.find = jest.fn().mockImplementation(() => {
                throw new Error("Product count failed");
            });

            await productCountController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Error in product count",
                error: expect.any(Error)
            });
        });
    });

    describe("productListController", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            mockRes.status.mockReturnThis();
            mockRes.send.mockReturnThis();
        });

        it("should return products for the specified page", async () => {
            // Setup request with page parameter
            mockReq.params = { page: "1" };
            
            // Mock products
            const mockProducts = [
                { _id: "product1", name: "Product 1" },
                { _id: "product2", name: "Product 2" }
            ];
            
            productModel.find = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockReturnThis();
            productModel.skip = jest.fn().mockReturnThis();
            productModel.limit = jest.fn().mockReturnThis();
            productModel.sort = jest.fn().mockResolvedValue(mockProducts);
            
            await productListController(mockReq, mockRes);
            
            // Verify correct pagination
            expect(productModel.find).toHaveBeenCalledWith({});
            expect(productModel.select).toHaveBeenCalledWith("-photo");
            expect(productModel.skip).toHaveBeenCalledWith(0); // (page-1) * perPage = (1-1) * 6 = 0
            expect(productModel.limit).toHaveBeenCalledWith(6);
            expect(productModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });
        
        it("should handle pagination for page 2", async () => {
            // Setup request with page parameter
            mockReq.params = { page: "2" };
            
            // Mock products
            const mockProducts = [
                { _id: "product7", name: "Product 7" },
                { _id: "product8", name: "Product 8" }
            ];
            
            productModel.find = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockReturnThis();
            productModel.skip = jest.fn().mockReturnThis();
            productModel.limit = jest.fn().mockReturnThis();
            productModel.sort = jest.fn().mockResolvedValue(mockProducts);
            
            await productListController(mockReq, mockRes);
            
            // Verify correct pagination
            expect(productModel.find).toHaveBeenCalledWith({});
            expect(productModel.select).toHaveBeenCalledWith("-photo");
            expect(productModel.skip).toHaveBeenCalledWith(6); // (page-1) * perPage = (2-1) * 6 = 6
            expect(productModel.limit).toHaveBeenCalledWith(6);
            expect(productModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });

        it("should handle errors during product listing", async () => {
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            productModel.find = jest.fn().mockImplementation(() => {
                throw new Error("Product listing failed");
            });

            await productListController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "error in per page ctrl",
                error: expect.any(Error)
            });
        });
    });

    describe("searchProductController", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            mockRes.status.mockReturnThis();
            mockRes.send.mockReturnThis();
        });

        it("should search products by keyword", async () => {
            // Setup request with search keyword in params (not body)
            mockReq.params = { keyword: "test" };
            
            // Mock products found
            const mockProducts = [
                { _id: "product1", name: "Test Product 1" },
                { _id: "product2", name: "Test Product 2" }
            ];
            
            // Mock the product model find method
            productModel.find = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockResolvedValue(mockProducts);
            
            await searchProductController(mockReq, mockRes);
            
            // Verify search query was constructed correctly
            expect(productModel.find).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: "test", $options: "i" } },
                    { description: { $regex: "test", $options: "i" } }
                ]
            });
            expect(productModel.select).toHaveBeenCalledWith("-photo");
            
            // Verify response
            expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
        });
        
        it("should handle case when no products match the search", async () => {
            // Setup request with search keyword in params
            mockReq.params = { keyword: "nonexistent" };
            
            // Mock no products found
            productModel.find = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockResolvedValue([]);
            
            await searchProductController(mockReq, mockRes);
            
            // Verify search query was constructed correctly
            expect(productModel.find).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: "nonexistent", $options: "i" } },
                    { description: { $regex: "nonexistent", $options: "i" } }
                ]
            });
            
            // Verify response
            expect(mockRes.json).toHaveBeenCalledWith([]);
        });
        
        it("should handle errors during product search", async () => {
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            productModel.find = jest.fn().mockImplementation(() => {
                throw new Error("Product search failed");
            });

            await searchProductController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Error In Search Product API",
                error: expect.any(Error)
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

        it("should handle errors during related product retrieval", async () => {
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            productModel.find = jest.fn().mockImplementation(() => {
                throw new Error("Related product retrieval failed");
            });

            await realtedProductController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "error while geting related product",
                error: expect.any(Error)
            });
        });
    });

    describe("productCategoryController", () => {
        it("should return products by category", async () => {
            // Setup request with category ID
            mockReq.params = { slug: "test-category" };
            
            // Mock category and products
            const mockCategory = { _id: "category123", name: "Test Category" };
            const mockProducts = [
                { _id: "product1", name: "Product 1", category: mockCategory },
                { _id: "product2", name: "Product 2", category: mockCategory }
            ];
            
            // Mock category find
            categoryModel.findOne = jest.fn().mockResolvedValue(mockCategory);
            
            // Mock products find
            productModel.find = jest.fn().mockReturnThis();
            productModel.populate = jest.fn().mockResolvedValue(mockProducts);
            
            await productCategoryController(mockReq, mockRes);
            
            // Verify category was found by slug
            expect(categoryModel.findOne).toHaveBeenCalledWith({ slug: "test-category" });
            
            // Verify products were found by category
            expect(productModel.find).toHaveBeenCalledWith({ category: mockCategory });
            expect(productModel.populate).toHaveBeenCalledWith("category");
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                category: mockCategory,
                products: mockProducts
            });
        });
        
        it("should handle error during category product retrieval", async () => {
            // Setup request
            mockReq.params = { slug: "test-category" };
            
            // Mock error during category find
            const error = new Error("Database error");
            categoryModel.findOne = jest.fn().mockImplementation(() => {
                throw error;
            });
            
            // Mock console.log
            console.log = jest.fn();
            
            await productCategoryController(mockReq, mockRes);
            
            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(error);
            
            // Verify error response
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                error: error,
                success: false,
                message: "Error While Getting products"
            });
        });

        it("should handle errors during category-based product retrieval", async () => {
            // Mock request with category slug
            mockReq.params = { slug: "test-category" };
            
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            const error = new Error("Database error");
            categoryModel.findOne = jest.fn().mockImplementation(() => {
                throw error;
            });

            await productCategoryController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                error,
                message: "Error While Getting products"
            });
        });
    });

    describe("getProductController", () => {
        it("should get all products", async () => {
            const mockProducts = [
                { _id: "product1", name: "Product 1" },
                { _id: "product2", name: "Product 2" }
            ];
            
            productModel.find = jest.fn().mockReturnThis();
            productModel.populate = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockReturnThis();
            productModel.limit = jest.fn().mockReturnThis();
            productModel.sort = jest.fn().mockResolvedValue(mockProducts);
            
            await getProductController(mockReq, mockRes);
            
            expect(productModel.find).toHaveBeenCalledWith({});
            expect(productModel.populate).toHaveBeenCalledWith("category");
            expect(productModel.select).toHaveBeenCalledWith("-photo");
            expect(productModel.limit).toHaveBeenCalledWith(12);
            expect(productModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
            
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                counTotal: 2,
                message: "ALlProducts ",
                products: mockProducts
            });
        });

        it("should handle errors during product retrieval", async () => {
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            productModel.find = jest.fn().mockImplementation(() => {
                throw new Error("Product retrieval failed");
            });

            await getProductController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Erorr in getting products",
                error: "Product retrieval failed"
            });
        });
    });
    
    describe("getSingleProductController", () => {
        it("should get a single product by slug", async () => {
            mockReq.params = { slug: "test-product" };
            
            const mockProduct = { _id: "product1", name: "Test Product", slug: "test-product" };
            
            productModel.findOne = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockReturnThis();
            productModel.populate = jest.fn().mockResolvedValue(mockProduct);
            
            await getSingleProductController(mockReq, mockRes);
            
            expect(productModel.findOne).toHaveBeenCalledWith({ slug: "test-product" });
            expect(productModel.select).toHaveBeenCalledWith("-photo");
            expect(productModel.populate).toHaveBeenCalledWith("category");
            
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: "Single Product Fetched",
                product: mockProduct
            });
        });

        it("should handle errors during single product retrieval", async () => {
            // Mock request with slug
            mockReq.params = { slug: "test-product" };
            
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            productModel.findOne = jest.fn().mockImplementation(() => {
                throw new Error("Single product retrieval failed");
            });

            await getSingleProductController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Eror while getitng single product",
                error: expect.any(Error)
            });
        });
    });

    describe("productPhotoController", () => {
        it("should return product photo", async () => {
            mockReq.params = { pid: "product1" };
            
            const mockProduct = { 
                _id: "product1", 
                photo: { 
                    data: Buffer.from("test-image"), 
                    contentType: "image/jpeg" 
                } 
            };
            
            productModel.findById = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockResolvedValue(mockProduct);
            
            // Add set method to mockRes
            mockRes.set = jest.fn();
            
            await productPhotoController(mockReq, mockRes);
            
            expect(productModel.findById).toHaveBeenCalledWith("product1");
            expect(productModel.select).toHaveBeenCalledWith("photo");
            
            expect(mockRes.set).toHaveBeenCalledWith("Content-type", mockProduct.photo.contentType);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(mockProduct.photo.data);
        });

        it("should handle errors during photo retrieval", async () => {
            // Mock request with product ID
            mockReq.params = { pid: "test-product-id" };
            
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            productModel.findById = jest.fn().mockImplementation(() => {
                throw new Error("Photo retrieval failed");
            });

            await productPhotoController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Erorr while getting photo",
                error: expect.any(Error)
            });
        });
    });

    describe("productFiltersController", () => {
        beforeEach(() => {
            // Import the function
            mockReq.body = {
                checked: [],
                radio: []
            };
        });

        it("should filter products by category", async () => {
            // Setup request with category filter
            mockReq.body.checked = ["category1", "category2"];
            
            const mockProducts = [
                { _id: "product1", name: "Product 1", category: "category1" },
                { _id: "product2", name: "Product 2", category: "category2" }
            ];
            
            productModel.find = jest.fn().mockResolvedValue(mockProducts);
            
            await productFiltersController(mockReq, mockRes);
            
            expect(productModel.find).toHaveBeenCalledWith({ category: ["category1", "category2"] });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });
        
        it("should filter products by price range", async () => {
            // Setup request with price filter
            mockReq.body.radio = [0, 1000];
            
            const mockProducts = [
                { _id: "product1", name: "Product 1", price: 500 },
                { _id: "product2", name: "Product 2", price: 800 }
            ];
            
            productModel.find = jest.fn().mockResolvedValue(mockProducts);
            
            await productFiltersController(mockReq, mockRes);
            
            expect(productModel.find).toHaveBeenCalledWith({ price: { $gte: 0, $lte: 1000 } });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });
        
        it("should filter products by both category and price range", async () => {
            // Setup request with both filters
            mockReq.body.checked = ["category1"];
            mockReq.body.radio = [0, 1000];
            
            const mockProducts = [
                { _id: "product1", name: "Product 1", category: "category1", price: 500 }
            ];
            
            productModel.find = jest.fn().mockResolvedValue(mockProducts);
            
            await productFiltersController(mockReq, mockRes);
            
            expect(productModel.find).toHaveBeenCalledWith({
                category: ["category1"],
                price: { $gte: 0, $lte: 1000 }
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });

        it("should handle errors during product filtering", async () => {
            // Mock request with filter criteria
            mockReq.body = {
                checked: ["category1", "category2"],
                radio: 100
            };
            
            // Mock console.log to prevent actual logging
            console.log = jest.fn();
            
            // Create a mock implementation that simulates an error
            productModel.find = jest.fn().mockImplementation(() => {
                throw new Error("Product filtering failed");
            });

            await productFiltersController(mockReq, mockRes);

            // Verify error was logged
            expect(console.log).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Error WHile Filtering Products",
                error: expect.any(Error)
            });
        });
    });

    describe("braintreeTokenController", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            mockRes.status.mockReturnThis();
            mockRes.send.mockReturnThis();
        });
        
        it("should generate a client token successfully", async () => {
            // Mock successful token generation
            const mockResponse = { clientToken: "mock-client-token" };
            gateway.clientToken.generate.mockImplementation((options, callback) => {
                callback(null, mockResponse);
            });
            
            await braintreeTokenController(mockReq, mockRes);
            
            // Verify clientToken.generate was called
            expect(gateway.clientToken.generate).toHaveBeenCalledWith({}, expect.any(Function));
            
            // Verify response
            expect(mockRes.send).toHaveBeenCalledWith(mockResponse);
        });
        
        it("should handle error during token generation", async () => {
            // Mock error during token generation
            const mockError = new Error("Token generation failed");
            gateway.clientToken.generate.mockImplementation((options, callback) => {
                callback(mockError, null);
                return { success: false };
            });
            
            await braintreeTokenController(mockReq, mockRes);
            
            // Verify clientToken.generate was called
            expect(gateway.clientToken.generate).toHaveBeenCalledWith({}, expect.any(Function));
            
            // Verify error response
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith(mockError);
        });
        
        it("should handle exceptions during token generation", async () => {
            // Mock exception during token generation
            const mockError = new Error("Unexpected error");
            gateway.clientToken.generate.mockImplementation(() => {
                throw mockError;
            });
            
            // Mock console.log
            console.log = jest.fn();
            
            await braintreeTokenController(mockReq, mockRes);
            
            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(mockError);
        });
    });
    
    describe("brainTreePaymentController", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            mockRes.status.mockReturnThis();
            mockRes.send.mockReturnThis();
            mockRes.json = jest.fn();
        });
        
        it("should process payment successfully", async () => {
            // Setup request with nonce and cart
            mockReq.body = {
                nonce: "mock-payment-nonce",
                cart: [
                    { _id: "product1", name: "Product 1", price: 100 },
                    { _id: "product2", name: "Product 2", price: 200 }
                ]
            };
            
            // Setup user
            mockReq.user = { _id: "user123" };
            
            // Mock successful transaction
            const mockResult = { 
                success: true, 
                transaction: { id: "transaction123" } 
            };
            
            gateway.transaction.sale.mockImplementation((options, callback) => {
                callback(null, mockResult);
                return { success: true };
            });
            
            // Mock order creation
            const mockSave = jest.fn().mockResolvedValue({ _id: "order123" });
            orderModel.mockImplementation(() => {
                return { save: mockSave };
            });
            
            await brainTreePaymentController(mockReq, mockRes);
            
            // Verify transaction was created with correct parameters
            expect(gateway.transaction.sale).toHaveBeenCalledWith({
                amount: 300, // 100 + 200
                paymentMethodNonce: "mock-payment-nonce",
                options: {
                    submitForSettlement: true
                }
            }, expect.any(Function));
            
            // Verify order was created
            expect(orderModel).toHaveBeenCalledWith({
                products: mockReq.body.cart,
                payment: mockResult,
                buyer: "user123"
            });
            expect(mockSave).toHaveBeenCalled();
            
            // Verify response
            expect(mockRes.json).toHaveBeenCalledWith({ ok: true });
        });
        
        it("should handle transaction failure", async () => {
            // Setup request with nonce and cart
            mockReq.body = {
                nonce: "mock-payment-nonce",
                cart: [
                    { _id: "product1", name: "Product 1", price: 100 }
                ]
            };
            
            // Setup user
            mockReq.user = { _id: "user123" };
            
            // Mock transaction failure
            const mockError = new Error("Transaction failed");
            gateway.transaction.sale.mockImplementation((options, callback) => {
                callback(mockError, null);
                return { success: false };
            });
            
            await brainTreePaymentController(mockReq, mockRes);
            
            // Verify error response
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith(mockError);
        });
        
        it("should handle exceptions during payment processing", async () => {
            // Setup request with nonce and cart
            mockReq.body = {
                nonce: "mock-payment-nonce",
                cart: [
                    { _id: "product1", name: "Product 1", price: 100 }
                ]
            };
            
            // Mock exception during payment processing
            const mockError = new Error("Unexpected error");
            gateway.transaction.sale.mockImplementation(() => {
                throw mockError;
            });
            
            // Mock console.log
            console.log = jest.fn();
            
            await brainTreePaymentController(mockReq, mockRes);
            
            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(mockError);
        });
    });
});
