import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { axiosInstance } from "../../lib/axios";
// import { useGoogleLogin } from "@react-oauth/google";

//  const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       const response = await axiosInstance.post(
//         "/auth/google",
//         { credential: tokenResponse.credential },
//       );

//         return response.data;
//     },
//     onError: () => toast.error("Error en login con Google"),
//     flow: "implicit", // evita auto-selección
//     prompt: "select_account", // fuerza selector de cuentas
//   });


export const useGoogleLogin = () => {
  const navigate = useNavigate();

  const { isPending: isGoogleLoggingIn, mutateAsync: googleLogin } =
    useMutation({
      mutationFn: async (credential) => {
        const response = await axiosInstance.post(
          "/auth/google",
          { credential },
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

export const handleFacebookLogin = () => {
   window.FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          // Envía el accessToken al backend para validarlo con Graph API
          fetch("/api/auth/facebook", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken }),
          });
        } else {
          console.error("Login cancelado");
        }
      },
      { scope: "email,public_profile" } // permisos que necesitas
    );
}