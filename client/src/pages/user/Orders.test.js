import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Orders from "./Orders";
import { AuthProvider } from "../../context/auth";
import { CartProvider } from "../../context/cart";
import { SearchProvider } from "../../context/search";

jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(() => [
    {
      user: { name: "Test User", email: "testuser@example.com", token: "mockToken" },
    },
  ]),
}));

jest.mock("../../context/cart", () => ({
  useCart: jest.fn(() => [[], jest.fn()]),
}));

jest.mock("../../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "", results: [] }, jest.fn()]),
}));

jest.mock("axios");

describe("Orders Page UI Test", () => {
  beforeEach(() => {
    jest.spyOn(axios, "get").mockImplementation((url) => {
      console.log(`Mocked axios.get called with URL: ${url}`);
      if (url === "/api/v1/auth/orders") {
        return Promise.resolve({
          data: [
            {
              _id: "order123",
              status: "Completed",
              buyer: { name: "Test User" },
              createAt: "2024-03-01T00:00:00Z",
              payment: { success: true },
              products: [
                { _id: "prod1", name: "NUS T-shirt", description: "A comfortable t-shirt", price: 20.0 },
                { _id: "prod2", name: "The Law of Contract in Singapore", description: "A legal textbook", price: 50.0 },
              ],
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it("should display the user's order history", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <Orders />
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/All Orders/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/v1/auth/orders");
    });

    await waitFor(() => {
      expect(screen.getByText(/Completed/i)).toBeInTheDocument();
      expect(screen.getByText(/Test User/i)).toBeInTheDocument();
      expect(screen.getByText(/NUS T-shirt/i)).toBeInTheDocument();
      expect(screen.getByText(/The Law of Contract in Singapore/i)).toBeInTheDocument();
      expect(screen.getByText(/Price : 20/i)).toBeInTheDocument();
      expect(screen.getByText(/Price : 50/i)).toBeInTheDocument();
    });
  });

  it("should show no orders message when there are no past orders", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <Orders />
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/All Orders/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/v1/auth/orders");
    });

    await waitFor(() => {
      expect(screen.getByText(/No orders found/i)).toBeInTheDocument();
    });
  });
});
