import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import axios from "axios";
// import { useAuthStore } from '../stores';

const vashApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

//TODO: interceptops
vashApi.interceptors.request.use((config) => {
  //   const token = useAuthStore.getState().token;
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export { vashApi };
