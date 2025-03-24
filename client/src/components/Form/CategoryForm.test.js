import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import CategoryForm from "./CategoryForm";

describe("CategoryForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders form", () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <CategoryForm />
      </MemoryRouter>
    );

    expect(document.querySelector("form")).toBeInTheDocument();
    expect(getByPlaceholderText("Enter new category")).toBeInTheDocument();
    expect(getByText("Submit")).toBeInTheDocument();
  });

  it("should call handleSubmit on form submission", () => {
    const handleSubmit = jest.fn();
    const { container } = render(
      <MemoryRouter>
        <CategoryForm handleSubmit={handleSubmit} />
      </MemoryRouter>
    );

    const form = container.querySelector("form");
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should call setValue on input change", () => {
    const setValue = jest.fn();
    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <CategoryForm setValue={setValue} />
      </MemoryRouter>
    );

    const input = getByPlaceholderText("Enter new category");
    fireEvent.change(input, { target: { value: "soaps" } });
    expect(setValue).toHaveBeenCalledTimes(1);
  });
});
