import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import BasicDetails from "../../components/admin/orders/BasicDetails";
import CustomerInfo from "../../components/admin/orders/CustomerInfo";
import Header from "../../components/admin/orders/Header";
import Notes from "../../components/admin/orders/Notes";
import PaymentStatus from "../../components/admin/orders/PaymentStatus";
import ProductList from "../../components/admin/orders/ProductList";
import Timeline from "../../components/admin/orders/Timeline";
import { useGetOrderById } from "../../hooks/orders/queries";
import { formatCurrency } from "../../lib/helper";

const fallbackData = [];

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { isPending, order } = useGetOrderById(orderId);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const columns = useMemo(
    () => [
      {
        header: "Producto",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-sm">
            <div className="p-1 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img
                loading="lazy"
                src={row.original.image}
                alt={row.original.name}
                className="w-10 h-10 object-contain bg-gray-100 rounded-lg"
              />
            </div>
            <span className="font-medium text-wrap">{row.original.name}</span>
          </div>
        ),
      },
      {
        header: "Cantidad",
        accessorKey: "quantity",
        cell: ({ row }) => (
          <div className="font-medium text-right">{row.original.quantity}</div>
        ),
        meta: {
          headerClassName: "text-right",
        },
      },
      {
        header: "Precio Unitario",
        accessorKey: "price",
        cell: ({ row }) => (
          <div className="font-medium text-nowrap text-right">
            {formatCurrency(row.original.price)}
          </div>
        ),
        meta: {
          headerClassName: "text-right",
        },
      },
      {
        header: "Total",
        cell: ({ row }) => (
          <div className="text-emerald-600 font-medium text-nowrap text-right">
            {formatCurrency(row.original.price * row.original.quantity)}
          </div>
        ),
        meta: {
          headerClassName: "text-right",
        },
      },
    ],
    [],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: order?.orderItems || fallbackData,
    columns,
    state: {
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <section className="space-y-3">
      <Header />
      <BasicDetails order={order} isPending={isPending} />

      <div className="flex flex-col xl:flex-row gap-6 mt-6">
        <div className="flex-1 space-y-6">
          <ProductList table={table} isPending={isPending} />
          <PaymentStatus order={order} isPending={isPending} />
          <Timeline />
        </div>

        <div className="xl:w-1/3 space-y-6 sticky top-50 self-start">
          <CustomerInfo
            customer={order?.customer}
            shippingAddress={order?.shippingAddress}
            isPending={isPending}
          />
          <Notes isPending={isPending} />
        </div>
      </div>
    </section>
  );
}
