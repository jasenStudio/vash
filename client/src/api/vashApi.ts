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

let csrfToken: string | null = null;
let isFetchingCsrf = false;

export async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  if (isFetchingCsrf) return null;

  isFetchingCsrf = true;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/token-csrf`,
      { withCredentials: true }
    );

    csrfToken = response.data.token;

    return csrfToken;
  } catch (error) {
    throw error;
  } finally {
    isFetchingCsrf = false;
  }
}

vashApi.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.data) {
      const errorResponse = (error.response?.data as { error: string }).error;
      if (errorResponse === "session_expired") {
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
      "/api/auth/logout",
    ];

    // Verificar si la URL termina exactamente en una de las rutas excluidas
    if (!excludedRoutes.some((route) => config.url?.endsWith(route))) {
      if (!csrfToken) {
        console.log("aQUI");
        csrfToken = await getCsrfToken();
      }
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }
  } catch (error) {
    throw error;
  }
  return config;
});

export { vashApi };
