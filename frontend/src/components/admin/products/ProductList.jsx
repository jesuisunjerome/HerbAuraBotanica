import { FileTextIcon, PlusCircleIcon } from "lucide-react";
import { Link } from "react-router";

export default function ProductList() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Link
            title="Agregar Nuevo Producto"
            to="/admin/products/new"
            className="flex items-center justify-center gap-2 px-4 py-2  rounded bg-amber-600 text-white hover:bg-amber-700 transition group hover:shadow-lg hover:-translate-y-0.5"
          >
            <PlusCircleIcon className="w-5 h-5 md:hidden lg:inline-block" />
            {/* Nuevo Producto */}
          </Link>
          <button
            title="Descargar Archivo"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-200 text-white hover:bg-[#16a34a]
             rounded  transition"
          >
            <FileTextIcon className="w-5 h-5 md:hidden lg:inline-block" />
            {/* Descargar Archivo */}
          </button>
        </div>
      </div>

      <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white p-5">
        {/* Table of products will go here */}
      </div>
    </section>
  );
}
