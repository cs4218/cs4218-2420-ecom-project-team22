import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import AdminMenu from "./AdminMenu";

// const LocationDetector = () => {
//   const location = useLocation();
//   return <div>{location.pathname}</div>;
// };

describe("AdminMenu Component", () => {
  it("renders text options", () => {
    const { getByText } = render(
      <MemoryRouter>
        <AdminMenu />
      </MemoryRouter>
    );

    expect(getByText("Admin Panel")).toBeInTheDocument();
    expect(getByText("Create Category")).toBeInTheDocument();
    expect(getByText("Create Product")).toBeInTheDocument();
    expect(getByText("Products")).toBeInTheDocument();
    expect(getByText("Orders")).toBeInTheDocument();
  });

  it("should take the user to the correct page when the user clicks on the option", () => {
    const { getByText } = render(
      <MemoryRouter>
        <AdminMenu />
      </MemoryRouter>
    );

    // Alternatively, we could have rendered the location using the LocationDetector component
    expect(getByText("Create Category").closest("a")).toHaveAttribute("href", "/dashboard/admin/create-category");
    expect(getByText("Create Product").closest("a")).toHaveAttribute("href", "/dashboard/admin/create-product");
    expect(getByText("Products").closest("a")).toHaveAttribute("href", "/dashboard/admin/products");
    expect(getByText("Orders").closest("a")).toHaveAttribute("href", "/dashboard/admin/orders");
  });
});
