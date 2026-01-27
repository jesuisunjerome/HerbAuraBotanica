import { flexRender } from "@tanstack/react-table";
import { MoveDownIcon, MoveUpIcon, SearchIcon } from "lucide-react";
import TableSkeleton from "./TableSkeleton";

export default function TableWrapper({ isPending, children, pagination }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white p-5 min-h-150">
      {isPending ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="overflow-auto">
            <table className="w-full table-auto border-collapse mb-3">
              {children}
            </table>
          </div>
          {pagination && <TPagination table={pagination} />}
        </>
      )}
    </div>
  );
}

export function THead({ headerGroup }) {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th
          key={header.id}
          colSpan={header.colSpan}
          className="px-4 py-3 text-left text-sm font-medium text-gray-500 whitespace-nowrap"
        >
          {header.isPlaceholder ? null : (
            <div
              {...{
                className: header.column.getCanSort()
                  ? "cursor-pointer select-none"
                  : "",
                onClick: header.column.getToggleSortingHandler(),
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.getIsSorted() === "asc" && (
                <MoveUpIcon className="inline-block w-4 h-4 ml-1" />
              )}
              {header.column.getIsSorted() === "desc" && (
                <MoveDownIcon className="inline-block w-4 h-4 ml-1" />
              )}
            </div>
          )}
        </th>
      ))}
    </tr>
  );
}

export function TBody({ row }) {
  return (
    <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export function TPagination({ table }) {
  return (
    <div className="py-3 flex flex-col md:flex-row justify-between items-center gap-2 border-t border-gray-100 text-gray-700">
      <div className="flex flex-col md:flex-row flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1">
          <span>Página</span>
          <span className="font-medium">
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          <span>({table.getFilteredRowModel().rows.length} resultados)</span>
        </div>
        <div className="hidden md:block">
          <span>| Mostrar </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row flex-wrap gap-2 items-center">
        <span className="flex items-center gap-1">
          Ir a la página:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border border-gray-200 focus:outline-none p-1 rounded w-16"
          />
        </span>
        <div className="flex items-center gap-2">
          <button
            className="border border-gray-200 focus:outline-none rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </button>
          <button
            className="border border-gray-200 focus:outline-none rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export function TNoData({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center text-sm text-gray-500 py-10">
        No hay datos disponibles.
      </td>
    </tr>
  );
}

export function SearchInput({ table, placeholder = "Buscar..." }) {
  const handleChange = (e) => {
    const value = e.target.value;
    table.setGlobalFilter(value);
  };

  const value = table.getState().globalFilter ?? "";

  return (
    <div className="relative">
      <input
        value={value}
        onChange={handleChange}
        className="w-64 max-w-[50vw] rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2"
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchIcon className="w-4 h-4" />
      </span>
    </div>
  );
}
