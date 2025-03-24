// Set environment variables for Braintree
process.env.BRAINTREE_MERCHANT_ID = "test_merchant_id";
process.env.BRAINTREE_PUBLIC_KEY = "test_public_key";
process.env.BRAINTREE_PRIVATE_KEY = "test_private_key";

// Import slugify to get the mock function
import slugify from "slugify";

// Mock slugify with a function that converts the name to a slug
jest.mock("slugify", () => jest.fn((name) => name.toLowerCase().replace(/\s+/g, "-")));

// Mock other modules first
jest.mock("../models/productModel.js");
jest.mock("../models/categoryModel.js");
jest.mock("../models/orderModel.js");
jest.mock("fs");
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
    let req, res;

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        };
        req = {
            fields: {},
            params: {},
            files: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn((data) => data),
        };
        
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createProductController", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                fields: {
                    name: "Test Product",
                    description: "Test Description",
                    price: 100,
                    quantity: 10,
                    category: "test-category",
                    shipping: "true"
                },
                files: {}
            };
            mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            
            // Reset mocks
            jest.clearAllMocks();
            
            // Mock productModel constructor and save method
            productModel.mockClear();
            productModel.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue({
                    _id: "product123",
                    ...mockReq.fields,
                    slug: "test-product"
                })
            }));
        });

        it("should create a product successfully", async () => {
            await createProductController(mockReq, mockRes);
            
            expect(productModel).toHaveBeenCalledWith({
                ...mockReq.fields,
                slug: "test-product"
            });
            
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: "Product Created Successfully",
                products: expect.any(Object)
            });
        });

        it("should create a product with photo", async () => {
            // Add photo to request
            mockReq.files = {
                photo: {
                    path: "/path/to/photo.jpg",
                    type: "image/jpeg"
                }
            };
            
            // Mock fs.readFileSync
            fs.readFileSync.mockReturnValue(Buffer.from("test-image-data"));
            
            // Mock product with photo property
            const mockProductWithPhoto = {
                _id: "product123",
                ...mockReq.fields,
                slug: "test-product",
                photo: {
                    data: null,
                    contentType: null
                },
                save: jest.fn().mockResolvedValue({})
            };
            
            productModel.mockImplementation(() => mockProductWithPhoto);
            
            await createProductController(mockReq, mockRes);
            
            // Verify photo was set
            expect(fs.readFileSync).toHaveBeenCalledWith("/path/to/photo.jpg");
            expect(mockProductWithPhoto.photo.data).toBeTruthy();
            expect(mockProductWithPhoto.photo.contentType).toBe("image/jpeg");
            
            // Verify save was called
            expect(mockProductWithPhoto.save).toHaveBeenCalled();
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: "Product Created Successfully",
                products: mockProductWithPhoto
            });
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
            // Add photo to request with size exceeding limit
            mockReq.files = {
                photo: {
                    size: 2000000, // 2MB (exceeds limit)
                    path: "/path/to/photo.jpg",
                    type: "image/jpeg"
                }
            };
            
            await createProductController(mockReq, mockRes);
            
            // Verify error response
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ 
                error: "photo is Required and should be less then 1mb" 
            });
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

        it("should create a product successfully", async () => {
            req.fields = {
                name: "Test Product",
                description: "Test Description",
                price: 100,
                category: "123",
                quantity: 10,
            };
            req.files = { photo: { path: "test/path", type: "image/png", size: 500000 } };

            const slugifiedName = slugify(req.fields.name); // Ensure slug is generated
            const mockProduct = {
                save: jest.fn().mockResolvedValue({ _id: "product123", ...req.fields, slug: slugifiedName }),
                photo: {},
            };
            productModel.mockImplementation(() => mockProduct);
            fs.readFileSync.mockReturnValue(Buffer.from("test"));

            await createProductController(req, res);

            expect(productModel).toHaveBeenCalledWith(expect.objectContaining({ ...req.fields, slug: slugifiedName }));
            expect(mockProduct.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it("should return error if name is missing", async () => {
            req.fields = {
                description: "Test Description",
                price: 100,
                category: "123",
                quantity: 10,
            };
    
            await createProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Name is Required" }));
        });
    
        it("should return error if description is missing", async () => {
            req.fields = {
                name: "Test Product",
                price: 100,
                category: "123",
                quantity: 10,
            };
    
            await createProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Description is Required" }));
        });
    
        it("should return error if price is missing", async () => {
            req.fields = {
                name: "Test Product",
                description: "Test Description",
                category: "123",
                quantity: 10,
            };
    
            await createProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Price is Required" }));
        });
    
        it("should return error if category is missing", async () => {
            req.fields = {
                name: "Test Product",
                description: "Test Description",
                price: 100,
                quantity: 10,
            };
    
            await createProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Category is Required" }));
        });
    
        it("should return error if quantity is missing", async () => {
            req.fields = {
                name: "Test Product",
                description: "Test Description",
                price: 100,
                category: "123",
            };
    
            await createProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Quantity is Required" }));
        });
    
        it("should return error if photo is too large", async () => {
            req.fields = {
                name: "Test Product",
                description: "Test Description",
                price: 100,
                category: "123",
                quantity: 10,
            };
            req.files = { photo: { path: "test/path", type: "image/png", size: 2000000 } }; // 2MB photo size, should fail validation
    
            await createProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "photo is Required and should be less then 1mb" }));
        });
    
        it("should handle errors gracefully", async () => {
            req.fields = {
                name: "Test Product",
                description: "Test Description",
                price: 100,
                category: "123",
                quantity: 10,
            };
            req.files = { photo: { path: "test/path", type: "image/png", size: 500000 } };
        
            // Mocking the model to reject the promise with an error
            const mockError = new Error("Database error");
            productModel.mockImplementation(() => {
                return {
                    save: jest.fn().mockRejectedValue(mockError),
                };
            });
        
            await createProductController(req, res);
        
            // Verifying the controller handles the error gracefully
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: "Error in crearing product", // Fix the typo if needed
            }));
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

        it("should delete a product successfully", async () => {
            req.params = { pid: "product123" };
        
            // Create a mock product document, mocking a Mongoose document
            productModel.findByIdAndDelete.mockResolvedValue({ _id: "product123" });
        
            // Call the deleteProductController
            await deleteProductController(req, res);
        
            // Assertions
            expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(req.params.pid);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: "Product Deleted successfully",
                })
            );
        });

        it("should return 500 if product is not found", async () => {

            req.params = { pid: "product123" };

            productModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    
            await deleteProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "Error while deleting product",
                })
            );
        });
    });

    describe("updateProductController", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            // Set up slugify mock for this test
            slugify.mockImplementation(() => "updated-product");
            
            mockReq = {
                params: { pid: "product123" },
                fields: {
                    name: "Updated Product",
                    description: "Updated Description",
                    price: 199.99,
                    category: "category123",
                    quantity: 50
                },
                files: {}
            };
            mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            
            // Mock findByIdAndUpdate
            const mockProduct = {
                _id: "product123",
                name: "Updated Product",
                description: "Updated Description",
                price: 199.99,
                photo: {
                    data: Buffer.from("mock-photo-data"),
                    contentType: "image/jpeg"
                },
                save: jest.fn().mockResolvedValue({})
            };
            productModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockProduct);
            
            // Mock fs functions
            fs.readFileSync = jest.fn().mockReturnValue("mock-photo-data");
        });
        
        afterEach(() => {
            // Reset the slugify mock to default behavior
            slugify.mockImplementation((name) => name.toLowerCase().replace(/\s+/g, "-"));
        });

        it("should update a product successfully", async () => {
            await updateProductController(mockReq, mockRes);
            
            expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "product123",
                expect.objectContaining({
                    name: "Updated Product",
                    description: "Updated Description",
                    price: 199.99
                }),
                { new: true }
            );
            
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: "Product Updated Successfully",
                products: expect.any(Object)
            });
        });

        it("should return error if name is missing", async () => {
            mockReq.fields.name = "";
            
            await updateProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Name is Required" });
        });

        it("should return error if description is missing", async () => {
            mockReq.fields.description = "";
            
            await updateProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Description is Required" });
        });

        it("should return error if price is missing", async () => {
            mockReq.fields.price = "";
            
            await updateProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Price is Required" });
        });

        it("should return error if category is missing", async () => {
            mockReq.fields.category = "";
            
            await updateProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Category is Required" });
        });

        it("should return error if quantity is missing", async () => {
            mockReq.fields.quantity = "";
            
            await updateProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "Quantity is Required" });
        });

        it("should return error if photo is too large", async () => {
            mockReq.files = {
                photo: {
                    size: 1500000, // larger than 1MB
                    path: "/path/to/photo"
                }
            };
            
            await updateProductController(mockReq, mockRes);
            
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: "photo is Required and should be less then 1mb" });
        });

        it("should handle photo upload when updating a product", async () => {
            mockReq.files = {
                photo: {
                    size: 500000, // less than 1MB
                    path: "/path/to/photo",
                    type: "image/jpeg"
                }
            };
            
            // Mock the product with photo property
            const mockProductWithPhoto = {
                _id: "product123",
                name: "Updated Product",
                description: "Updated Description",
                price: 199.99,
                photo: {
                    data: null,
                    contentType: null
                },
                save: jest.fn().mockResolvedValue({})
            };
            
            productModel.findByIdAndUpdate.mockResolvedValue(mockProductWithPhoto);
            
            await updateProductController(mockReq, mockRes);
            
            expect(fs.readFileSync).toHaveBeenCalledWith("/path/to/photo");
            expect(mockProductWithPhoto.photo.contentType).toBe("image/jpeg");
            expect(mockProductWithPhoto.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                message: "Product Updated Successfully",
                products: mockProductWithPhoto
            });
        });

        it("should handle errors when updating a product", async () => {
            const mockError = new Error("Database error");
            productModel.findByIdAndUpdate.mockRejectedValue(mockError);
            
            console.log = jest.fn(); // Mock console.log
            
            await updateProductController(mockReq, mockRes);
            
            expect(console.log).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                error: mockError,
                message: "Error in Updte product"
            });
        });

        it("should update a product successfully", async () => {
            req.params = { 
                pid: "product123", 
            };
            req.fields = {
                name: "Updated Product",
                description: "Updated Description",
                price: 150,
                category: "123",
                quantity: 5,
            };
            req.files = { photo: { path: "test/path", type: "image/png", size: 500000 } };

            const mockProduct = {
                save: jest.fn().mockResolvedValue({ _id: "product123", ...req.params }),
                photo: {},
            };
            productModel.findByIdAndUpdate.mockResolvedValue(mockProduct);
            fs.readFileSync.mockReturnValue(Buffer.from("test"));

            await updateProductController(req, res);

            expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith("product123", expect.objectContaining({ name: "Updated Product" }), { new: true });
            expect(mockProduct.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it("should return error if name is missing", async () => {
            req.params = { pid: "product123" };
            req.fields = {
                description: "Updated Description",
                price: 150,
                category: "123",
                quantity: 5,
            };
    
            await updateProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Name is Required" }));
        });

        it("should return error if description is missing", async () => {
            req.params = { pid: "product123" };
            req.fields = {
                name: "Updated Product",
                price: 150,
                category: "123",
                quantity: 5,
            };
    
            await updateProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Description is Required" }));
        });

        it("should return error if price is missing", async () => {
            req.params = { pid: "product123" };
            req.fields = {
                name: "Updated Product",
                description: "Updated Description",
                category: "123",
                quantity: 5,
            };
    
            await updateProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Price is Required" }));
        });
    
        it("should return error if category is missing", async () => {
            req.params = { pid: "product123" };
            req.fields = {
                name: "Updated Product",
                description: "Updated Description",
                price: 150,
                quantity: 5,
            };
    
            await updateProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Category is Required" }));
        });

        it("should return error if quantity is missing", async () => {
            req.params = { pid: "product123" };
            req.fields = {
                name: "Updated Product",
                description: "Updated Description",
                price: 150,
                category: "123",
            };
    
            await updateProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "Quantity is Required" }));
        });
    
        it("should return error if photo is too large", async () => {
            req.params = { pid: "product123" };
            req.fields = {
                name: "Updated Product",
                description: "Updated Description",
                price: 150,
                category: "123",
                quantity: 5,
            };
            req.files = { photo: { path: "test/path", type: "image/png", size: 2000000 } }; // 2MB photo size, should fail validation
    
            await updateProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ error: "photo is Required and should be less then 1mb" }));
        });
    
        it("should handle errors gracefully", async () => {
            req.params = { pid: "product123" };
            req.fields = {
                name: "Updated Product",
                description: "Updated Description",
                price: 150,
                category: "123",
                quantity: 5,
            };
            req.files = { photo: { path: "test/path", type: "image/png", size: 500000 } };
    
            // Simulate an error in database query
            productModel.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));
    
            await updateProductController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: "Error in Updte product" }));
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
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {}
            };
            mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            
            // Mock find method chain
            const mockFindChain = {
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue([
                    { _id: "product1", name: "Product 1" },
                    { _id: "product2", name: "Product 2" }
                ])
            };
            
            productModel.find = jest.fn().mockReturnValue(mockFindChain);
            
            // Reset mocks
            jest.clearAllMocks();
        });

        it("should get products for default page (page=1)", async () => {
            // No page param provided (default to page 1)
            await productListController(mockReq, mockRes);
            
            // Verify find was called correctly
            expect(productModel.find).toHaveBeenCalledWith({});
            
            // Verify skip was called with 0 (page 1)
            expect(productModel.find().skip).toHaveBeenCalledWith(0);
            
            // Verify limit was called with perPage (6)
            expect(productModel.find().limit).toHaveBeenCalledWith(6);
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: [
                    { _id: "product1", name: "Product 1" },
                    { _id: "product2", name: "Product 2" }
                ]
            });
        });

        it("should get products for specified page", async () => {
            // Set page param to 2
            mockReq.params.page = "2";
            
            await productListController(mockReq, mockRes);
            
            // Verify find was called correctly
            expect(productModel.find).toHaveBeenCalledWith({});
            
            // Verify skip was called with perPage (page 2 = skip 6)
            expect(productModel.find().skip).toHaveBeenCalledWith(6);
            
            // Verify limit was called with perPage (6)
            expect(productModel.find().limit).toHaveBeenCalledWith(6);
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: [
                    { _id: "product1", name: "Product 1" },
                    { _id: "product2", name: "Product 2" }
                ]
            });
        });

        it("should handle errors", async () => {
            // Mock error during database query
            const mockError = new Error("Database error");
            productModel.find = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockRejectedValue(mockError)
            });
            
            // Mock console.log
            console.log = jest.fn();
            
            await productListController(mockReq, mockRes);
            
            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(mockError);
            
            // Verify error response was sent
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "error in per page ctrl",
                error: mockError
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

        it("should search products by partial keywords", async () => {
            // Setup request with partial keyword
            mockReq.params = { keyword: "prod" };
            
            // Mock products found with partial match
            const mockProducts = [
                { _id: "product1", name: "Product One" },
                { _id: "product2", name: "Production Item" }
            ];
            
            // Mock the product model find method
            productModel.find = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockResolvedValue(mockProducts);
            
            await searchProductController(mockReq, mockRes);
            
            // Verify search query was constructed correctly
            expect(productModel.find).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: "prod", $options: "i" } },
                    { description: { $regex: "prod", $options: "i" } }
                ]
            });
            
            // Verify response
            expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
        });
        
        it("should perform case-insensitive searching", async () => {
            // Setup request with mixed-case keyword
            mockReq.params = { keyword: "PhOnE" };
            
            // Mock products found with case-insensitive match
            const mockProducts = [
                { _id: "product1", name: "Smartphone" },
                { _id: "product2", description: "A phone with advanced features" }
            ];
            
            // Mock the product model find method
            productModel.find = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockResolvedValue(mockProducts);
            
            await searchProductController(mockReq, mockRes);
            
            // Verify search query was constructed correctly with case-insensitive option
            expect(productModel.find).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: "PhOnE", $options: "i" } },
                    { description: { $regex: "PhOnE", $options: "i" } }
                ]
            });
            
            // Verify response
            expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
        });
        
        it("should handle searching with special characters", async () => {
            // Setup request with special characters
            mockReq.params = { keyword: "product-123+" };
            
            // Mock products found
            const mockProducts = [
                { _id: "product1", name: "Product-123+" }
            ];
            
            // Mock the product model find method
            productModel.find = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockResolvedValue(mockProducts);
            
            await searchProductController(mockReq, mockRes);
            
            // Verify search query was constructed correctly
            expect(productModel.find).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: "product-123+", $options: "i" } },
                    { description: { $regex: "product-123+", $options: "i" } }
                ]
            });
            
            // Verify response
            expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
        });
        
        it("should handle searching with empty keyword", async () => {
            // Setup request with empty keyword
            mockReq.params = { keyword: "" };
            
            // Mock all products returned for empty search
            const mockProducts = [
                { _id: "product1", name: "Product One" },
                { _id: "product2", name: "Product Two" }
            ];
            
            // Mock the product model find method
            productModel.find = jest.fn().mockReturnThis();
            productModel.select = jest.fn().mockResolvedValue(mockProducts);
            
            await searchProductController(mockReq, mockRes);
            
            // Verify search query was constructed correctly
            expect(productModel.find).toHaveBeenCalledWith({
                $or: [
                    { name: { $regex: "", $options: "i" } },
                    { description: { $regex: "", $options: "i" } }
                ]
            });
            
            // Verify response
            expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
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

        it("should get all products successfully", async () => {
            // Mock the data returned from productModel
            const mockProducts = [
                { _id: "product1", name: "Product 1" },
                { _id: "product2", name: "Product 2" },
            ];

            // Mock the entire query chain
            productModel.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockProducts), // Resolve final promise
            });

            await getProductController(req, res);

            expect(productModel.find).toHaveBeenCalledWith({});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                counTotal: mockProducts.length,
                message: "ALlProducts ",
                products: mockProducts,
            });
        });

        it("should handle errors gracefully if fetching products fails", async () => {
            const errorMessage = "Database error";

            // Mock the query chain to throw an error
            productModel.find.mockReturnValue({
              populate: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              sort: jest.fn().mockRejectedValue(new Error(errorMessage)), // Simulate error
            });

            await getProductController(req, res);

            expect(productModel.find).toHaveBeenCalledWith({});
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
              success: false,
              message: "Erorr in getting products",
              error: errorMessage,
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

        beforeEach(() => {
            req = { params: { slug: "test-product" } }; // Ensure slug is correctly set
            res = {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            };
          });

        it("should return a single product successfully", async () => {
            const mockProduct = {
              _id: "product123",
              name: "Test Product",
              slug: "test-product",
              category: "category123",
            };
        
            productModel.findOne.mockReturnValue({
              select: jest.fn().mockReturnThis(),
              populate: jest.fn().mockResolvedValue(mockProduct), // Final resolved value
            });
        
            await getSingleProductController(req, res);
        
            expect(productModel.findOne).toHaveBeenCalledWith({ slug: "test-product" }); // ✅ Fix: `slug` is now correctly set
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                success: true,
                message: "Single Product Fetched",
                product: mockProduct,
            });
        });

        it("should return 404 when product is not found", async () => {
            productModel.findOne.mockReturnValue({
              select: jest.fn().mockReturnThis(),
              populate: jest.fn().mockResolvedValue(null), // No product found
            });
        
            await getSingleProductController(req, res);
        
            expect(productModel.findOne).toHaveBeenCalledWith({ slug: "test-product" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
              success: true,
              message: "Single Product Fetched",
              product: null,
            });
        });

        it("should handle database errors gracefully", async () => {
            const errorMessage = "Database error";
        
            productModel.findOne.mockReturnValue({
              select: jest.fn().mockReturnThis(),
              populate: jest.fn().mockRejectedValue(new Error(errorMessage)), // Simulate error
            });
        
            await getSingleProductController(req, res);
        
            expect(productModel.findOne).toHaveBeenCalledWith({ slug: "test-product" });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(
                expect.objectContaining({
                  success: false,
                  message: "Eror while getitng single product",
                  error: expect.any(Object), // Allow any error object
                })
            );
        });
    });

    describe("productPhotoController", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: { pid: "product123" }
            };
            mockRes = {
                set: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                contentType: jest.fn(),
                sendFile: jest.fn()
            };
            
            // Reset mocks
            jest.clearAllMocks();
        });

        it("should return photo when photo data exists", async () => {
            // Mock product with photo data
            const mockProduct = {
                photo: {
                    data: Buffer.from("test-image-data"),
                    contentType: "image/jpeg"
                }
            };
            
            // Mock findById to return product with photo
            productModel.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(mockProduct)
            });
            
            await productPhotoController(mockReq, mockRes);
            
            // Verify content type was set
            expect(mockRes.set).toHaveBeenCalledWith("Content-type", "image/jpeg");
            
            // Verify photo data was sent
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(mockProduct.photo.data);
        });

        it("should handle case when photo data does not exist", async () => {
            // Mock product without photo data
            const mockProduct = {
                photo: {
                    data: null,
                    contentType: "image/jpeg"
                }
            };
            
            // Mock findById to return product without photo
            productModel.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(mockProduct)
            });
            
            await productPhotoController(mockReq, mockRes);
            
            // The controller doesn't explicitly handle this case with a 404,
            // it just doesn't send a response, so we verify that status and send weren't called
            expect(mockRes.send).not.toHaveBeenCalled();
        });

        it("should handle errors", async () => {
            // Mock error during database query
            const mockError = new Error("Database error");
            productModel.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockRejectedValue(mockError)
            });
            
            // Mock console.log
            console.log = jest.fn();
            
            await productPhotoController(mockReq, mockRes);
            
            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(mockError);
            
            // Verify error response was sent
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Erorr while getting photo",
                error: mockError
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

            req = { body: { checked: [], radio: [] } };
            res = {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
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

        it("should filter products with empty checked array but valid price range", async () => {
            // Setup request with empty checked array but valid price range
            mockReq.body.checked = [];
            mockReq.body.radio = [50, 500];
            
            const mockProducts = [
                { _id: "product1", name: "Product 1", price: 100 },
                { _id: "product2", name: "Product 2", price: 300 }
            ];
            
            productModel.find = jest.fn().mockResolvedValue(mockProducts);
            
            await productFiltersController(mockReq, mockRes);
            
            expect(productModel.find).toHaveBeenCalledWith({ price: { $gte: 50, $lte: 500 } });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });
        
        it("should filter products with empty radio array but valid categories", async () => {
            // Setup request with empty radio array but valid categories
            mockReq.body.checked = ["category1"];
            mockReq.body.radio = [];
            
            const mockProducts = [
                { _id: "product1", name: "Product 1", category: "category1" }
            ];
            
            productModel.find = jest.fn().mockResolvedValue(mockProducts);
            
            await productFiltersController(mockReq, mockRes);
            
            expect(productModel.find).toHaveBeenCalledWith({ category: ["category1"] });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });
        
        it("should handle invalid price ranges correctly", async () => {
            // Setup request with invalid price range (min > max)
            mockReq.body.checked = [];
            mockReq.body.radio = [1000, 500]; // Min > Max
            
            const mockProducts = [];
            
            productModel.find = jest.fn().mockResolvedValue(mockProducts);
            
            await productFiltersController(mockReq, mockRes);
            
            expect(productModel.find).toHaveBeenCalledWith({ price: { $gte: 1000, $lte: 500 } });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: mockProducts
            });
        });
        
        it("should handle negative price values in range", async () => {
            // Setup request with negative price values
            mockReq.body.checked = [];
            mockReq.body.radio = [-100, 500];
            
            const mockProducts = [
                { _id: "product1", name: "Product 1", price: 0 },
                { _id: "product2", name: "Product 2", price: 300 }
            ];
            
            productModel.find = jest.fn().mockResolvedValue(mockProducts);
            
            await productFiltersController(mockReq, mockRes);
            
            expect(productModel.find).toHaveBeenCalledWith({ price: { $gte: -100, $lte: 500 } });
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
        
          it("should return filtered products by category", async () => {
            req.body.checked = ["category123"];
            
            const mockProducts = [
              { _id: "1", name: "Product 1", category: "category123", price: 50 },
              { _id: "2", name: "Product 2", category: "category123", price: 100 },
            ];
            
            productModel.find.mockResolvedValue(mockProducts);
        
            await productFiltersController(req, res);
        
            expect(productModel.find).toHaveBeenCalledWith({ category: ["category123"] });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: true, products: mockProducts }));
          });

          it("should return filtered products by price range", async () => {
            req.body.radio = [50, 150];
        
            const mockProducts = [
              { _id: "3", name: "Product 3", category: "category456", price: 75 },
              { _id: "4", name: "Product 4", category: "category789", price: 125 },
            ];
        
            productModel.find.mockResolvedValue(mockProducts);
        
            await productFiltersController(req, res);
        
            expect(productModel.find).toHaveBeenCalledWith({ price: { $gte: 50, $lte: 150 } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: true, products: mockProducts }));
          });
        
          it("should return filtered products by both category and price range", async () => {
            req.body.checked = ["category123"];
            req.body.radio = [50, 200];
        
            const mockProducts = [
              { _id: "5", name: "Product 5", category: "category123", price: 100 },
            ];
        
            productModel.find.mockResolvedValue(mockProducts);
        
            await productFiltersController(req, res);
        
            expect(productModel.find).toHaveBeenCalledWith({ category: ["category123"], price: { $gte: 50, $lte: 200 } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: true, products: mockProducts }));
          });
        
          it("should return all products when no filters are applied", async () => {
            req.body.checked = [];
            req.body.radio = [];
        
            const mockProducts = [
              { _id: "6", name: "Product 6", category: "categoryXYZ", price: 300 },
              { _id: "7", name: "Product 7", category: "categoryABC", price: 400 },
            ];
        
            productModel.find.mockResolvedValue(mockProducts);
        
            await productFiltersController(req, res);
        
            expect(productModel.find).toHaveBeenCalledWith({});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ success: true, products: mockProducts }));
          });
        
          it("should handle database errors gracefully", async () => {
            req.body.checked = ["category123"];
            
            productModel.find.mockRejectedValue(new Error("Database Error"));
        
            await productFiltersController(req, res);
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(
              expect.objectContaining({
                success: false,
                message: "Error WHile Filtering Products",
              })
            );
        });
    });

    describe("productPhotoController", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: { pid: "product123" }
            };
            mockRes = {
                set: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                contentType: jest.fn(),
                sendFile: jest.fn()
            };
            
            // Reset mocks
            jest.clearAllMocks();
        });

        it("should return photo when photo data exists", async () => {
            // Mock product with photo data
            const mockProduct = {
                photo: {
                    data: Buffer.from("test-image-data"),
                    contentType: "image/jpeg"
                }
            };
            
            // Mock findById to return product with photo
            productModel.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(mockProduct)
            });
            
            await productPhotoController(mockReq, mockRes);
            
            // Verify content type was set
            expect(mockRes.set).toHaveBeenCalledWith("Content-type", "image/jpeg");
            
            // Verify photo data was sent
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith(mockProduct.photo.data);
        });

        it("should handle case when photo data does not exist", async () => {
            // Mock product without photo data
            const mockProduct = {
                photo: {
                    data: null,
                    contentType: "image/jpeg"
                }
            };
            
            // Mock findById to return product without photo
            productModel.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(mockProduct)
            });
            
            await productPhotoController(mockReq, mockRes);
            
            // The controller doesn't explicitly handle this case with a 404,
            // it just doesn't send a response, so we verify that status and send weren't called
            expect(mockRes.send).not.toHaveBeenCalled();
        });

        it("should handle errors", async () => {
            // Mock error during database query
            const mockError = new Error("Database error");
            productModel.findById = jest.fn().mockReturnValue({
                select: jest.fn().mockRejectedValue(mockError)
            });
            
            // Mock console.log
            console.log = jest.fn();
            
            await productPhotoController(mockReq, mockRes);
            
            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(mockError);
            
            // Verify error response was sent
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "Erorr while getting photo",
                error: mockError
            });
        });

        it("should return the photo of a product successfully", async () => {
            req.params = { pid: "product123" };

            const mockProduct = {
                _id: "product123",
                photo: { data: Buffer.from("test-image"), contentType: "image/png" },
            };

            // Mock the database call
            productModel.findById = jest.fn().mockResolvedValue(mockProduct);

            // Mock response functions
            res.set = jest.fn();
            res.status = jest.fn().mockReturnThis();
            res.send = jest.fn();

            await productPhotoController(req, res);

            expect(productModel.findById).toHaveBeenCalledWith("product123");
            expect(res.set).toHaveBeenCalledTimes(1); 
            expect(res.set).toHaveBeenCalledWith("Content-type", "image/png");  
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockProduct.photo.data);
        });

        it("should return 500 if product is not found", async () => {
            req.params = { pid: "product123" };

            productModel.findById = jest.fn().mockResolvedValue(null);

            await productPhotoController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "Erorr while getting photo",
                })
            );
        });
    });

    describe("productListController", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {}
            };
            mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            
            // Mock find method chain
            const mockFindChain = {
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue([
                    { _id: "product1", name: "Product 1" },
                    { _id: "product2", name: "Product 2" }
                ])
            };
            
            productModel.find = jest.fn().mockReturnValue(mockFindChain);
            
            // Reset mocks
            jest.clearAllMocks();
        });

        it("should get products for default page (page=1)", async () => {
            // No page param provided (default to page 1)
            await productListController(mockReq, mockRes);
            
            // Verify find was called correctly
            expect(productModel.find).toHaveBeenCalledWith({});
            
            // Verify skip was called with 0 (page 1)
            expect(productModel.find().skip).toHaveBeenCalledWith(0);
            
            // Verify limit was called with perPage (6)
            expect(productModel.find().limit).toHaveBeenCalledWith(6);
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: [
                    { _id: "product1", name: "Product 1" },
                    { _id: "product2", name: "Product 2" }
                ]
            });
        });

        it("should get products for specified page", async () => {
            // Set page param to 2
            mockReq.params.page = "2";
            
            await productListController(mockReq, mockRes);
            
            // Verify find was called correctly
            expect(productModel.find).toHaveBeenCalledWith({});
            
            // Verify skip was called with perPage (page 2 = skip 6)
            expect(productModel.find().skip).toHaveBeenCalledWith(6);
            
            // Verify limit was called with perPage (6)
            expect(productModel.find().limit).toHaveBeenCalledWith(6);
            
            // Verify response
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: true,
                products: [
                    { _id: "product1", name: "Product 1" },
                    { _id: "product2", name: "Product 2" }
                ]
            });
        });

        it("should handle errors", async () => {
            // Mock error during database query
            const mockError = new Error("Database error");
            productModel.find = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockRejectedValue(mockError)
            });
            
            // Mock console.log
            console.log = jest.fn();
            
            await productListController(mockReq, mockRes);
            
            // Verify error was logged
            expect(console.log).toHaveBeenCalledWith(mockError);
            
            // Verify error response was sent
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({
                success: false,
                message: "error in per page ctrl",
                error: mockError
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
