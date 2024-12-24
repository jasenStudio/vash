import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import axios, { AxiosError } from "axios";

const vashApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

vashApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.error("Token no válido o expirado");
        const logout = useAuthStore.getState().logout;
        logout();
      } else if (status === 503) {
        console.error("El servidor no está disponible. Inténtalo más tarde.");
      }

      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  }
);

vashApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export { vashApi };
