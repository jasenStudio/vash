import { ModeToggle } from "@/components/ui/mode-toggle";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  return (
    <>
      <div className="w-full sm:w-[450px]">
        <div className="absolute ml-10 right-5 top-5">
          <ModeToggle />
        </div>

        <div className="pl-10 mb-10">
          <h2 className="text-4xl font-bold">Crear Cuenta</h2>
          <span> ¿Ya tienes una cuenta?</span>
          <Link
            className="ml-2 text-gray-700 dark:text-gray-400 font-semibold "
            to="/sign-in"
          >
            Iniciar sesión
          </Link>
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input type="email" id="email" />
        </div>

        <div>
          <label htmlFor="usuario">usuario</label>
          <input type="text" id="usuario" />
        </div>

        <div>
          <label htmlFor="contraseña">contraseña</label>
          <input type="email" id="contraseña" />
        </div>

        <div>
          <label htmlFor="confirmPassword">confirmar contraseña</label>
          <input type="password" id="confirmPassword" />
        </div>

        <button>Crear Cuenta</button>
      </div>
    </>
  );
};
