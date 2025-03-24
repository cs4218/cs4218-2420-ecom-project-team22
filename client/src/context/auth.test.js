import { useState, useContext, createContext, useEffect } from "react";
import React from "react";
import { render, act } from "@testing-library/react";
import axios from "axios";
import { useAuth, AuthProvider } from "./auth.js";

jest.mock("axios");

const TestComponent = () => {
    const [auth, setAuth] = useAuth();
  
    useEffect(() => {
      setAuth({
        user: { name: "Test User", email: "test@example.com" },
        token: "mockToken",
      });
    }, [setAuth]);
  
    return <div data-testid="auth-user">{auth?.user?.name || "No User"}</div>;
  };


describe("AuthProvider", () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });
  
    it("loads auth data from localStorage", () => {
      const mockAuthData = JSON.stringify({
        user: { name: "Stored User", email: "stored@example.com" },
        token: "storedToken",
      });
  
      localStorage.setItem("auth", mockAuthData);
  
      let getByTestId;
      act(() => {
        const renderResult = render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
        getByTestId = renderResult.getByTestId;
      });
  
      expect(getByTestId("auth-user").textContent).toBe("Stored User");
    });
  
    it("updates auth state", () => {
      let getByTestId;
      act(() => {
        const renderResult = render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        );
        getByTestId = renderResult.getByTestId;
      });
  
      expect(getByTestId("auth-user").textContent).toBe("Test User");
    });
  });
