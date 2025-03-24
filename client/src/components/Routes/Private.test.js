import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "./Private";
import { AuthProvider, useAuth } from "../../context/auth";
import { useCart, CartProvider } from "../../context/cart";
import { useSearch, SearchProvider } from "../../context/search";
import axios from "axios";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");

// Mock the Spinner component
jest.mock("../Spinner", () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

// Mock the router components
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="mock-outlet">Protected Content</div>,
    useLocation: () => ({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "default"
    })
  };
});

// Mock the auth context
jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => children,
}));

// Mock the cart context
jest.mock("../../context/cart", () => ({
  useCart: jest.fn(),
  CartProvider: ({ children }) => children,
}));

// Mock the search context
jest.mock("../../context/search", () => ({
  useSearch: jest.fn(),
  SearchProvider: ({ children }) => children,
}));

const renderWithProviders = (component) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            {component}
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("PrivateRoute Component", () => {
  const mockSetAuth = jest.fn();
  const mockSetOk = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("should show loading spinner when no auth token is present", () => {
    // Mock auth context with no token
    useAuth.mockReturnValue([{ token: null }, mockSetAuth]);

    renderWithProviders(<PrivateRoute />);

    // Check if Spinner is rendered
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("should show protected content when auth token is present and auth check passes", async () => {
    // Mock auth context with token
    useAuth.mockReturnValue([{ token: "mock-token" }, mockSetAuth]);

    // Mock successful axios response
    axios.get.mockResolvedValueOnce({ data: { ok: true } });

    renderWithProviders(<PrivateRoute />);

    // Initially, the spinner should be shown
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Wait for the auth check to complete and verify that the correct state is set
    await waitFor(() => expect(mockSetOk).toHaveBeenCalledWith(true));

    // Verify UI updates: spinner should be gone, and protected content should be displayed
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });

  it("should show loading spinner when auth check fails", async () => {
    // Mock auth context with token
    useAuth.mockReturnValue([{ token: "mock-token" }, mockSetAuth]);

    // Mock failed axios response
    axios.get.mockResolvedValueOnce({ data: { ok: false } });

    renderWithProviders(<PrivateRoute />);

    // Initially, the spinner should be shown
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Wait for the auth check to complete and verify that the correct state is set
    await waitFor(() => expect(mockSetOk).toHaveBeenCalledWith(false));

    // Verify UI updates: spinner should still be visible
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-outlet")).not.toBeInTheDocument();
  });

  it("should handle axios error gracefully", async () => {
    // Mock auth context with token
    useAuth.mockReturnValue([{ token: "mock-token" }, mockSetAuth]);

    // Mock axios error
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders(<PrivateRoute />);

    // Initially, the spinner should be shown
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Wait for the auth check to complete and verify that the correct state is set
    await waitFor(() => expect(mockSetOk).toHaveBeenCalledWith(false));

    // Verify UI updates: spinner should still be visible due to error
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-outlet")).not.toBeInTheDocument();
  });
});
