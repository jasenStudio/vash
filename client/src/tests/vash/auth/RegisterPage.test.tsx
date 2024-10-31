import { RegisterPage } from "@/vash/auth/pages/RegisterPage";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("Register page", () => {
  const registerPage = (
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
  it("renderizar el formulario de registro", () => {
    render(registerPage);
    const inputEmail = screen.getByLabelText(/email/i);
    expect(inputEmail).toBeInTheDocument();

    const inputUsername = screen.getByLabelText(/usuario/i);
    expect(inputUsername).toBeInTheDocument();

    const inputPassword = screen.getByLabelText("contraseña");
    expect(inputPassword).toBeInTheDocument();

    const inputConfirmedPassword = screen.getByLabelText(
      "confirmar contraseña"
    );
    expect(inputConfirmedPassword).toBeInTheDocument();

    const RegisterButton = screen.getByRole("button", {
      name: /Crear Cuenta/i,
    });
    expect(RegisterButton).toBeInTheDocument();
  });
});
