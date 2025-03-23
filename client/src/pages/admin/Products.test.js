import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import {AuthProvider, useAuth} from "../../context/auth.js";
import {useCart, CartProvider} from "../../context/cart.js";
import { useSearch, SearchProvider } from "../../context/search.js";
import Products from "./Products.js";
import { act } from "react-dom/test-utils";

import "@testing-library/jest-dom";

jest.mock("axios");

describe("Admin View Products - Integration Test", () => {
  const mockProducts = [
    { _id: "1", name: "Product A", description: "Description A", slug: "product-a" },
    { _id: "2", name: "Product B", description: "Description B", slug: "product-b" },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { products: mockProducts } });
  });

  it("should fetch and display products", async () => {
    render(
        <AuthProvider>
            <CartProvider>
                <SearchProvider>
                    <MemoryRouter>
                        <Products />
                    </MemoryRouter>
                </SearchProvider>
            </CartProvider>
        </AuthProvider>
      );

    expect(screen.getByText(/All Products List/i)).toBeInTheDocument();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Description A")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Product B")).toBeInTheDocument();
    });
  });

  it("should handle product creation", async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: "Product Created Successfully",
        products: { _id: "3", name: "Product C", description: "Description C", slug: "product-c" },
      },
    });

    // Simulate adding a product
    act(() => {
      mockProducts.push({ _id: "3", name: "Product C", description: "Description C", slug: "product-c" });
    });

    render(
      <AuthProvider>
            <CartProvider>
                <SearchProvider>
                    <MemoryRouter>
                        <Products />
                    </MemoryRouter>
                </SearchProvider>
            </CartProvider>
        </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Product C")).toBeInTheDocument();
    });
  });

  it("should handle product update", async () => {
    axios.put.mockResolvedValue({
      data: {
        success: true,
        message: "Product Updated Successfully",
        products: { _id: "1", name: "Product A Updated", description: "Updated Description A", slug: "product-a" },
      },
    });

    // Simulate product update
    act(() => {
      mockProducts[0] = { _id: "1", name: "Product A Updated", description: "Updated Description A", slug: "product-a" };
    });

    render(
      <AuthProvider>
            <CartProvider>
                <SearchProvider>
                    <MemoryRouter>
                        <Products />
                    </MemoryRouter>
                </SearchProvider>
            </CartProvider>
        </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Product A Updated")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Updated Description A")).toBeInTheDocument();
    });
  });

  it("should handle product deletion", async () => {
    axios.delete.mockResolvedValue({
      data: {
        success: true,
        message: "Product Deleted successfully",
      },
    });

    // Simulate deleting a product
    act(() => {
      mockProducts.pop();
    });

    render(
        <AuthProvider>
        <CartProvider>
            <SearchProvider>
                <MemoryRouter>
                    <Products />
                </MemoryRouter>
            </SearchProvider>
        </CartProvider>
    </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Product B")).not.toBeInTheDocument();
    });
  });
});
