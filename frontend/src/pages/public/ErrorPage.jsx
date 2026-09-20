import { MoveLeft } from "lucide-react";
import { useNavigate, useRouteError } from "react-router";

export default function ErrorPage({ pathName }) {
    const error = useRouteError();
    const navigate = useNavigate();

    const handleClearCart = () => {
        localStorage.removeItem("cart-herbaura");
        navigate(pathName || "/");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-100">
            <div className="max-w-2xl mx-auto text-center py-10">
                <h1 className="text-4xl font-bold mb-2">Error Page</h1>
                <p className="text-lg mb-5">{error?.message || "Error al cargar la página"}</p>
                <button
                    type="button"
                    className="bg-amber-600 text-white px-5 text-sm py-2 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
                    onClick={handleClearCart}
                >
                    <MoveLeft className="inline w-5 h-5 mr-2 group-hover:-translate-x-2 transition-all" />
                    Regresar al inicio
                </button>
            </div>
        </div>
    );
}