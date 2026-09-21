import { useMemo } from "react";
import { Link } from "react-router";
import { EllipsisIcon } from "lucide-react";
import OrderStatusBadge from "../orders/OrderStatusBadge";
import {
  formatCurrency,
  formatShortDateToString,
  PAYMENT_STATUS,
} from "../../../lib/helper";

export const useReportColumns = () => {
  const customerColumns = useMemo(
    () => [
      {
        header: "Cliente",
        accessorKey: "name",
        cell: ({ row }) => (
          <div>
            <p className="leading-tight font-medium text-gray-800">{row.original.name}</p>
            <span className="text-xs text-gray-500">{row.original._id}</span>
          </div>
        ),
      },
      {
        header: "Órdenes",
        accessorKey: "ordersCount",
        cell: ({ row }) => <span className="font-medium text-center block">{row.original.ordersCount}</span>,
      },
      {
        header: "Total Gastado",
        accessorKey: "totalSpent",
        cell: ({ row }) => (
          <span className="font-medium text-emerald-600">
            {formatCurrency(row.original.totalSpent)}
          </span>
        ),
      },
      {
        header: "Ticket Promedio",
        id: "aov",
        cell: ({ row }) => (
          <span>
            {formatCurrency(row.original.totalSpent / row.original.ordersCount)}
          </span>
        ),
      },
    ],
    [],
  );

  const productColumns = useMemo(
    () => [
      {
        header: "Producto",
        accessorKey: "name",
        cell: ({ row }) => <div className="max-w-md text-wrap">
          <p className="leading-tight font-medium text-gray-800 text-xs">{row.original.name}</p>
        </div>,
      },
      {
        header: "Unidades Vendidas",
        accessorKey: "quantity",
        cell: ({ row }) => <span className="font-medium">{row.original.quantity}</span>,
      },
      {
        header: "Ingresos Generados",
        accessorKey: "revenue",
        cell: ({ row }) => (
          <span className="font-medium text-emerald-600">
            {formatCurrency(row.original.revenue)}
          </span>
        ),
      },
    ],
    [],
  );

  const inventoryColumns = useMemo(
    () => [
      {
        header: "Producto",
        accessorKey: "name",
        cell: ({ row }) => <div className="max-w-md text-wrap">
          <p className="leading-tight font-medium text-gray-800 text-xs">{row.original.name}</p>
        </div>,
      },
      {
        header: "Stock Actual",
        accessorKey: "stockQuantity",
        cell: ({ row }) => {
          const stock = row.original.stockQuantity;
          const colorClass = stock === 0 ? "text-red-600 bg-red-50" : "text-amber-600 bg-amber-50";
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
              {stock === 0 ? "Agotado" : `${stock} unidades`}
            </span>
          );
        },
      },
      {
        header: "Precio",
        accessorKey: "price",
        cell: ({ row }) => <span className="text-gray-600">{formatCurrency(row.original.price)}</span>,
      },
    ],
    [],
  );

  const adjustmentColumns = useMemo(
    () => [
      {
        header: "Producto",
        accessorKey: "productName",
        cell: ({ row }) => <div className="max-w-md text-wrap">
          <p className="leading-tight font-medium text-gray-800 text-xs">{row.original.productName}</p>
        </div>,
      },
      {
        header: "Tipo",
        accessorKey: "movementType",
        cell: ({ row }) => {
          const type = row.original.movementType;
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${type === 'OUT' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
              {type === 'OUT' ? 'Merma (OUT)' : 'Ajuste (IN)'}
            </span>
          );
        },
      },
      {
        header: "Cantidad",
        accessorKey: "quantity",
        cell: ({ row }) => <span className="font-medium text-gray-800">{row.original.quantity}</span>,
      },
      {
        header: "Impacto",
        accessorKey: "financialImpact",
        cell: ({ row }) => {
          const type = row.original.movementType;
          const prefix = type === 'OUT' ? '-' : '+';
          const color = type === 'OUT' ? 'text-red-600' : 'text-emerald-600';
          return <span className={`font-medium ${color}`}>{prefix}{formatCurrency(row.original.financialImpact)}</span>;
        }
      },
      {
        header: "Motivo",
        accessorKey: "reason",
        cell: ({ row }) => <div className="max-w-md text-wrap">
          <p className="text-sm leading-tight">{row.original.reason || "Sin especificar"}</p>
        </div>,
      },
    ],
    [],
  );

  const orderColumns = useMemo(
    () => [
      {
        header: "Número de Pedido",
        accessorKey: "confirmationNumber",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.confirmationNumber}</span>
        ),
      },
      {
        header: "Cliente",
        cell: ({ row }) => {
          const name = row.original.customer?.name || "Desconocido";
          const email = row.original.customer?.email || "";
          return (
            <div>
              <p className="leading-tight font-medium text-gray-800">{name}</p>
              <span className="text-gray-500 text-xs">{email}</span>
            </div>
          );
        },
      },
      {
        header: "Estado",
        accessorKey: "status",
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
      },
      {
        header: "Total",
        accessorKey: "totalPrice",
        cell: ({ row }) => (
          <div className="text-emerald-600 font-medium text-right text-nowrap">
            {formatCurrency(row.original.totalPrice)}
          </div>
        ),
      },
      {
        header: "Pago",
        accessorKey: "isPaid",
        cell: ({ row }) => {
          const isPaid = row.original.isPaid;
          const status = isPaid ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PENDING;
          const statusStyles = isPaid ? "text-emerald-600" : "text-yellow-600";
          return <span className={`font-medium ${statusStyles}`}>{status}</span>;
        },
      },
      {
        header: "Fecha",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <div>
            <p className="leading-tight text-sm font-medium">
              {formatShortDateToString(new Date(row.original.createdAt))}
            </p>
            <span className="text-gray-500 text-xs">
              {new Date(row.original.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ),
      },
      {
        header: "Acciones",
        accessorKey: "actions",
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex justify-center">
              <Link
                to={`/admin/orders/${row.original._id}`}
                title="Ver detalles del pedido"
                className="rounded-md p-1 h-8 w-8 flex items-center justify-center transition-colors bg-[#3f6b4c]/10 hover:bg-[#3f6b4c]/20 text-[#3f6b4c]"
              >
                <EllipsisIcon className="h-4 w-4 text-[#3f6b4c]" />
              </Link>
            </div>
          );
        },
      },
    ],
    [],
  );

  const cityColumns = useMemo(
    () => [
      {
        header: "Ciudad",
        accessorKey: "_id",
        cell: ({ row }) => <span className="leading-tight font-medium text-gray-800">{row.original._id || "Desconocida"}</span>,
      },
      {
        header: "Órdenes",
        accessorKey: "ordersCount",
        cell: ({ row }) => <span className="font-medium">{row.original.ordersCount}</span>,
      },
      {
        header: "Ingresos",
        accessorKey: "revenue",
        cell: ({ row }) => (
          <span className="font-medium text-emerald-600">
            {formatCurrency(row.original.revenue)}
          </span>
        ),
      },
    ],
    [],
  );

  const inventoryMovementColumns = useMemo(
    () => [
      {
        header: "Fecha",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <div>
            <p className="leading-tight font-medium text-gray-800">
              {formatShortDateToString(new Date(row.original.createdAt))}
            </p>
            <span className="text-gray-500 text-xs">
              {new Date(row.original.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ),
      },
      {
        header: "Producto / Categoría",
        cell: ({ row }) => (
          <div className="max-w-sm text-wrap">
            <p className="leading-tight font-medium text-gray-800 text-xs">{row.original.product?.name || "Desconocido"}</p>
            <p className="text-xs text-gray-500">{row.original.product?.category || "-"}</p>
          </div>
        ),
      },
      {
        header: "Movimiento",
        accessorKey: "movementType",
        cell: ({ row }) => {
          const type = row.original.movementType;
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${type === 'OUT' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
              {type}
            </span>
          );
        },
      },
      {
        header: "Cant.",
        accessorKey: "quantity",
        cell: ({ row }) => {
          const type = row.original.movementType;
          const prefix = type === 'OUT' ? '-' : '+';
          const color = type === 'OUT' ? 'text-red-600' : 'text-green-600';
          return <span className={`font-semibold ${color}`}>{prefix}{row.original.quantity}</span>;
        },
      },
      {
        header: "Antes / Después",
        cell: ({ row }) => (
          <div className="flex gap-2 text-sm text-nowrap">
            <span className="text-gray-500">{row.original.beforeQuantity}</span>
            <span className="text-gray-300">→</span>
            <span className="font-semibold">{row.original.afterQuantity}</span>
          </div>
        ),
      },
      {
        header: "Orden",
        accessorKey: "order",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-blue-600">
            {row.original.order ? (
              <Link to={`/admin/orders/${row.original.order}`} className="hover:underline">
                #{row.original.order.slice(-6)}
              </Link>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </span>
        ),
      },
      {
        header: "Motivo",
        accessorKey: "reason",
        cell: ({ row }) => <div className="max-w-sm text-wrap"><p className="text-sm leading-tight">{row.original.reason || "-"}</p></div>,
      },
    ],
    []
  );

  return {
    customerColumns,
    cityColumns,
    productColumns,
    inventoryColumns,
    adjustmentColumns,
    orderColumns,
    inventoryMovementColumns,
  };
};
