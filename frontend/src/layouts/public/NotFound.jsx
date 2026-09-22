import { useNavigate } from "react-router";
import NoData from "../../components/common/NoData";
import { ChevronLeftIcon } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="bg-white py-10 text-center">
            <NoData img="/images/no-products.webp" message="Página no encontrada" />
            <button
                onClick={() => navigate(-1)}
                className="inline-block bg-amber-600 text-white px-5 text-sm py-3 rounded group hover:bg-amber-700 transition hover:shadow-lg hover:-translate-y-0.5"
            >
                <ChevronLeftIcon className="inline w-4 h-4 mr-2 group-hover:-translate-x-2 transition-all" />
                Volver
            </button>
        </div>
    );
}
