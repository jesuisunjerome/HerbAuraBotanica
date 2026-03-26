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
    </GoogleOAuthProvider>
  );
}
