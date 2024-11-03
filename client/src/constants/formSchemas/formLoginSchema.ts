import { z } from "zod";
import { commonValidationMessage as commonVM } from "../";

export const formLoginSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    const { username, password } = data;

    if (username.includes("@")) {
      const emailValidation = z.string().email().safeParse(username);
      if (!emailValidation.success) {
        ctx.addIssue({
          code: "custom",
          path: ["username"],
          message: "Debe ser un correo válido.",
        });
      }
    } else {
      if (username.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["username"],
          message: "El nombre de usuario debe tener al menos un carácter.",
        });
      }
    }
    if (password.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: commonVM.required("contraseña"),
      });
    }
  });
