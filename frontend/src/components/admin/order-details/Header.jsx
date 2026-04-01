import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  FileTextIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import ModalEditStatus from "./modals/ModalEditStatus";

export default function Header({ order, isPending }) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const toggleActions = () => setShowActions((prev) => !prev);

  const [modal, setModal] = useState(null);
  const handleOpenModal = ({ type }) => {
    toggleActions();
    setModal({ type, data: order });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-end gap-4 bg-gray-50 pb-3 pt-4 sticky top-15 z-10">
        <div>
          <div className="mb-3">
            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
              className="text-amber-600 hover:underline inline-flex items-center gap-1 group"
            >
              <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
              <span>Volver a Pedidos</span>
            </button>
          </div>
          <h1 className="text-2xl font-semibold">Detalles del Pedido</h1>
          <div className="text-gray-600">
            Revisa la información detallada del pedido realizado.
          </div>
        </div>
        {!isPending && (
          <div className="flex gap-2 w-full md:w-auto">
            <button
              title="Descargar Archivo"
              className="bg-[#3f6b4c] text-white px-4 py-2 rounded-md hover:bg-[#2e4d36] focus:outline-none focus:ring-2 focus:ring-[#3f6b4c] focus:ring-offset-2 transition"
            >
              <FileTextIcon className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                title="Acciones"
                className="bg-gray-200 px-3 py-2 text-gray-500 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                onClick={toggleActions}
              >
                <EllipsisVerticalIcon className="w-5 h-5" />
              </button>

              <ul
                className={`absolute md:right-0 mt-2 w-50 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] p-1 z-20 animate-in fade-in zoom-in-95 duration-200 max-h-100 overflow-y-auto ${showActions ? "block" : "hidden"}`}
              >
                {order_actions.map(({ name }) => {
                  return (
                    <li key={name}>
                      <button
                        onClick={() => handleOpenModal({ type: name })}
                        title={name}
                        className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left hover:translate-0"
                      >
                        {name}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    title="Cancelar Pedido"
                    onClick={() =>
                      handleOpenModal({
                        type: "cancelOrder",
                        data: { name: "Cancelar Pedido" },
                      })
                    }
                    className="block rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full text-left hover:translate-0"
                  >
                    Cancelar Pedido
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {modal?.type === modal_types.editStatus && (
        <ModalEditStatus data={order} onClose={() => setModal(null)} />
      )}
    </>
  );
}

const order_actions = [
  {
    name: "Cambiar Estatus",
    description:
      "Actualiza el estado del pedido (ej. de PROCESSING a SHIPPED).",
  },
  {
    name: "Información de Rastreo",
    description:
      "Introduce la paquetería y el número de guía. Al guardar, esto suele disparar automáticamente el cambio a SHIPPED.",
  },
  // {
  //   name: "Impresión de Documentos",
  //   description:
  //     "Imprime la Etiqueta de envío (si tienes integración con la paquetería) y la Lista de empaque (para que el equipo de almacén sepa qué meter en la caja).",
  // },
  {
    name: "Editar Dirección de Envío",
    description:
      'Cruce si el cliente llama diciendo "Me equivoqué de código postal". El sistema solo debería permitir esta acción si el estatus es PROCESSING o inferior; si ya está SHIPPED, el botón debe deshabilitarse.',
  },
  {
    name: "Emitir Reembolso",
    description:
      "Devuelve el dinero (ya sea total o parcial) directamente a la tarjeta del cliente a través de tu pasarela de pagos (Stripe, PayPal, etc.) sin salir del panel.",
  },
  {
    name: "Modificar Artículos",
    description:
      "Si el cliente compró una playera talla M y llama de inmediato para cambiarla a talla L. (De nuevo, esto solo debe estar disponible antes de que el pedido sea enviado).",
  },
  {
    name: "Ver Historial / Timeline",
    description:
      'Visualmente suele ser una línea de tiempo vertical en un lateral de la pantalla. Muestra exactamente la fecha, la hora, el cambio de estatus y quién lo hizo (ej. "Hoy a las 10:00 AM - El sistema actualizó a DELIVERED").',
  },
  {
    name: "Añadir Nota Interna",
    description:
      'Un cuadro de texto para que los administradores se dejen mensajes entre ellos. Ej: "El cliente llamó muy molesto por el retraso. Se le ofreció un cupón del 10% para su próxima compra". Estas notas no las ve el cliente.',
  },
  {
    name: "Reenviar Notificaciones",
    description:
      'Un botón para forzar el envío de correos o SMS. Muy útil cuando el cliente te dice: "No me llegó el correo con mi número de guía, ¿me lo mandas de nuevo?".',
  },
  // {
  //   name: "Cancelar Pedido",
  //   description:
  //     "Una acción crítica. Al presionarla, debe abrirse una ventana (modal) preguntando dos cosas clave: ¿Quieres regresar estos artículos al inventario (Restock)? ¿Quieres emitir un reembolso al cliente en este momento?",
  //   type: "cancelOrder",
  // },
];

const modal_types = {
  editStatus: "Cambiar Estatus",
  editTracking: "Información de Rastreo",
  printDocuments: "Impresión de Documentos",
  editShippingAddress: "Editar Dirección de Envío",
  refund: "Emitir Reembolso",
  editItems: "Modificar Artículos",
  viewTimeline: "Ver Historial / Timeline",
  addInternalNote: "Añadir Nota Interna",
  resendNotifications: "Reenviar Notificaciones",
  cancelOrder: "Cancelar Pedido",
};

// Pasar de la arquitectura de la base de datos a la pantalla es donde ocurre la verdadera operación del día a día. Al entrar a la vista de detalle de un pedido (por ejemplo, el pedido #1050), tú y tu equipo de atención al cliente necesitarán una "torre de control".

// Visualmente, las acciones de un pedido en el panel de administración se suelen agrupar en tres grandes bloques para mantener el orden y evitar errores operativos:

// ### 1. Acciones de Logística y Estatus (El núcleo del envío)
// Estas son las herramientas para mover el paquete físicamente y en el sistema:

// * **Forzar cambio de estatus (Dropdown):** Un menú desplegable que te permita cambiar manualmente el estado (ej. de `PROCESSING` a `SHIPPED`). Si construiste la "máquina de estados" que mencionamos, el sistema solo te dejará seleccionar los estatus que tengan sentido en ese momento.
// * **Añadir/Editar Información de Rastreo:** Campos para introducir la paquetería (FedEx, DHL) y teclear el número de guía (*tracking number*). Al guardar, esto suele disparar automáticamente el cambio a `SHIPPED`.
// * **Impresión de Documentos:** Botones de acceso rápido para imprimir la **Etiqueta de envío** (si tienes integración con la paquetería) y la **Lista de empaque** (*Packing slip*) para que el equipo de almacén sepa qué meter en la caja.
// * **Editar Dirección de Envío:** Crucial si el cliente llama diciendo *"Me equivoqué de código postal"*. El sistema solo debería permitir esta acción si el estatus es `PROCESSING` o inferior; si ya está `SHIPPED`, el botón debe deshabilitarse.

// ### 2. Acciones Financieras y Resolución de Problemas
// Estas son las acciones "delicadas" para cuando algo sale mal o el cliente cambia de opinión:

// * **Cancelar Pedido (Botón rojo):** Una acción crítica. Al presionarla, debe abrirse una ventana (modal) preguntando dos cosas clave:
//     * *¿Quieres regresar estos artículos al inventario (Restock)?*
//     * *¿Quieres emitir un reembolso al cliente en este momento?*
// * **Emitir Reembolso (Refund):** Un botón para devolver el dinero (ya sea total o parcial) directamente a la tarjeta del cliente a través de tu pasarela de pagos (Stripe, PayPal, etc.) sin salir del panel.
// * **Modificar Artículos (Editar Pedido):** Si el cliente compró una playera talla M y llama de inmediato para cambiarla a talla L. (De nuevo, esto solo debe estar disponible antes de que el pedido sea enviado).

// ### 3. Acciones de Comunicación y Auditoría
// Aquí es donde la tabla `order_status_history` que diseñamos cobra vida visualmente:

// * **Ver Historial / Timeline:** Visualmente suele ser una línea de tiempo vertical en un lateral de la pantalla. Muestra exactamente la fecha, la hora, el cambio de estatus y quién lo hizo (ej. *"Hoy a las 10:00 AM - El sistema actualizó a DELIVERED"*).
// * **Añadir Nota Interna:** Un cuadro de texto para que los administradores se dejen mensajes entre ellos. Ej: *"El cliente llamó muy molesto por el retraso. Se le ofreció un cupón del 10% para su próxima compra"*. Estas notas no las ve el cliente.
// * **Reenviar Notificaciones:** Un botón para forzar el envío de correos o SMS. Muy útil cuando el cliente te dice: *"No me llegó el correo con mi número de guía, ¿me lo mandas de nuevo?"*.

// ---

// **¿Te gustaría que diseñemos la lógica de permisos (Roles) para definir qué tipo de usuarios pueden ver o ejecutar estas acciones, o prefieres explorar el flujo paso a paso de una cancelación?**
