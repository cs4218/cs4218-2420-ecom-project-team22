import React from "react";
import { render, fireEvent, waitFor, within, getByText } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import toast from "react-hot-toast";
import CreateProduct from "./CreateProduct";

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

describe("Create Product page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should render properly", () => {
    render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );
  });

  it("should toast and navigate on sucessful product creation", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    const { getByTestId } = render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("create-product"));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/admin/products");
  });

  it("should toast on failed product creation", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: false, message: "error" } });
    const { getByTestId } = render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("create-product"));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("should handle error", async () => {
    axios.post.mockRejectedValueOnce();
    const { getByTestId } = render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId("create-product"));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("renders category options on success", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });

    const { findByText, getByText, getByTestId } = render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/v1/category/get-category"));
    // fireEvent.click(getByTestId("category-select"));
    // const categoryOption = await getByTestId("category-option");
    // expect(categoryOption).toBeInTheDocument();
  });

  it("toasts on unsuccessful retrieval of categories", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: false, message: "Error" } });

    render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("toasts on error while retrieving categories", async () => {
    axios.get.mockRejectedValueOnce();

    render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalled();
  });

  it("is stable when selecting and typing in multiple elements", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText("Product Name"), { target: { value: "Soap" } });
    fireEvent.change(getByPlaceholderText("Product Description"), { target: { value: "Soap description" } });
    fireEvent.change(getByPlaceholderText("Price"), { target: { value: "10" } });
    fireEvent.change(getByPlaceholderText("Quantity"), { target: { value: "10" } });
  });
});
