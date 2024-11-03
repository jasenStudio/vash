import axios from "axios";
// import { useAuthStore } from '../stores';

const tesloApi = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

//TODO: interceptops
tesloApi.interceptors.request.use((config) => {
  //   const token = useAuthStore.getState().token;
  const token = "";
  console.log(token);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export { tesloApi };
