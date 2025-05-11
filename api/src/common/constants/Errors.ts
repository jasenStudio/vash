export const errors = {
  auth: {
    accessToken: {
      revoked: {
        error: 'access_token_revoked',
        message: 'Access token ha sido revocado',
      },
      invalid: {
        error: 'invalid_access_token',
        message: 'Access token inválido o expirado',
      },
    },
    session: {
      expired: {
        error: 'session_expired',
        message: 'Sesión expirada, inicie sesión nuevamente',
      },
    },
  },
};
