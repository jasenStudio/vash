import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginPage } from "@/vash/auth/pages/LoginPage";
import { BrowserRouter } from "react-router-dom";

describe("Login Page", () => {
  it("renderiza el formulario de login con los campos email y contraseña", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Usuario o Correo Electrónico/i);
    expect(emailInput).toBeInTheDocument();

    const paswordInput = screen.getByLabelText(/contraseña/i);
    expect(paswordInput).toBeInTheDocument();

    const loginButton = screen.getByRole("button", { name: /Ingresar/i });
    expect(loginButton).toBeInTheDocument();
  });
});
