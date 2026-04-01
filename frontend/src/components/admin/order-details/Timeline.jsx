import {
  CheckIcon,
  LoaderIcon,
  MapPinIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react";
import { formatLongDateToString, ORDER_STATUS } from "../../../lib/helper";

export default function Timeline({ order, isPending }) {
  const { statusHistory } = order || {};
  const isCancelled = order?.status === ORDER_STATUS.CANCELLED;

  console.log(order);
  return (
    <div className="rounded-2xl shadow-lg shadow-gray-100 bg-white px-5 py-4">
      <div className="border-b border-gray-100 pb-3">
        <p className="text-xl font-medium">Línea de Tiempo</p>
      </div>
      <div className="py-4">
        {isPending ? (
          <p className="text-gray-500">Cargando historial de estados...</p>
        ) : statusHistory && statusHistory.length > 0 ? (
          <ul className="list-none space-y-2">
            {/* 1. CONFIRMADO (Paid or Created) */}
            <li className="flex items-start gap-3 relative">
              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <div
                  className={`size-7 flex items-center justify-center rounded-full ${order.isPaid ? "bg-emerald-600" : "bg-gray-300"}`}
                >
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
                {!isCancelled && <div className="h-7 w-px bg-gray-300" />}
                {isCancelled && <div className="h-7 w-px bg-red-200" />}
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-medium leading-tight">Confirmado</span>
                {order.isPaid ? (
                  <span className="text-gray-500 leading-tight">
                    Pago completado el{" "}
                    {formatLongDateToString(new Date(order.paidAt), true)}
                  </span>
                ) : (
                  <span className="text-gray-500 leading-tight">
                    El pedido no ha sido pagado.
                  </span>
                )}
              </div>
            </li>

            {statusHistory.map((statusEntry) => {
              const {
                _id: id,
                status,
                comment,
                updatedByModel,
                updatedBy,
                createdAt,
              } = statusEntry;
              const isCancelled = status === ORDER_STATUS.CANCELLED;
              const isProcessing = status === ORDER_STATUS.PROCESSING;
              const isShipped = status === ORDER_STATUS.SHIPPED;
              const isDelivered = status === ORDER_STATUS.DELIVERED;
              const shippingAddress = order.shippingAddress;

              // {/* FLUJO CANCELADO */}
              if (isCancelled)
                return (
                  <li key={id} className="flex items-start gap-3 relative">
                    <div className="shrink-0 flex flex-col items-center gap-1.5">
                      <div className="size-7 flex items-center justify-center rounded-full bg-red-600">
                        <XCircleIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-red-600 leading-tight">
                        Cancelado
                      </span>
                      <span className="text-gray-500 leading-tight">
                        Este pedido ha sido cancelado el{" "}
                        {formatLongDateToString(new Date(createdAt), true)}.
                      </span>
                      {comment && (
                        <div className="text-red-600 text-xs">{comment}</div>
                      )}
                    </div>
                  </li>
                );

              if (!isCancelled)
                return (
                  <>
                    {/* 2. PROCESANDO */}
                    {isProcessing && (
                      <li className="flex items-start gap-3 relative">
                        <div className="shrink-0 flex flex-col items-center gap-1.5">
                          <div
                            className={`size-7 flex items-center justify-center rounded-full ${createdAt ? "bg-indigo-500" : "bg-gray-200"}`}
                          >
                            {createdAt ? (
                              <CheckIcon className="w-4 h-4 text-white" />
                            ) : (
                              <LoaderIcon
                                className={`w-4 h-4 text-white ${createdAt ? "animate-spin" : ""}`}
                              />
                            )}
                          </div>
                          <div className="h-7 w-px bg-gray-300" />
                        </div>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium leading-tight">
                            {status} (
                            {updatedByModel === "System"
                              ? "Sistema"
                              : updatedBy}
                            )
                          </span>
                          {createdAt ? (
                            <span className="text-gray-500 leading-tight">
                              Preparando pedido desde el{" "}
                              {formatLongDateToString(
                                new Date(createdAt),
                                true,
                              )}
                              .
                            </span>
                          ) : (
                            <span className="text-gray-500 leading-tight">
                              Esperando confirmación...
                            </span>
                          )}
                          {comment && (
                            <div className="text-indigo-600 text-xs">
                              {comment}
                            </div>
                          )}
                        </div>
                      </li>
                    )}

                    {/* 3. ENVIADO */}
                    {isShipped && (
                      <li className="flex items-start gap-3 relative">
                        <div className="shrink-0 flex flex-col items-center gap-1.5">
                          <div
                            className={`size-7 flex items-center justify-center rounded-full ${createdAt ? "bg-amber-500" : "bg-gray-200"}`}
                          >
                            {createdAt ? (
                              <CheckIcon className="w-4 h-4 text-white" />
                            ) : (
                              <TruckIcon
                                className={`w-4 h-4 ${createdAt ? "text-white" : "text-gray-500"}`}
                              />
                            )}
                          </div>
                          <div className="h-7 w-px bg-gray-300" />
                        </div>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium leading-tight">
                            Enviado
                          </span>
                          {createdAt ? (
                            <span className="text-gray-500 leading-tight">
                              Enviado el{" "}
                              {formatLongDateToString(
                                new Date(createdAt),
                                true,
                              )}
                              .
                            </span>
                          ) : (
                            <span className="text-gray-500 leading-tight">
                              Te notificaremos cuando el pedido haya sido
                              enviado.
                            </span>
                          )}
                          {comment && (
                            <div className="text-indigo-600 text-xs">
                              {comment}
                            </div>
                          )}
                        </div>
                      </li>
                    )}

                    {/*  4. ENTREGADO */}
                    {isDelivered && (
                      <li className="flex items-start gap-3 relative">
                        <div className="shrink-0 flex flex-col items-center gap-1.5">
                          <div
                            className={`size-7 flex items-center justify-center rounded-full ${order.isDelivered || createdAt ? "bg-emerald-600" : "bg-gray-200"}`}
                          >
                            <MapPinIcon
                              className={`w-4 h-4 ${order.isDelivered || createdAt ? "text-white" : "text-gray-500"}`}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium leading-tight">
                            Entregado
                          </span>
                          {order.isDelivered || createdAt ? (
                            <span className="text-emerald-600 font-medium leading-tight">
                              Entregado el{" "}
                              {formatLongDateToString(
                                new Date(order.deliveredAt || createdAt),
                                true,
                              )}
                            </span>
                          ) : (
                            <span className="text-gray-500 leading-tight">
                              El pedido será entregado en{" "}
                              {shippingAddress.address} ${shippingAddress.city},
                              ${shippingAddress.postalCode} $
                              {shippingAddress.country}.
                            </span>
                          )}
                          {comment && (
                            <div className="text-indigo-600 text-xs">
                              {comment}
                            </div>
                          )}
                        </div>
                      </li>
                    )}
                  </>
                );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No hay historial de estados.</p>
        )}
      </div>
    </div>
  );
}
