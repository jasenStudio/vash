// import { getDeviceType } from "@/lib/deviceType";
// import { useAuthStore } from "@/vash/store/auth/useAuthStore";
// import axios, { AxiosError } from "axios";

// const vashApi = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// let activeCsrfRequest: Promise<string> | null = null;

// export async function getFreshCsrfToken(): Promise<string> {
//   if (activeCsrfRequest) {
//     return activeCsrfRequest;
//   }

//   try {
//     activeCsrfRequest = axios
//       .get(`${import.meta.env.VITE_API_URL}/auth/token-csrf`, {
//         withCredentials: true,
//       })
//       .then((response) => {
//         return response.data.token;
//       })
//       .finally(() => {
//         activeCsrfRequest = null;
//       });

//     return await activeCsrfRequest;
//   } catch (error) {
//     activeCsrfRequest = null;
//     if (axios.isAxiosError(error) && error.response?.status === 401) {
//       useAuthStore.getState().actionUnauthenticated();
//     }
//     throw new Error("Failed to get CSRF token");
//   }
// }

// vashApi.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.data) {
//       const errorData = error.response.data as { error?: string };
//       if (
//         errorData.error === "session_expired" ||
//         error.response.status === 401
//       ) {
//         useAuthStore.getState().actionUnauthenticated();
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// vashApi.interceptors.request.use(async (config) => {
//   try {
//     config.headers["x-device-info"] = getDeviceType();

//     const excludedRoutes = [
//       "/auth/token-csrf",
//       "/auth/renew",
//       "/auth/sign-in",
//       "/auth/sign-up",
//       "/auth/logout",
//     ];

//     const isExcluded = excludedRoutes.some(
//       (route) => config.url?.endsWith(route) || config.url?.includes(route)
//     );

//     if (!isExcluded) {
//       // Obtener un token fresco para cada petición
//       const freshToken = await getFreshCsrfToken();
//       config.headers["X-CSRF-Token"] = freshToken;
//     }
//   } catch (error) {
//     console.error("Error getting CSRF token:", error);
//     // Puedes decidir si rechazar la petición o continuar sin CSRF
//     // throw error; // Descomenta si quieres bloquear peticiones sin CSRF
//   }
//   return config;
// });

// export { vashApi };

import { getDeviceType } from "@/lib/deviceType";
import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import axios, { AxiosError } from "axios";

const vashApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Almacena token y su tiempo de expiración
let csrfTokenData: {
  token: string | null;
  expiresAt: number | null;
} = {
  token: null,
  expiresAt: null,
};

let activeCsrfRequest: Promise<string> | null = null;

const CSRF_TOKEN_VALIDITY = 10 * 60 * 1000; // 10 minutos en milisegundos

export async function getCsrfToken(): Promise<string> {
  // Si el token existe y no ha expirado, devolverlo
  if (
    csrfTokenData.token &&
    csrfTokenData.expiresAt &&
    csrfTokenData.expiresAt > Date.now()
  ) {
    console.log(csrfTokenData.expiresAt);

    console.log("caes aqui");
    return csrfTokenData.token;
  }

  // Si ya hay una solicitud en curso, esperar su resultado
  if (activeCsrfRequest) {
    return activeCsrfRequest;
  }

  try {
    activeCsrfRequest = axios
      .get(`${import.meta.env.VITE_API_URL}/auth/token-csrf`, {
        withCredentials: true,
      })
      .then((response) => {
        // Almacenar token y tiempo de expiración
        csrfTokenData = {
          token: response.data.token,
          expiresAt: Date.now() + CSRF_TOKEN_VALIDITY,
        };
        return response.data.token;
      })
      .finally(() => {
        activeCsrfRequest = null;
      });

    return await activeCsrfRequest;
  } catch (error) {
    activeCsrfRequest = null;
    csrfTokenData = { token: null, expiresAt: null }; // Limpiar datos inválidos

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        useAuthStore.getState().actionUnauthenticated();
      }
      throw new Error(
        error.response?.data?.message || "Failed to get CSRF token"
      );
    }
    throw new Error("Network error when requesting CSRF token");
  }
}

vashApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.data) {
      const errorData = error.response.data as { error?: string };

      // Invalidar token CSRF en caso de errores de autenticación
      if (
        errorData.error === "session_expired" ||
        error.response.status === 401
      ) {
        csrfTokenData = { token: null, expiresAt: null };
        useAuthStore.getState().actionUnauthenticated();
      }

      // Manejar específicamente errores CSRF
      if (error.response.status === 403 && errorData.error?.includes("CSRF")) {
        csrfTokenData = { token: null, expiresAt: null }; // Forzar renovación
      }
    }
    return Promise.reject(error);
  }
);

vashApi.interceptors.request.use(async (config) => {
  try {
    config.headers["x-device-info"] = getDeviceType();

    const excludedRoutes = [
      "/auth/token-csrf",
      "/auth/renew",
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/logout",
    ];

    const isExcluded = excludedRoutes.some(
      (route) => config.url?.endsWith(route) || config.url?.includes(route)
    );

    if (!isExcluded) {
      const token = await getCsrfToken();
      config.headers["X-CSRF-Token"] = token;
      console.log(token);
      if (process.env.NODE_ENV !== "prod") {
        console.log(
          `CSRF Token usado - Expira en: ${
            csrfTokenData.expiresAt
              ? (csrfTokenData.expiresAt - Date.now()) / 1000
              : "N/A"
          } segundos`
        );
      }
    }
  } catch (error) {
    console.error("CSRF token error:", error);
    // Opción 1: Continuar sin token (no recomendado para producción)
    // Opción 2: Rechazar la petición (mejor para seguridad)
    throw error; // Recomiendo esta opción para entornos productivos
  }
  return config;
});

export { vashApi };
