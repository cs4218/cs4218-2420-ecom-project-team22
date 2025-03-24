import React from "react";
import { render, fireEvent, waitFor, within } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import toast from "react-hot-toast";
import CreateCategory from "./CreateCategory";

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

// We mock a form in case the implmentation changes
jest.mock("../../components/Form/CategoryForm", () => ({ handleSubmit, value, setValue }) => (
  <form onSubmit={handleSubmit} data-testid="mock-form">
    <input data-testid="mock-input" type="text" value={value} onChange={(e) => setValue(e.target.value)} />
    <button type="submit">Submit</button>
  </form>
));

// We override the antd form so that we can test on the modal
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
    Modal: ({ children, visible, footer, onCancel }) => {
      return <div data-testid="modal">{children}</div>;
    },
  };
});

describe("Create Category Submit Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(jest.fn());
  });

  test("renders form", () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const ncc = getByTestId("new-category-container");

    expect(within(ncc).getByTestId("mock-form")).toBeInTheDocument();
    expect(within(ncc).getByText("Submit")).toBeInTheDocument();
  });

  test("calls handleSubmit and gets categories on success", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const { getByTestId } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const ncc = getByTestId("new-category-container");

    fireEvent.change(within(ncc).getByTestId("mock-input"), {
      target: { value: "soaps" },
    });
    fireEvent.submit(within(ncc).getByTestId("mock-form"));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith("soaps is created");
    expect(axios.get).toHaveBeenCalledWith("/api/v1/category/get-category");
  });

  test("calls handleSubmit and gets categories on unsuccessful return", async () => {
    axios.post.mockResolvedValueOnce({ data: { success: false, message: "Category already exists" } });

    const { getByTestId } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const ncc = getByTestId("new-category-container");

    fireEvent.change(within(ncc).getByTestId("mock-input"), {
      target: { value: "soaps" },
    });
    fireEvent.submit(within(ncc).getByTestId("mock-form"));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Category already exists");
  });

  test("calls handleSubmit and gets categories on unsuccessful return", async () => {
    axios.post.mockRejectedValueOnce();

    const { getByTestId } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const ncc = getByTestId("new-category-container");

    fireEvent.change(within(ncc).getByTestId("mock-input"), {
      target: { value: "soaps" },
    });
    fireEvent.submit(within(ncc).getByTestId("mock-form"));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("something went wrong in input form");
  });
});

describe("Retrieve Categories Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(jest.fn());
  });

  test("renders categories on success", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });

    const { findByText } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    expect(axios.get).toHaveBeenCalledWith("/api/v1/category/get-category");
    const categoryRow = await findByText("soaps");
    expect(categoryRow).toBeInTheDocument();
  });

  test("toasts on unsuccessful return", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: false, message: "Error" } });

    render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Error");
  });

  test("toasts on error", async () => {
    axios.get.mockRejectedValueOnce();

    render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Something went wrong in getting the categories");
  });
});

describe("Create Category Edit Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(jest.fn());
  });

  test("calls handleUpdate and toasts success on successful form submission", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });
    axios.put.mockResolvedValueOnce({ data: { success: true } });

    const { findByTestId, findByText } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const editButton = await findByText("Edit");
    fireEvent.click(editButton);
    const modal = await findByTestId("modal");
    const inputInModal = within(modal).getByTestId("mock-input");
    const formInModal = within(modal).getByTestId("mock-form");

    fireEvent.change(inputInModal, {
      target: { value: "soaps" },
    });
    fireEvent.submit(formInModal);

    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith("soaps is updated");
  });

  test("calls handleUpdate and toasts error on error form submission", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });
    axios.put.mockResolvedValueOnce({ data: { success: false, message: "Error" } });

    const { findByTestId, findByText } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const editButton = await findByText("Edit");
    fireEvent.click(editButton);
    const modal = await findByTestId("modal");
    const inputInModal = within(modal).getByTestId("mock-input");
    const formInModal = within(modal).getByTestId("mock-form");

    fireEvent.change(inputInModal, {
      target: { value: "soaps" },
    });
    fireEvent.submit(formInModal);

    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Error");
  });

  test("calls handleUpdate and toasts errors on axios error", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });
    axios.put.mockRejectedValueOnce();

    const { findByTestId, findByText } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const editButton = await findByText("Edit");
    fireEvent.click(editButton);
    const modal = await findByTestId("modal");
    const inputInModal = within(modal).getByTestId("mock-input");
    const formInModal = within(modal).getByTestId("mock-form");

    fireEvent.change(inputInModal, {
      target: { value: "soaps" },
    });
    fireEvent.submit(formInModal);

    await waitFor(() => expect(axios.put).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });
});

describe("Create Category Delete Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(jest.fn());
  });

  test("calls handleDelete and toasts success on successful deletion", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });
    axios.delete.mockResolvedValueOnce({ data: { success: true } });

    const { findByText } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const deleteButton = await findByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith("category is deleted");
  });

  test("calls handleDelete and toasts error on unsuccessful deletion", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });
    axios.delete.mockResolvedValueOnce({ data: { success: false, message: "Error" } });

    const { findByText } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const deleteButton = await findByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Error");
  });

  test("calls handleDelete and toasts error on axios error", async () => {
    axios.get.mockResolvedValueOnce({ data: { success: true, category: [{ name: "soaps", _id: "1" }] } });
    axios.delete.mockRejectedValueOnce();

    const { findByText } = render(
      <MemoryRouter>
        <CreateCategory />
      </MemoryRouter>
    );

    const deleteButton = await findByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });
});
