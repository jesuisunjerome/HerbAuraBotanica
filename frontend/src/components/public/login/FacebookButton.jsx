import { handleFacebookLogin } from "../../../hooks/auth/mutations";

export default function FacebookButton() {
  return (<button
          onClick={handleFacebookLogin}
          style={{
            lineHeight: 1,
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          }}
          className="border border-gray-300 hover:bg-blue-50 hover:border-blue-100 bg-white text-gray-600 flex items-center justify-center gap-2 p-2 text-lg rounded group transition hover:translate-0 w-full"
        >
          <img src="/icons/facebook.png" alt="Facebook Logo" className="h-6" />
          <span className="md:hidden">Acceder con</span> Facebook
        </button>
  )
}
