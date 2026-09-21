import TableWrapper, {
  SearchInput,
  TBody,
  THead,
  TNoData,
} from "../../common/TableWrapper";

export default function ReportTableCard({
  title,
  subtitle,
  icon,
  table,
  columnsLength,
  emptyMessage = "No hay datos disponibles.",
  searchPlaceholder = "Buscar...",
  isPending,
  className = "",
  headerClassName = "",
  actionElement,
}) {
  return (
    <div
      className={`rounded-2xl shadow-lg shadow-gray-100 bg-white overflow-hidden flex flex-col h-full ${className}`}
    >
      <div className="p-5 border-b border-gray-100 flex flex-col flex-wrap sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${headerClassName}`}>
            {icon && icon}
            {title}
          </h2>
          {subtitle && <p className="text-xs text-gray-500 leading-tight">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          {table && <SearchInput table={table} placeholder={searchPlaceholder} />}
          {actionElement}
        </div>
      </div>

      {table && (
        <TableWrapper
          isPending={isPending}
          pagination={table}
          className="grow min-h-80!"
        >
          <thead className="bg-[#f5f0e6]/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <THead key={headerGroup.id} headerGroup={headerGroup} />
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <TNoData colSpan={columnsLength}>{emptyMessage}</TNoData>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TBody key={row.id} row={row} />
              ))
            )}
          </tbody>
        </TableWrapper>
      )}
    </div>
  );
}
