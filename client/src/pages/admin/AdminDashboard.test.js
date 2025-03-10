import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import AdminDashboard from "./AdminDashboard";

const mockUserObject = {
  name: "john doe",
  email: "test@email.com",
  phone: "1234567890",
};

jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(() => [
    {
      user: mockUserObject,
    },
  ]),
}));

jest.mock("../../context/cart", () => ({
  useCart: jest.fn(() => []),
}));

jest.mock("../../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "", results: [] }]),
}));

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with user, email phone contact", () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
    const nameOccurences = getAllByText(new RegExp(mockUserObject.name, "i"));
    const emailOccurences = getAllByText(new RegExp(mockUserObject.email, "i"));
    const phoneOccurences = getAllByText(new RegExp(mockUserObject.phone, "i"));

    expect(nameOccurences.length).toBeGreaterThan(0);
    expect(emailOccurences.length).toBeGreaterThan(0);
    expect(phoneOccurences.length).toBeGreaterThan(0);
  });
});
