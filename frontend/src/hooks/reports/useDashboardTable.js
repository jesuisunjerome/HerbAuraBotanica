import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

/**
 * Custom hook para inicializar tablas de TanStack con la configuración estándar
 * del dashboard (Paginación, Filtros locales y Ordenamiento).
 *
 * @param {Array} data - Los datos de la tabla.
 * @param {Array} columns - Las columnas definidas para la tabla.
 * @param {number} pageSize - Elementos por página (default 5).
 * @returns {import("@tanstack/react-table").Table} - Instancia de la tabla
 */
export const useDashboardTable = (data = [], columns = [], pageSize = 5) => {
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });
};
