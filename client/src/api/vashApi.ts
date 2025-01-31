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
  }
);

vashApi.interceptors.request.use((config) => {
  const device = getDeviceType();
  config.headers["x-device-info"] = device;

  return config;
});

export { vashApi };
