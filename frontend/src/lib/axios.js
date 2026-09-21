import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import router from "../routes/Routes";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (err) => {
  refreshSubscribers.map((callback) => callback(err));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const isLogin = originalRequest.url.includes("/auth/login");
      const isRegister = originalRequest.url.includes("/auth/register");
      const isRefreshToken = originalRequest.url.includes("/auth/refresh-token");

      // Si falla el login o registro con 401, devolvemos el error al formulario
      if (isLogin || isRegister) {
        return Promise.reject(error);
      }

      // Si falla cualquier otra ruta (incluyendo /auth/me), intentamos refrescar el token
      if (!isRefreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            console.log("Token expirado. Refrescando silenciosamente...");
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
              {},
              {
                withCredentials: true,
                headers: { "X-Requested-With": "XMLHttpRequest" },
              }
            );

            isRefreshing = false;
            onRefreshed(null);

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            onRefreshed(refreshError);

            if (window.location.pathname !== "/login") {
              queryClient.clear();
              queryClient.invalidateQueries();
              router.navigate("/login");
            }
            return Promise.reject(refreshError);
          }
        }

        // Si ya se está refrescando, encolamos la petición
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((err) => {
            if (err) {
              reject(err);
            } else {
              resolve(axiosInstance(originalRequest));
            }
          });
        });
      }

      // Si la que falló directamente fue el refresh-token, desloguear
      if (isRefreshToken) {
        if (window.location.pathname !== "/login") {
          queryClient.clear();
          queryClient.invalidateQueries();
          router.navigate("/login");
        }
      }
    }
    
    return Promise.reject(error);
  },
);
