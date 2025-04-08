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

let activeCsrfRequest: Promise<string> | null = null;
let csrfToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function getFreshCsrfToken(): Promise<string> {
  const now = Date.now();

  if (csrfToken && tokenExpiresAt && now < tokenExpiresAt) {
    console.log("CSRF token aún es válido, evitando nueva petición");
    return csrfToken;
  }

  if (activeCsrfRequest) {
    return activeCsrfRequest;
  }

  try {
    activeCsrfRequest = axios
      .get(`${import.meta.env.VITE_API_URL}/auth/token-csrf`, {
        withCredentials: true,
      })
      .then((response) => {
        csrfToken = response.data.token;
        tokenExpiresAt = response.data.expiresAt;
        return csrfToken ?? "";
      })
      .finally(() => {
        activeCsrfRequest = null;
      });

    return await activeCsrfRequest;
  } catch (error) {
    activeCsrfRequest = null;
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().actionUnauthenticated();
    }
    throw new Error("Failed to get CSRF token");
  }
}

vashApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.data) {
      const errorData = error.response.data as { error?: string };
      if (
        errorData.error === "session_expired" ||
        error.response.status === 401
      ) {
        useAuthStore.getState().actionUnauthenticated();
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
      // Obtener un token fresco para cada petición
      const freshToken = await getFreshCsrfToken();

      config.headers["X-CSRF-Token"] = freshToken;
    }
  } catch (error) {
    console.error("Error getting CSRF token:", error);
    // Puedes decidir si rechazar la petición o continuar sin CSRF
    // throw error; // Descomenta si quieres bloquear peticiones sin CSRF
  }
  return config;
});

export { vashApi };
