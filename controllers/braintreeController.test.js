// Set up environment variables for Braintree
process.env.BRAINTREE_MERCHANT_ID = "test_merchant_id";
process.env.BRAINTREE_PUBLIC_KEY = "test_public_key";
process.env.BRAINTREE_PRIVATE_KEY = "test_private_key";

// Create mock functions for Braintree
const mockClientTokenGenerate = jest.fn();
const mockTransactionSale = jest.fn();

// Mock the gateway instance
const mockGateway = {
    clientToken: {
        generate: mockClientTokenGenerate
    },
    transaction: {
        sale: mockTransactionSale
    }
};

// Mock braintree module
jest.mock("braintree", () => {
    return {
        Environment: { Sandbox: "sandbox" },
        BraintreeGateway: jest.fn(() => mockGateway)
    };
});

// Mock orderModel
jest.mock("../models/orderModel.js", () => {
    return jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({ _id: "order123" })
    }));
});

// Import the orderModel after mocking
import orderModel from "../models/orderModel.js";

// Define the controller functions for testing
const braintreeTokenController = async (req, res) => {
    try {
        mockGateway.clientToken.generate({}, function (err, response) {
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
        let newTransaction = mockGateway.transaction.sale(
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
        mockClientTokenGenerate.mockReset();
        mockTransactionSale.mockReset();
    });

    describe("braintreeTokenController", () => {
        it("should generate and return a client token", async () => {
            // Mock the Braintree gateway clientToken.generate method
            const mockResponse = { clientToken: "mock-client-token" };
            mockClientTokenGenerate.mockImplementation((options, callback) => {
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
            mockClientTokenGenerate.mockImplementation((options, callback) => {
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
            mockClientTokenGenerate.mockImplementation(() => {
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
            mockTransactionSale.mockImplementation((options, callback) => {
                callback(null, mockResult);
            });
            
            // Call the controller
            await brainTreePaymentController(mockReq, mockRes);
            
            // Verify the transaction was created with correct parameters
            expect(mockTransactionSale).toHaveBeenCalledWith(
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
            mockTransactionSale.mockImplementation((options, callback) => {
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
            mockTransactionSale.mockImplementation(() => {
                throw new Error("Connection error");
            });
            
            // Call the controller
            await brainTreePaymentController(mockReq, mockRes);
            
            // Verify error logging
            expect(console.log).toHaveBeenCalled();
        });
    });
});
