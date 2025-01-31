import { getDeviceType } from "@/lib/deviceType";

import axios, { AxiosError } from "axios";

const vashApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

vashApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject(error);

    // if (error.response) {
    //   let status = error.response.status;
    //   const lgout = useAuthStore.getState().logout;

    //   if (status === 401 || status === 403) {
    //     console.error("Token no válido o expirado");

    //     status = 0;
    //     lgout();
    //     return;
    //   } else if (status === 503) {
    //     console.error("El servidor no está disponible. Inténtalo más tarde.");
    //   }

    //   return Promise.reject(error.response.data);
    // }

    return Promise.reject(error);
  }
);

vashApi.interceptors.request.use((config) => {
  console.log(getDeviceType());
  const device = getDeviceType();
  config.headers["x-device-info"] = device;

  return config;
});

export { vashApi };
