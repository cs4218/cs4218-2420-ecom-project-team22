import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import HomePage from "./HomePage";

describe("Home Page", () => {
  test("should render properly", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  });
});
