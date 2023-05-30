// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spinner from "./Spinner"


test('sanity', () => {
  expect(true).toBe(true)
});

test('renders Spinner component', () => {
  render(<Spinner on={true} />);

  // Assuming your Spinner component has "Please wait..." text when it's rendering.
  const spinnerElement = screen.queryByText("Please wait...");
  expect(spinnerElement).toBeInTheDocument();
});