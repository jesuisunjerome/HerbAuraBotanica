import { useEffect } from "react";

export default function FacebookInit() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FB_CLIENT_ID,
        cookie: true,
        xfbml: false,
        version: "v19.0", // usa la versión más reciente
      });
    };
  }, []);

  return null; // no renderiza nada
}

