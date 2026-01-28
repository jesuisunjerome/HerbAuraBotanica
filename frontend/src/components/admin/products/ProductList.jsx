import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  FileTextIcon,
  LightbulbIcon,
  LightbulbOffIcon,
  PlusCircleIcon,
  SquarePenIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUpdateProductStatus } from "../../../hooks/products/mutations";
import { useFetchProducts } from "../../../hooks/products/queries";
import { formatCurrency, formatShortDateToString } from "../../../lib/helper";
import TableWrapper, {
  SearchInput,
  TBody,
  THead,
  TNoData,
} from "../../common/TableWrapper";

const fallbackData = [];
export default function ProductList() {
  const navigate = useNavigate();
  const { isPending, products } = useFetchProducts();
  const { isUpdatingStatus, updateProductStatus } = useUpdateProductStatus();

  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-sm">
            <div className="p-2 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img
                loading="lazy"
                src={row.original.images.find((img) => img.isMain)?.url}
                alt={row.original.name}
                className="w-10 h-10 object-contain bg-gray-100 rounded-lg"
              />
            </div>
            <span className="font-medium text-wrap">{row.original.name}</span>
          </div>
        ),
      },
      {
        header: "Categoría",
        accessorKey: "category",
      },
      {
        header: "Precio",
        accessorKey: "price",
        cell: ({ row }) => (
          <span className="text-emerald-600 font-medium text-nowrap">
            {formatCurrency(row.original.price)}
          </span>
        ),
      },
      {
        header: "Stock",
        accessorKey: "stockQuantity",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.stockQuantity}</span>
        ),
      },
      {
        header: "Estado",
        accessorKey: "isActive",
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          const statusStyles = isActive
            ? "bg-emerald-100 text-emerald-800"
            : "bg-rose-100 text-rose-800";

          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles}`}
            >
              {isActive ? "Activo" : "Inactivo"}
            </span>
          );
        },
      },
      {
        header: "Fecha de Creación",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <div>
            <p className="leading-tight">
              {formatShortDateToString(new Date(row.original.createdAt))}
            </p>
            <span className="text-gray-500 text-sm">
              {new Date(row.original.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ),
      },
      {
        header: "Acciones",
        accessorKey: "actions",
        enableSorting: false,
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          const productId = row.original._id;

          return (
            <div className="flex gap-2 items-center">
              <button
                type="button"
                title="Editar producto"
                disabled={isUpdatingStatus}
                onClick={() => navigate(`/admin/products/edit?id=${productId}`)}
                className="rounded-md p-1 h-8 w-8 flex items-center justify-center transition-colors bg-blue-100 hover:bg-blue-200"
              >
                <SquarePenIcon className="h-4 w-4 text-blue-600" />
              </button>
              <button
                type="button"
                title={isActive ? "Desactivar producto" : "Activar producto"}
                disabled={isUpdatingStatus}
                onClick={() => updateProductStatus(productId)}
                className={`rounded-md p-1 h-8 w-8 flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-amber-100 hover:bg-amber-200 text-amber-800"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {isActive ? (
                  <LightbulbIcon className="h-4 w-4" />
                ) : (
                  <LightbulbOffIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: products ?? fallbackData,
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="space-y-3">
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start lg:items-end gap-4 bg-gray-50 pb-3 pt-4 sticky top-15 z-10">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <div className="text-gray-600">
            Administra todos los productos disponibles en la tienda.
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <SearchInput table={table} placeholder="Buscar productos..." />
          <Link
            title="Agregar Nuevo Producto"
            to="/admin/products/new"
            className="flex items-center justify-center gap-2 px-4 py-2  rounded bg-amber-600 text-white hover:bg-amber-700 transition group hover:shadow-lg hover:-translate-y-0.5"
          >
            <PlusCircleIcon className="w-5 h-5" />
            {/* Nuevo Producto */}
          </Link>
          <button
            title="Descargar Archivo"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-200 text-white hover:bg-[#16a34a]
             rounded  transition"
          >
            <FileTextIcon className="w-5 h-5" />
            {/* Descargar Archivo */}
          </button>
        </div>
      </div>

      <TableWrapper isPending={isPending} pagination={table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <THead key={headerGroup.id} headerGroup={headerGroup} />
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <TNoData colSpan={columns.length} />
          ) : (
            table
              .getRowModel()
              .rows.map((row) => <TBody key={row.id} row={row} />)
          )}
        </tbody>
      </TableWrapper>
    </section>
  );
}
