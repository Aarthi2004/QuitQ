import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// 1. Updated the test description to be accurate
test("renders home page on the root path", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  // 2. Check for the main heading of the Home Page
  expect(
    screen.getByRole("heading", { name: /welcome to quitq/i })
  ).toBeInTheDocument();

  // 3. Check for the "Sign In" element using the correct role: "link"
  expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
});