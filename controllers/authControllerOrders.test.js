import { jest } from "@jest/globals";
import { getOrdersController, getAllOrdersController, orderStatusController } from "./authController";
import orderModel from "../models/orderModel";

jest.mock("../models/orderModel");

describe("getOrdersController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { _id: "65b8d8f4c3a1b98765432101" } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should return orders for a valid user", async () => {
    const mockOrders = [
      { _id: "order1", products: [{ name: "Product 1" }], buyer: { name: "John Doe" } },
    ];

    orderModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrders),
      }),
    });

    await getOrdersController(req, res);

    expect(orderModel.find).toHaveBeenCalledWith({ buyer: "user123" });
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  it("should return 500 on error", async () => {
    orderModel.find.mockImplementation(() => {
      throw new Error("Database error");
    });

    await getOrdersController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Error While Geting Orders" })
    );
  });
});

describe("getAllOrdersController", () => {
  let req, res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should return all orders", async () => {
    const mockOrders = [
      {
        _id: "order1",
        products: [{ name: "Product 1" }],
        buyer: { name: "John Doe" },
        createdAt: new Date(),
      },
    ];

    orderModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockOrders),
        }),
      }),
    });

    await getAllOrdersController({}, res);

    expect(orderModel.find).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  it("should return 500 on error", async () => {
    orderModel.find.mockImplementation(() => {
      throw new Error("Database error");
    });

    await getAllOrdersController({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Error While Geting Orders",
      })
    );
  });
});

describe("orderStatusController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { orderId: "order1" },
      body: { status: "shipped" },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should update order status", async () => {
    const updatedOrder = {
      _id: "order1",
      status: "shipped",
    };

    orderModel.findByIdAndUpdate.mockResolvedValue(updatedOrder);

    await orderStatusController(req, res);

    expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith("order1", { status: "shipped" }, { new: true });
    expect(res.json).toHaveBeenCalledWith(updatedOrder);
  });

  it("should return 500 on error", async () => {
    orderModel.findByIdAndUpdate.mockImplementation(() => {
      throw new Error("Update error");
    });

    await orderStatusController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Error While Updating Order",
      })
    );
  });
});
