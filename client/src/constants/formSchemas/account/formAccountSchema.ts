import { z } from "zod";

import { commonValidationMessage as commonVM } from "@/constants/validationsMessages";

export const formAccountSchema = z.object({
  account_email: z
    .string({
      required_error: commonVM.required("correo electrónico para cuenta"),
    })
    .email({ message: commonVM.email.message }),
  status: z.string().default("true"),
});
