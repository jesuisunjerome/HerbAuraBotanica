import { SlidersHorizontalIcon, XIcon } from "lucide-react";
import { SORT_BY_OPTIONS } from "../../../lib/helper";

export default function FilterProducts({
  handleSearchChange,
  handleSortChange,
  searchTerm,
  sortOption,
}) {
  return (
    <div
      className="flex flex-wrap justify-between gap-8 mb-10 sticky top-16 z-10 py-5"
      style={{
        background: "inherit",
      }}
    >
      <h1 className="text-3xl lg:text-4xl">
        🍃Catálogo de{" "}
        <span
          className="text-amber-600 relative"
          style={{
            fontFamily: "Playfair Display, serif",
          }}
        >
          Productos{" "}
          <span className="absolute -bottom-1 left-0 w-full h-2 bg-amber-200 rounded-lg animate-pulse"></span>
        </span>
      </h1>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
        <p className="hidden lg:flex items-center gap-2">
          Filtros: <SlidersHorizontalIcon />{" "}
        </p>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={() => {
                handleSearchChange({ target: { value: "" } });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <XIcon />
            </button>
          )}
        </div>
        <select
          className="border border-gray-300 rounded-md p-2 h-11 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={sortOption}
          onChange={handleSortChange}
        >
          {SORT_BY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
