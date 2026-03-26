import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useGoogleLogin } from "../../../hooks/auth/mutations";

export default function GoogleButton() {
  const { googleLogin } = useGoogleLogin();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        auto_select={false}
        prompt="select_account"
        theme="filled_blue"
        onSuccess={async (credentialResponse) =>
          await googleLogin(credentialResponse.credential)
        }
        onError={() => toast.error("Error en login con Google")}
      />

       {/* <button
      // onClick={() => googleLogin()}
      style={{
            lineHeight: 1,
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          }}
          className="border border-gray-300 hover:bg-blue-50 hover:border-blue-100 bg-white text-gray-600 flex items-center justify-center gap-2 p-2 text-lg rounded group transition hover:translate-0 w-full"
    >
             <img src="/icons/google.webp" alt="Google Logo" className="h-6" />
      <span className="md:hidden">Acceder con</span> Google
    </button> */}

    </GoogleOAuthProvider>
  );
}
