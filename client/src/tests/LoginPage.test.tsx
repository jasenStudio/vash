import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginPage } from "../vash/auth/pages/LoginPage";

describe("Login Page", () => {
  it("renderiza el formulario de login con los campos email y contraseña", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();

    const paswordInput = screen.getByLabelText(/contraseña/i);
    expect(paswordInput).toBeInTheDocument();

    const loginButton = screen.getByRole("button", { name: /iniciar sesión/i });
    expect(loginButton).toBeInTheDocument();
  });
});
