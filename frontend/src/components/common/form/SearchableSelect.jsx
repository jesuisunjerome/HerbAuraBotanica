import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Selecciona una opción",
  id,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search term
  const allFiltered = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Limit to 10 to improve performance
  const filteredOptions = allFiltered.slice(0, 10);
  const hiddenCount = allFiltered.length - filteredOptions.length;

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        id={id}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="flex w-full cursor-pointer items-center justify-between rounded-md border border-[#3f6b4c]/25 bg-white px-3 py-2 text-sm focus:border-[#3f6b4c] focus:outline-none focus:ring-1 focus:ring-[#3f6b4c]"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <div className="sticky top-0 flex items-center bg-white px-2 pb-1 pt-1">
            <SearchIcon className="absolute left-4 h-4 w-4 text-gray-400" />
            <input
              type="text"
              autoFocus
              className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2 text-sm focus:border-[#3f6b4c] focus:outline-none focus:ring-1 focus:ring-[#3f6b4c]"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <ul className="mt-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                No se encontraron resultados
              </li>
            ) : (
              <>
                {filteredOptions.map((opt) => (
                  <li
                    key={opt.value}
                    className={`cursor-pointer px-3 py-2 text-sm hover:bg-[#f5f0e6] ${opt.value === value
                      ? "bg-[#f5f0e6] font-medium text-[#3f6b4c]"
                      : "text-gray-700"
                      }`}
                  >
                    <button type="button" className="hover:translate-none!" onClick={() => handleSelect(opt.value)}>
                      {opt.label}
                    </button>
                  </li>
                ))}
                {hiddenCount > 0 && (
                  <li className="px-3 py-2 text-xs text-center text-gray-500 italic bg-gray-50 cursor-default">
                    Y {hiddenCount} más... Escribe para afinar la búsqueda.
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
