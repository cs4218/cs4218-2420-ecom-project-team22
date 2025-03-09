import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import toast from "react-hot-toast";
import { CartProvider, useCart } from "../context/cart";
import { AuthProvider } from "../context/auth";
import CartPage from "./CartPage";

// Mock dependencies
jest.mock("axios");
jest.mock("react-hot-toast");

jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [{ user: null, token: null }, jest.fn()]), 
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(), // Do not call localStorage inside the mock
}));

jest.mock("../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), 
}));

jest.mock("../hooks/useCategory", () => jest.fn(() => []));

// Mock localStorage globally before each test
beforeEach(() => {
  localStorage.setItem("cart", JSON.stringify([])); // Reset cart before each test

  useCart.mockImplementation(() => [
    JSON.parse(localStorage.getItem("cart")), jest.fn()
  ]);

  jest.clearAllMocks();
});

// --- TESTS ---
describe("CartPage Component", () => {
  it("renders empty Cart Page", () => {
    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(getByText("Your Cart Is Empty")).toBeInTheDocument();
  });

  it("renders cart and removes items", () => {
    const mockCart = [
      { _id: "1", name: "Test Item", description: "This is a test product", price: 10 },
    ];
    localStorage.setItem("cart", JSON.stringify(mockCart));

    useCart.mockImplementation(() => [
      JSON.parse(localStorage.getItem("cart")), jest.fn()
    ]);

    const { getByText, queryByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(getByText("Test Item")).toBeInTheDocument();
    expect(getByText("This is a test product")).toBeInTheDocument();
    expect(getByText("Price : 10")).toBeInTheDocument();

    fireEvent.click(getByText("Remove"));
    expect(queryByText("Test Item")).not.toBeInTheDocument();
  });

  it("renders total price correctly", () => {
    const mockCart = [
      { _id: "1", name: "Item 1", price: 10 },
      { _id: "2", name: "Item 2", price: 20 },
    ];
    localStorage.setItem("cart", JSON.stringify(mockCart));

    useCart.mockImplementation(() => [
      JSON.parse(localStorage.getItem("cart")), jest.fn()
    ]);

    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(getByText("Total : $30.00")).toBeInTheDocument();
  });

  it("handles payment token retrieval", async () => {
    axios.get.mockResolvedValueOnce({ data: { clientToken: "test-token" } });

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthProvider>
            <CartProvider>
              <CartPage />
            </CartProvider>
          </AuthProvider>
        </MemoryRouter>
      );
    });

    expect(axios.get).toHaveBeenCalledWith("/api/v1/product/braintree/token");
  });

  it("disables payment button when no address is set", () => {
    const { queryByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const paymentButton = queryByText("Make Payment");
    expect(paymentButton).not.toBeInTheDocument();
  });
});
