import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { AuthProvider, useAuth } from "../../context/auth";
import { useCart, CartProvider } from "../../context/cart";
import { useSearch, SearchProvider } from "../../context/search";
import "@testing-library/jest-dom";

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

// Mock the UserMenu component
jest.mock("../../components/UserMenu", () => {
  return function MockUserMenu() {
    return <div data-testid="user-menu">User Menu</div>;
  };
});

// Mock the Layout component
jest.mock("../../components/Layout", () => {
  return function MockLayout({ children, title }) {
    return (
      <div data-testid="layout">
        <h1>{title}</h1>
        <div data-testid="dashboard-container" className="container-flui dashboard">
          {children}
        </div>
      </div>
    );
  };
});

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

describe("Dashboard Component", () => {
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    address: "123 Test St",
    phone: "1234567890",
    role: 0
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("should render dashboard with user information", () => {
    // Mock auth context with user data
    useAuth.mockReturnValue([{ user: mockUser }, jest.fn()]);

    renderWithProviders(<Dashboard />);

    // Check if title is rendered
    expect(screen.getByText("Dashboard - Ecommerce App")).toBeInTheDocument();

    // Check if UserMenu is rendered
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();

    // Check if user information is rendered
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.address)).toBeInTheDocument();
  });

  it("should handle missing user data gracefully", () => {
    // Mock auth context with no user data
    useAuth.mockReturnValue([{ user: null }, jest.fn()]);

    renderWithProviders(<Dashboard />);

    // Check if title is still rendered
    expect(screen.getByText("Dashboard - Ecommerce App")).toBeInTheDocument();

    // Check if UserMenu is still rendered
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();

    // Check if user information is not rendered
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
    expect(screen.queryByText("123 Test St")).not.toBeInTheDocument();
  });

  it("should render with correct layout structure", () => {
    // Mock auth context with user data
    useAuth.mockReturnValue([{ user: mockUser }, jest.fn()]);

    renderWithProviders(<Dashboard />);

    // Check if layout is rendered
    expect(screen.getByTestId("layout")).toBeInTheDocument();

    // Check if container classes are present
    expect(screen.getByTestId("dashboard-container")).toHaveClass("container-flui");
    expect(screen.getByTestId("dashboard-container")).toHaveClass("dashboard");

    // Check if row and column structure is present
    expect(screen.getByTestId("dashboard-container")).toHaveTextContent("User Menu");
    expect(screen.getByTestId("dashboard-container")).toHaveTextContent(mockUser.name);
  });
}); 