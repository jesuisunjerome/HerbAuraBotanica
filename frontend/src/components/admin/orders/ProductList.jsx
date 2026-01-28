import TableWrapper, { TBody, THead } from "../../common/TableWrapper";

export default function ProductList({ table, isPending }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-medium">Productos</p>
      </div>
      <TableWrapper
        className="shadow-none px-0 min-h-auto"
        table={table}
        isPending={isPending}
        arrLength={3}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <THead key={headerGroup.id} headerGroup={headerGroup} />
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TBody key={row.id} row={row} />
          ))}
        </tbody>
      </TableWrapper>
    </div>
  );
}
