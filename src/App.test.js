import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders login page by default", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  // Look for the button text instead of generic 'login'
   expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
});
