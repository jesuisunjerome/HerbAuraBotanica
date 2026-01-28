import { ChevronLeftIcon, FileTextIcon } from "lucide-react";
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-between items-start lg:items-end gap-4 bg-gray-50 pb-3 pt-4 sticky top-15 z-10">
      <div>
        <div className="mb-3">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="text-amber-600 hover:underline inline-flex items-center gap-1 group"
          >
            <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
            <span>Volver a Pedidos</span>
          </button>
        </div>
        <h1 className="text-2xl font-semibold">Detalles del Pedido</h1>
        <div className="text-gray-600">
          Revisa la información detallada del pedido realizado.
        </div>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <button
          title="Descargar Archivo"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-200 text-white hover:bg-[#16a34a]
                rounded  transition"
        >
          <FileTextIcon className="w-5 h-5" />
          {/* Descargar Archivo */}
        </button>
        <button
          title="Cancelar pedido"
          className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-rose-600 text-rose-600 rounded transition"
        >
          Cancelar Pedido
        </button>
      </div>
    </div>
  );
}
