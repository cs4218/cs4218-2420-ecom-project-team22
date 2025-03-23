import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserMenu from '../components/UserMenu';
import "@testing-library/jest-dom";

test('renders user menu and navigates to profile and orders', () => {
  render(
    <MemoryRouter>
      <UserMenu />
    </MemoryRouter>
  );

  // Check if the menu items are rendered
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  expect(screen.getByText(/Orders/i)).toBeInTheDocument();
});
