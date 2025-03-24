// kenneth: todo
import React from "react";
import { render, fireEvent, waitFor, within, getByText } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import toast from "react-hot-toast";
import UpdateProduct from "./UpdateProduct";

jest.mock("axios");
jest.mock("react-hot-toast");

jest.mock("../../context/auth", () => ({
  useAuth: jest.fn(() => [null, jest.fn()]), // Mock useAuth hook to return null state and a mock function for setAuth
}));

jest.mock("../../context/cart", () => ({
  useCart: jest.fn(() => [null, jest.fn()]), // Mock useCart hook to return null state and a mock function
}));

jest.mock("../../context/search", () => ({
  useSearch: jest.fn(() => [{ keyword: "" }, jest.fn()]), // Mock useSearch hook to return null state and a mock function
}));

jest.mock("../../hooks/useCategory", () => jest.fn(() => []));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate, // Return the mocked function
}));

describe("Update Product page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should render properly", () => {
    render(
      <MemoryRouter>
        <UpdateProduct />
      </MemoryRouter>
    );
  });

  // ===============================
  // UPDATES
  // ===============================

  it("should toast on sucessful product update", async () => {
    axios.put.mockResolvedValueOnce({ data: { success: true } });
    const { getByTestId } = render(
      <MemoryRouter>
        <UpdateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("update-product"));
    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/admin/products");
  });

  it("should toast on failed product update", async () => {
    axios.put.mockResolvedValueOnce({ data: { success: false, message: "error" } });
    const { getByTestId } = render(
      <MemoryRouter>
        <UpdateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("update-product"));
    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("should handle error on product update", async () => {
    axios.put.mockRejectedValueOnce();
    const { getByTestId } = render(
      <MemoryRouter>
        <UpdateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("update-product"));
    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  // ===============================
  // DELETES
  // ===============================

  it("should toast on sucessful product delete", async () => {
    axios.delete.mockResolvedValueOnce({ data: { success: true } });
    jest.spyOn(window, "prompt").mockImplementation(() => "yes");

    const { getByTestId } = render(
      <MemoryRouter>
        <UpdateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("delete-product"));
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/admin/products");
  });

  it("should toast on failed product delete", async () => {
    axios.delete.mockResolvedValueOnce({ data: { success: false, message: "error" } });
    jest.spyOn(window, "prompt").mockImplementation(() => "yes");
    const { getByTestId } = render(
      <MemoryRouter>
        <UpdateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("delete-product"));
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("should handle error on product delete", async () => {
    jest.spyOn(window, "prompt").mockImplementation(() => "yes");
    axios.delete.mockRejectedValueOnce();
    const { getByTestId } = render(
      <MemoryRouter>
        <UpdateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("delete-product"));
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("is stable when selecting and typing in multiple elements", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <UpdateProduct />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText("Product Name"), { target: { value: "Soap" } });
    fireEvent.change(getByPlaceholderText("Product Description"), { target: { value: "Soap description" } });
    fireEvent.change(getByPlaceholderText("Price"), { target: { value: "10" } });
    fireEvent.change(getByPlaceholderText("Quantity"), { target: { value: "10" } });
  });
});
