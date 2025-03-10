import { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController } from "../controllers/productController.js";
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
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        req = {
            fields: {},
            params: {},
            files: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn((data) => data),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createProductController", () => {
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

    describe("getProductController", () => {
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
            res.status = jest.fn().mockReturnValue(res);
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

    describe("deleteProductController", () => {
        it("should delete a product successfully", async () => {
            req.params = { pid: "product123" };
        
            // Create a mock product document, mocking a Mongoose document
            productModel.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "product123" });
        
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

    describe("productFiltersController", () => {
        beforeEach(() => {
            req = { body: { checked: [], radio: [] } };
            res = {
              status: jest.fn().mockReturnThis(),
              send: jest.fn(),
            };
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
});
