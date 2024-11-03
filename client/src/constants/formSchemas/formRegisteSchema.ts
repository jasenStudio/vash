import { z } from "zod";
import {
  registerValidationMessage as registerVM,
  commonValidationMessage as commonVM,
} from "../";

export const formRegisterSchema = z
  .object({
    email: z.string().email({ message: registerVM.email.message }),
    username: z
      .string({
        required_error: commonVM.required("usuario"),
      })
      .min(4, { message: commonVM.minLength(4) }),
    password: z
      .string()
      .min(6, { message: commonVM.minLength(6) })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[._*+\-])[A-Za-z\d._*+\-]{6,}$/, {
        message: registerVM.password.message,
      }),
    confirmPassword: z.string({
      required_error: registerVM.confirmPassword.required,
    }),
    termsAndConditions: z.boolean().default(false),
  })
  .refine((data) => data.termsAndConditions === true, {
    message: "debe aceptar los terminos y condiciones",
    path: ["termsAndConditions"],
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: registerVM.confirmPassword.message,
      });
    }

    if (/\s/.test(data.username)) {
      ctx.addIssue({
        code: "custom",
        path: ["username"],
        message: "El nombre de usuario no debe contener espacios.",
      });
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(data.username)) {
      ctx.addIssue({
        code: "custom",
        path: ["username"],
        message:
          "El nombre de usuario solo puede contener letras, números, (_)(.)(-).",
      });
    }

    if (data.username.includes("@")) {
      ctx.addIssue({
        code: "custom",
        path: ["username"],
        message: "Usuario no puede ser un correo electronico",
      });
    }
  });
