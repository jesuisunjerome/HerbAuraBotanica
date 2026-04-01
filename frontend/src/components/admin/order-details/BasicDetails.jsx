import {
  Calendar1Icon,
  CreditCardIcon,
  FileTextIcon,
  TruckElectricIcon,
} from "lucide-react";
import { formatLongDateToString } from "../../../lib/helper";

export default function BasicDetails({ order, isPending }) {
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-medium">Detalles básicos</p>
      </div>
      {isPending ? (
        <BasicDetailsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 py-3">
          <div className="flex items-start gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <FileTextIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">
                ID del Pedido
              </p>
              <p className="font-medium">{order?.confirmationNumber}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <Calendar1Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">
                Fecha del Pedido
              </p>
              <p className="font-medium -mb-2">
                {formatLongDateToString(new Date(order?.createdAt))}
              </p>
              <span className="text-gray-500 text-sm">
                {new Date(order?.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <TruckElectricIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">
                Estado del Pedido
              </p>
              <p className="font-medium">{order?.status}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <CreditCardIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">
                Método de Pago
              </p>
              <p className="font-medium">{order?.paymentMethod}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="p-2 bg-gray-100 flex items-center justify-center rounded">
              <Calendar1Icon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">
                Fecha estimada de entrega
              </p>
              <p className="font-medium">-</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BasicDetailsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 py-3 animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="p-2 bg-gray-50 flex items-center justify-center rounded">
            <div className="h-6 w-6 bg-gray-50 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-32 bg-gray-50 rounded mb-2"></div>
            <div className="h-5 w-20 bg-gray-50 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
