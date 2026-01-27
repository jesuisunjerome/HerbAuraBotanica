import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CircleXIcon,
  EllipsisIcon,
  FileTextIcon,
  LoaderIcon,
  PackageCheckIcon,
  TruckElectricIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import TableWrapper, {
  SearchInput,
  TBody,
  THead,
  TNoData,
} from "../../components/common/TableWrapper";
import { useGetAllOrders } from "../../hooks/orders/queries";
import {
  formatCurrency,
  formatShortDateToString,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "../../lib/helper";

const fallbackData = [];

export default function OrdersPage() {
  const { isPending, orders } = useGetAllOrders();
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns = useMemo(
    () => [
      {
        header: "ID de Pedido",
        accessorKey: "_id",
      },
      {
        header: "Cliente",
        accessorKey: "shippingDetails",
        cell: ({ row }) => {
          const { user } = row.original.shippingDetails;

          return (
            <div>
              <p className="leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <span className="text-gray-500 text-sm">{user.email}</span>
            </div>
          );
        },
      },
      {
        header: "Estado",
        accessorKey: "status",
        cell: ({ row }) => {
          const { status, isReturned, deliveredAt, returnedAt } = row.original;

          const statusStyles =
            status === ORDER_STATUS.DELIVERED
              ? {
                  color: "text-emerald-600",
                  icon: <PackageCheckIcon className="w-4 h-4" />,
                }
              : status === ORDER_STATUS.SHIPPED
                ? {
                    color: "text-blue-600",
                    icon: <TruckElectricIcon className="w-4 h-4" />,
                  }
                : status === ORDER_STATUS.PROCESSING
                  ? {
                      color: "text-yellow-600",
                      icon: <LoaderIcon className="w-4 h-4" />,
                    }
                  : {
                      color: "text-rose-600",
                      icon: <CircleXIcon className="w-4 h-4" />,
                    };

          return (
            <div className={statusStyles.color}>
              <p className="flex leading-tight items-center gap-1 font-medium">
                {statusStyles.icon} {status}
              </p>
              {isReturned && (
                <span>
                  {formatShortDateToString(new Date(row.original.returnedAt))}
                </span>
              )}
              {deliveredAt && !isReturned && (
                <span>{formatShortDateToString(new Date(deliveredAt))}</span>
              )}
            </div>
          );
        },
      },
      {
        header: "Artículos",
        accessorKey: "orderItems",
        cell: ({ row }) => {
          const items = row.original.orderItems;
          return <span className="font-medium">{items.length} </span>;
        },
      },
      {
        header: "Total",
        accessorKey: "totalAmount",
        cell: ({ row }) => (
          <span className="text-emerald-600 font-medium text-nowrap">
            {formatCurrency(row.original.totalAmount)}
          </span>
        ),
      },
      {
        header: "Pago",
        accessorKey: "paymentStatus",
        cell: ({ row }) => {
          const status = row.original.paymentStatus;
          const statusStyles =
            status === PAYMENT_STATUS.PAID
              ? "text-emerald-600"
              : status === PAYMENT_STATUS.PENDING
                ? "text-yellow-600"
                : "text-rose-600";

          return (
            <span className={`font-medium ${statusStyles}`}>{status}</span>
          );
        },
      },
      {
        header: "Fecha",
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
        header: "Dirección",
        accessorKey: "shippingDetails",
        cell: ({ row }) => {
          const { address, city, country } = row.original.shippingDetails.user;
          return (
            <div>
              <p className="leading-tight">{address}</p>
              <span className="text-gray-500 text-sm">
                {city}, {country}
              </span>
            </div>
          );
        },
      },
      {
        header: "Acciones",
        accessorKey: "actions",
        enableSorting: false,
        cell: ({ row }) => {
          const orderId = row.original._id;

          return (
            <div className="flex gap-2 items-center">
              <button
                type="button"
                title="Ver detalles del pedido"
                className="rounded-md p-1 h-8 w-8 flex items-center justify-center transition-colors bg-blue-100 hover:bg-blue-200"
              >
                <EllipsisIcon className="h-4 w-4 text-blue-600" />
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
    data: orders ?? fallbackData,
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
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start lg:items-center gap-4 bg-gray-50 pb-3 pt-4 sticky top-15 z-10">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <SearchInput table={table} placeholder="Buscar pedidos..." />

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
