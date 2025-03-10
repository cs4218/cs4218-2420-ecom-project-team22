// Set up environment variables for Braintree
process.env.BRAINTREE_MERCHANT_ID = "test_merchant_id";
process.env.BRAINTREE_PUBLIC_KEY = "test_public_key";
process.env.BRAINTREE_PRIVATE_KEY = "test_private_key";

// Mock braintree module
jest.mock("braintree", () => {
    // Create mock functions for Braintree
    const mockClientTokenGenerate = jest.fn();
    const mockTransactionSale = jest.fn();
    
    // Create a mock gateway
    const mockGateway = {
        clientToken: {
            generate: mockClientTokenGenerate
        },
        transaction: {
            sale: mockTransactionSale
        }
    };
    
    // Export the mock functions so tests can access them
    global.mockClientTokenGenerate = mockClientTokenGenerate;
    global.mockTransactionSale = mockTransactionSale;
    
    return {
        Environment: { Sandbox: "sandbox" },
        BraintreeGateway: jest.fn().mockReturnValue(mockGateway)
    };
});

// Mock orderModel
jest.mock("../models/orderModel.js", () => {
    return jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ _id: "order123" })
    }));
});

// Import the actual controller functions after setting up all mocks
import { braintreeTokenController, brainTreePaymentController } from "../controllers/productController.js";

// Import the orderModel after mocking
import orderModel from "../models/orderModel.js";

describe("Braintree Controllers", () => {
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
        
        // Reset the mock functions
        global.mockClientTokenGenerate.mockReset();
        global.mockTransactionSale.mockReset();
    });

    describe("braintreeTokenController", () => {
        it("should generate and return a client token", async () => {
            // Mock the Braintree gateway clientToken.generate method
            const mockResponse = { clientToken: "mock-client-token" };
            global.mockClientTokenGenerate.mockImplementation((options, callback) => {
                callback(null, mockResponse);
            });
            
            // Call the controller
            await braintreeTokenController(mockReq, mockRes);
            
            // Verify the response
            expect(mockRes.send).toHaveBeenCalledWith(mockResponse);
        });
        
        it("should handle errors when generating client token", async () => {
            // Mock console.log to verify error logging
            console.log = jest.fn();
            
            // Mock the Braintree gateway clientToken.generate method to return an error
            const mockError = new Error("Failed to generate token");
            global.mockClientTokenGenerate.mockImplementation((options, callback) => {
                callback(mockError, null);
            });
            
            // Call the controller
            await braintreeTokenController(mockReq, mockRes);
            
            // Verify error handling
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith(mockError);
        });
        
        it("should handle exceptions in the controller", async () => {
            // Mock console.log to verify error logging
            console.log = jest.fn();
            
            // Mock the Braintree gateway to throw an exception
            global.mockClientTokenGenerate.mockImplementation(() => {
                throw new Error("Connection error");
            });
            
            // Call the controller
            await braintreeTokenController(mockReq, mockRes);
            
            // Verify error logging
            expect(console.log).toHaveBeenCalled();
        });
    });
    
    describe("brainTreePaymentController", () => {
        it("should process a payment successfully", async () => {
            // Set up request with nonce and cart
            mockReq.body = {
                nonce: "mock-payment-nonce",
                cart: [
                    { _id: "product1", name: "Product 1", price: 100 },
                    { _id: "product2", name: "Product 2", price: 200 }
                ]
            };
            
            // Set up user in request (for buyer ID)
            mockReq.user = { _id: "user123" };
            
            // Mock the Braintree gateway transaction.sale method
            const mockResult = { transaction: { id: "transaction123" } };
            global.mockTransactionSale.mockImplementation((options, callback) => {
                callback(null, mockResult);
            });
            
            // Call the controller
            await brainTreePaymentController(mockReq, mockRes);
            
            // Verify the transaction was created with correct parameters
            expect(global.mockTransactionSale).toHaveBeenCalledWith(
                expect.objectContaining({
                    amount: 300, // 100 + 200
                    paymentMethodNonce: "mock-payment-nonce",
                    options: { submitForSettlement: true }
                }),
                expect.any(Function)
            );
            
            // Verify order was created
            expect(orderModel).toHaveBeenCalledWith({
                products: mockReq.body.cart,
                payment: mockResult,
                buyer: "user123"
            });
            
            // Verify the response
            expect(mockRes.json).toHaveBeenCalledWith({ ok: true });
        });
        
        it("should handle payment processing errors", async () => {
            // Set up request with nonce and cart
            mockReq.body = {
                nonce: "invalid-nonce",
                cart: [
                    { _id: "product1", name: "Product 1", price: 100 }
                ]
            };
            
            // Mock the Braintree gateway transaction.sale method to return an error
            const mockError = new Error("Payment failed");
            global.mockTransactionSale.mockImplementation((options, callback) => {
                callback(mockError, null);
            });
            
            // Call the controller
            await brainTreePaymentController(mockReq, mockRes);
            
            // Verify error handling
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith(mockError);
        });
        
        it("should handle exceptions in the controller", async () => {
            // Mock console.log to verify error logging
            console.log = jest.fn();
            
            // Mock the Braintree gateway to throw an exception
            global.mockTransactionSale.mockImplementation(() => {
                throw new Error("Connection error");
            });
            
            // Call the controller
            await brainTreePaymentController(mockReq, mockRes);
            
            // Verify error logging
            expect(console.log).toHaveBeenCalled();
        });
    });
});
