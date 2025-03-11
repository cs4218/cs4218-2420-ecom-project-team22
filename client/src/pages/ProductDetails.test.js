import React from "react";
import { jest, expect, test, describe } from "@jest/globals";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import ProductDetails from "./ProductDetails";
import Layout from "../components/Layout";

// Mock axios
jest.mock("axios");

// Mock useParams and useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock useAuth
jest.mock("../context/auth", () => ({
    useAuth: jest.fn(() => [null, jest.fn()]), // Return an array with null and a mock function
}));
  
// Mock useCart
jest.mock("../context/cart", () => ({
    useCart: jest.fn(() => [null, jest.fn()]), // Return an array with null and a mock function
}));
  
// Mock useCategory
jest.mock("../hooks/useCategory", () => ({
    useCategory: jest.fn(() => []), // Return an empty array
}));

describe("ProductDetails Component", () => {
  const mockNavigate = jest.fn();
  const mockParams = { slug: "test-product-slug" };

  beforeEach(() => {
    // Mock useParams to return the mockParams
    useParams.mockReturnValue(mockParams);

    // Mock useNavigate to return the mockNavigate function
    useNavigate.mockReturnValue(mockNavigate);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders the product details and related products", async () => {
    // Mock axios responses
    axios.get.mockResolvedValueOnce({
      data: {
        product: {
          _id: "1",
          name: "Test Product",
          description: "This is a test product",
          price: 100,
          category: { name: "Test Category" },
        },
      },
    }).mockResolvedValueOnce({
      data: {
        products: [
          {
            _id: "2",
            name: "Related Product",
            description: "This is a related product",
            price: 50,
            slug: "related-product-slug",
          },
        ],
      },
    });

    // Render the component
    render(
      <MemoryRouter initialEntries={["/product/test-product-slug"]}>
        <Routes>
          <Route path="/product/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the product details to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("Product Details")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("This is a test product")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("$100.00")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Test Category")).toBeInTheDocument();
    });

    // Wait for the related products to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("Similar Products ➡️")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Related Product")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("This is a related product...")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("$50.00")).toBeInTheDocument();
    });
  });

  it("navigates to the related product details page when 'More Details' is clicked", async () => {
    // Mock axios responses
    axios.get.mockResolvedValueOnce({
      data: {
        product: {
          _id: "1",
          name: "Test Product",
          description: "This is a test product",
          price: 100,
          category: { name: "Test Category" },
        },
      },
    }).mockResolvedValueOnce({
      data: {
        products: [
          {
            _id: "2",
            name: "Related Product",
            description: "This is a related product",
            price: 50,
            slug: "related-product-slug",
          },
        ],
      },
    });

    // Render the component
    render(
      <MemoryRouter initialEntries={["/product/test-product-slug"]}>
        <Routes>
          <Route path="/product/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the related products to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("Related Product")).toBeInTheDocument();
    });

    // Click the "More Details" button
    fireEvent.click(screen.getByText("More Details"));

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/product/related-product-slug");
  });

  it("displays a message when no related products are found", async () => {
    // Mock axios responses
    axios.get.mockResolvedValueOnce({
      data: {
        product: {
          _id: "1",
          name: "Test Product",
          description: "This is a test product",
          price: 100,
          category: { name: "Test Category" },
        },
      },
    }).mockResolvedValueOnce({
      data: {
        products: [],
      },
    });

    // Render the component
    render(
      <MemoryRouter initialEntries={["/product/test-product-slug"]}>
        <Routes>
          <Route path="/product/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the message to be displayed
    await waitFor(() => {
      expect(screen.getByText("No Similar Products found")).toBeInTheDocument();
    });
  });
});