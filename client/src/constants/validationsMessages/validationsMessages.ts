export const commonValidationMessage = {
  required: (fieldname: string) => `El campo ${fieldname} es requerido.`,
  minLength: (length: number) => `Debe tener al menos ${length} caracteres.`,
  maxLength: (length: number) => `No debe exceder de ${length} caracteres.`,
};

export const registerValidationMessage = {
  email: {
    message: "Ingresa un correo electronico valido",
  },
  username: {
    message: "",
    uniqueUsername: "El nombre de usuario ya está en uso.",
  },
  password: {
    message:
      "La contraseña debe tener al menos una mayúscula, un número y un carácter especial permitido (., _, *, +, -).",
  },
  confirmPassword: {
    required: "La confirmación de la contraseña es obligatoria.",
    message: "La confirmación de la contraseña no coincide.",
  },
};
