import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import router from "../routes/Routes";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { isPending: isConnectedUserLoading, data: connectedUser } = useQuery({
    queryKey: ["connectedUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");

      return response.data;
    },
    retry: false,
  });

  const { isPending: isLogoutLoading, mutate: logout } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout", {});
    },
    onSuccess: () => {
      console.log("UserContext logout");
      queryClient.clear();
      queryClient.invalidateQueries();
      router.navigate("/login");
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        `${error.response?.data?.message}` || "Error al cerrar sesión",
      );
    },
    retry: false, // No reintentar el logout en caso de error
  });

  return (
    <UserContext.Provider
      value={{ connectedUser, isConnectedUserLoading, isLogoutLoading, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
export { UserContext };
