import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';

export const customDoubleCsrf = () => {
  const csrfOptions: DoubleCsrfConfigOptions = {
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: 'csrf-token',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'lax',
    },
  };

  const { generateToken, doubleCsrfProtection, validateRequest } =
    doubleCsrf(csrfOptions);

  return {
    csrfOptions,
    generateToken,
    doubleCsrfProtection,
    validateRequest,
  };
};
