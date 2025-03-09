import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import CartPage from "./CartPage";
import { useCart } from "../context/cart";

// Mocking necessary hooks
jest.mock("../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../context/search", () => ({
    useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), // Mocking to return a valid array for destructuring
  }));

Object.defineProperty(window, "localStorage", {
  value: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

describe("CartPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty cart", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByText("Your Cart Is Empty")).toBeInTheDocument();
  });

  it("renders cart with items", () => {
    const mockCart = [
      { _id: "1", name: "Test Item", description: "This is a test product", price: 10 },
    ];

    // Mock useCart to return a cart with one item
    useCart.mockReturnValue([
      mockCart,
      jest.fn((updatedCart) => localStorage.setItem("cart", JSON.stringify(updatedCart))),
    ]);

    const { getByText } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText("Test Item")).toBeInTheDocument();
    expect(getByText("This is a test product")).toBeInTheDocument();
    expect(getByText("Price : 10")).toBeInTheDocument();
  });

  it("shows correct cart total price", () => {
    const mockCart = [
      { _id: "1", name: "Test Item", description: "This is a test product", price: 10 },
      { _id: "2", name: "Another Item", description: "Another test product", price: 15 },
    ];
  
    // Mock useCart to return a cart with two items
    useCart.mockReturnValue([
      mockCart,
      jest.fn((updatedCart) => localStorage.setItem("cart", JSON.stringify(updatedCart))),
    ]);
  
    const { getByText } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );
    const totalElement = getByText(/Total : \$/);
    expect(totalElement).toHaveTextContent("$25.00");  // Match the text "Total : $" (case-insensitive, any number after $)
  });

  it("deletes an item from the cart", () => {
    const mockCart = [
      { _id: "1", name: "Test Item", description: "This is a test product", price: 10 },
    ];

    // Mock useCart to return a cart with one item
    useCart.mockReturnValue([
      mockCart,
      jest.fn((updatedCart) => localStorage.setItem("cart", JSON.stringify(updatedCart))),
    ]);

    const { getByText, queryByText } = render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText("Test Item")).toBeInTheDocument();

    // Simulate remove button click
    fireEvent.click(getByText("Remove"));
    // Check that item is removed from the cart
    expect(queryByText("Test Item")).not.toBeInTheDocument();
  });

  
});
