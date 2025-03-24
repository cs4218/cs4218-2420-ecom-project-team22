import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Profile from "./Profile"; 

jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(() => ([
    {
      user: {
        name: "Test User",
        email: "oldemail@example.com",
        phone: "1234567890",
        address: "Old Address St",
      },
    },
    jest.fn(), 
  ])),
}));

jest.mock("../../context/cart", () => ({
  useCart: jest.fn(() => [[]]),
}));

jest.mock("../../context/search", () => ({
  useSearch: jest.fn(() => [[], jest.fn()]),
}));

jest.mock("axios");

describe("Profile Page - User Update Flow with Mocks", () => {
  beforeEach(() => {
    axios.put.mockResolvedValue({
      data: {
        success: true,
        updatedUser: {
          name: "Updated User",
          email: "oldemail@example.com",
          phone: "0987654321",
          address: "New Address St",
        },
      },
    });
  });

  it("should allow users to update their profile details", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/user/profile"]}>
        <Routes>
          <Route path="/dashboard/user/profile" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/USER PROFILE/i)).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("Enter Your Name");
    const phoneInput = screen.getByPlaceholderText("Enter Your Phone");
    const addressInput = screen.getByPlaceholderText("Enter Your Address");

    expect(nameInput.value).toBe("Test User");
    expect(phoneInput.value).toBe("1234567890");
    expect(addressInput.value).toBe("Old Address St");

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "Updated User" } });
      fireEvent.change(phoneInput, { target: { value: "0987654321" } });
      fireEvent.change(addressInput, { target: { value: "New Address St" } });
    });

    await waitFor(() => {
      expect(nameInput.value).toBe("Updated User");
      expect(phoneInput.value).toBe("0987654321");
      expect(addressInput.value).toBe("New Address St");
    });

    const updateButton = screen.getByRole("button", { name: /UPDATE/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("/api/v1/auth/profile", {
        name: "Updated User",
        email: "oldemail@example.com",
        password: "",
        phone: "0987654321",
        address: "New Address St",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Profile Updated Successfully")).toBeInTheDocument();
    });
  });
});
