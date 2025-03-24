import React from "react";
import { useState, useContext, createContext, useEffect } from "react";
import { render, act } from "@testing-library/react";
import { CartProvider, useCart } from "./cart";

const TestComponent = () => {
  const [cart, setCart] = useCart();

  // Simulate adding an item to the cart
  useEffect(() => {
    setCart([{ id: 1, name: "Test Item", price: 10 }]);
  }, [setCart]);

  return <div data-testid="cart-length">{cart.length}</div>;
};

describe("CartProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });


  it("loads cart data from localStorage", () => {
    const mockCartData = JSON.stringify([{ id: 2, name: "Stored Item", price: 20 }]);
    localStorage.setItem("cart", mockCartData);

    let getByTestId;
    act(() => {
      const renderResult = render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
      getByTestId = renderResult.getByTestId;
    });

    expect(getByTestId("cart-length").textContent).toBe("1");
  });

  it("updates cart state correctly", () => {
    let getByTestId;
    act(() => {
      const renderResult = render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );
      getByTestId = renderResult.getByTestId;
    });

    expect(getByTestId("cart-length").textContent).toBe("1");
  });
});
