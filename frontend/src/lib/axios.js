import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import router from "../routes/Routes";

export const queryClient = new QueryClient();
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Axios interceptor", error);
      if (window.location.pathname !== "/login") {
        // Si el error es 401, redirige al usuario a la página de login
        queryClient.clear();
        queryClient.invalidateQueries();

        router.navigate("/login");
      }
    }
    return Promise.reject(error);
  },
);
