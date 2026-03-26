import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { axiosInstance } from "../../lib/axios";

export const useGoogleLogin = () => {
  const navigate = useNavigate();

  const { isPending: isGoogleLoggingIn, mutateAsync: googleLogin } =
    useMutation({
      mutationFn: async (token) => {
        const response = await axiosInstance.post(
          "/auth/google",
          { token },
          {
            withCredentials: true,
          },
        );
        return response.data;
      },
      onSuccess: (data) => {
        console.log(data);
        // toast.success("Login con Google exitoso");
        navigate("/admin/dashboard", { replace: true });
      },
      onError: (error) => {
        toast.error(
          `${error.response?.data?.message}` ||
            "Error al iniciar sesión con Google",
        );
      },
    });

  return { isGoogleLoggingIn, googleLogin };
};
