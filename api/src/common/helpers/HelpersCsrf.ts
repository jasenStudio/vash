import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';

// Instancia la configuración CSRF una sola vez
const csrfOptions: DoubleCsrfConfigOptions = {
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: 'csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'prod',
    sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'lax',
  },
};

// Instancia solo una vez los métodos de CSRF
const { generateToken, doubleCsrfProtection, validateRequest } =
  doubleCsrf(csrfOptions);

// Exporta directamente los métodos que necesitas
export { generateToken, doubleCsrfProtection, validateRequest };
