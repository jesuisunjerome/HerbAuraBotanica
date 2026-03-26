import axios from "axios";
// import FacebookLogin from "react-facebook-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

export default function FacebookButton() {
  const responseFacebook = async (response) => {
    await axios.post("/auth/facebook", {
      token: response.accessToken,
    });
    alert("Login con Facebook exitoso");
  };

  return (
    <FacebookLogin
      appId={import.meta.env.VITE__FB_CLIENT_ID}
      autoLoad={false}
      callback={responseFacebook}
      // buttonStyle={{
      //   backgroundColor: "AccentColor",
      //   borderRadius: "5px",
      //   border: "none",
      //   fontSize: "14px",
      //   color: "white",
      //   padding: "10px 20px",
      //   textTransform: "capitalize",
      //   width: "100%",
      //   fontFamily: "inherit",
      //   fontWeight: "500",
      // }}
      // textButton="Acceder con Facebook"
      // size="small"

      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          style={{
            lineHeight: 1,
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          }}
          className="border border-gray-300 hover:bg-blue-50 hover:border-blue-100 bg-white text-gray-600 flex items-center justify-center gap-2 p-2 md:p-1 rounded group transition hover:translate-0 w-full"
        >
          <img src="/icons/fb.png" alt="Facebook Logo" className="h-6" />
          <span className="md:hidden">Acceder con</span> Facebook
        </button>
      )}
    />
  );
}
