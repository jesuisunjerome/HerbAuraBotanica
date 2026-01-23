import {
  BoxIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  MailCheckIcon,
  MapPinIcon,
  MessageCircleIcon,
  TruckIcon,
} from "lucide-react";
import { Link } from "react-router";
import GradientBg from "../../components/common/GradientBg";
import SEORender from "../../layouts/SEORender";
import { calculateCartTotals, formatCurrency } from "../../lib/helper";
import { useCartStore } from "../../store/useCartStore";

export default function OrderConfirmationPage() {
  const { cart } = useCartStore();
  const { subtotal, tax, shipping, total } = calculateCartTotals(cart);

  return (
    <>
      <SEORender
        title="Confirmación de Pedido :: HerbAura Botanica"
        description="Gracias por tu compra en HerbAura Botanica. Tu pedido ha sido recibido y está siendo procesado. Revisa los detalles de tu pedido y la información de envío aquí."
      />
      <section className="md:px-5 px-3 lg:px-20 pt-10 pb-20 relative bg-whsite">
        <GradientBg />
        <div className="max-w-lg mb-6 mx-auto lg:p-8 rounded text-center">
          <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl lg:text-3xl">¡Gracias por tu compra!</h1>
          <p className="text-gray-500 mb-4">
            Hemos recibido tu pedido y está siendo procesado.
          </p>
          <div className="lg:inline-block mb-4 lg:min-w-sm px-3 py-2 rounded-lg bg-[#dbf3e1] border border-[#3f6b4c]">
            <span className="text-sm text-[#3f6b4c]">Número de Pedido</span>
            <h2 className="text-xl font-medium">ORD-123456-HERB</h2>
          </div>
          <p className="text-gray-600 leading-tight">
            <MailCheckIcon className="w-5 h-5 inline-block mr-2" />
            Se ha enviado un correo de confirmación a{" "}
            <span className="font-medium">ejemplo@correo.com</span>.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-5 rounded">
          <details
            open
            className="group rounded-lg border border-gray-200 overflow-hidden"
          >
            <summary className="px-6 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200 list-none font-medium text-lg flex justify-between items-center">
              <div>Detalles del Pedido</div>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-700 group-open:rotate-180" />
            </summary>
            <div className="px-6 py-4 space-y-3">
              {cart.map((item) => (
                <div
                  className="flex items-center justify-between py-2 border-b gap-2 border-gray-100"
                  key={item._id}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 overflow-hidden rounded-xl p-2 shrink-0">
                      <img
                        loading="lazy"
                        src={item.images[0]}
                        className="w-12 h-12 object-contain bg-gray-100 rounded-xl"
                        alt={item.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium leading-tight text-sm">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-sm leading-tight">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span>{formatCurrency(item.quantity * item.price)}</span>
                  </div>
                </div>
              ))}

              <div className="mt-7 space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (19%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </details>

          <details className="group rounded-lg border border-gray-200 overflow-hidden">
            <summary className="px-6 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200 list-none font-medium text-lg flex justify-between items-center">
              <div>Información de Envío</div>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-700 group-open:rotate-180" />
            </summary>
            <div className="px-6 py-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <div className="size-7 flex items-center justify-center rounded-lg bg-gray-200">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-medium leading-tight mb-1">
                    Shipping to
                  </span>
                  <span className="text-gray-500 leading-tight">
                    Juan Pérez
                  </span>
                  <a
                    href="tel:+5212345678901"
                    className="text-gray-500 leading-tight"
                  >
                    +52 1 234 567 8901
                  </a>
                  <span className="text-gray-500 leading-tight">
                    Calle Falsa 123
                  </span>
                  <span className="text-gray-500 leading-tight">
                    Ciudad de México, CDMX, 01234
                  </span>
                  <span className="text-gray-500 leading-tight">México</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <div className="size-7 flex items-center justify-center rounded-lg bg-gray-200">
                    <TruckIcon className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-medium leading-tight mb-1">
                    Shipping method
                  </span>
                  <span className="text-gray-500 leading-tight">
                    Envío Estándar - {formatCurrency(19.0)}
                  </span>
                  {/* <span className="text-gray-500 leading-tight">
                    Envío gratis en pedidos superiores a {formatCurrency(999)}.
                  </span> */}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <div className="size-7 flex items-center justify-center rounded-lg bg-gray-200">
                    <CreditCardIcon className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-medium leading-tight mb-1">
                    Método de pago
                  </span>
                  <span className="text-gray-500 leading-tight">
                    Tarjeta de crédito/débito (Stripe)
                  </span>
                </div>
              </div>
              <div className="border border-indigo-100 text-sm rounded-lg p-3 bg-indigo-50">
                <span className="font-medium block text-indigo-700">
                  Estimado de entrega
                </span>
                <span className="text-indigo-700 block">
                  {new Date(2026, 0, 26).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(2026, 0, 31).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  (5-7 días hábiles)
                </span>
                <span className="text-indigo-700 leading-tight text-xs">
                  Ten en cuenta que los tiempos de entrega pueden variar según
                  la ubicación y otros factores.
                </span>
              </div>
            </div>
          </details>

          <details className="group rounded-lg border border-gray-200 overflow-hidden">
            <summary className="px-6 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200 list-none font-medium text-lg flex justify-between items-center">
              <div>¿Qué sigue?</div>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-700 group-open:rotate-180" />
            </summary>
            <div className="px-6 py-4">
              <ul className="list-none space-y-2">
                <li className="flex items-start gap-3 relative">
                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <div className="size-7 flex items-center justify-center rounded-full bg-emerald-600">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="h-7 w-px bg-gray-300" />
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium leading-tight">
                      Confirmado
                    </span>
                    <span className="text-gray-500 leading-tight">
                      {new Date().toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3 relative">
                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <div className="size-7 flex items-center justify-center rounded-full bg-gray-200">
                      <TruckIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="h-7 w-px bg-gray-300" />
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium leading-tight">Enviado</span>
                    <span className="text-gray-500 leading-tight">
                      Te notificaremos cuando tu pedido haya sido enviado.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3 relative">
                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <div className="size-7 flex items-center justify-center rounded-full bg-gray-200">
                      <MapPinIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium leading-tight">Entregado</span>
                    <span className="text-gray-500 leading-tight">
                      Tu pedido será entregado en la dirección proporcionada.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </details>

          <details className="group rounded-lg border border-gray-200 overflow-hidden">
            <summary className="px-6 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200 list-none font-medium text-lg flex justify-between items-center">
              <div>¿Necesitas ayuda con tu pedido?</div>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-700 group-open:rotate-180" />
            </summary>
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="flex gap-2 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 w-full relative">
                <span className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-gray-100">
                  <BoxIcon className="w-5 h-5 text-gray-600" />
                </span>
                <div className="flex flex-col text-start text-sm">
                  <span className="font-medium">Rastrea tu pedido</span>
                  <span className="text-gray-500 text-xs">
                    Obtén actualizaciones en tiempo real sobre el estado de tu
                    pedido.
                  </span>
                </div>
                <ExternalLinkIcon className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
              </button>
              <button className="flex gap-2 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 w-full relative">
                <span className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-gray-100">
                  <MessageCircleIcon className="w-5 h-5 text-gray-600" />
                </span>
                <div className="flex flex-col text-start text-sm">
                  <span className="font-medium">Contacta al soporte</span>
                  <span className="text-gray-500 text-xs">
                    ¿Necesitas ayuda? Comunícate con nuestro equipo de soporte.
                  </span>
                </div>
                <ExternalLinkIcon className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
              </button>
              <div className="md:col-span-2 border text-sm border-gray-200 rounded-lg p-3 bg-gray-50 w-full">
                <span className="font-medium block">
                  Devoluciones y Reembolsos
                </span>
                <span className="text-gray-500 text-xs">
                  Tienes 30 días desde la fecha de entrega para devolver o
                  cambiar tus artículos.{" "}
                  <Link
                    className="underline text-amber-500"
                    to="/return-policy"
                  >
                    Lee nuestra política de devoluciones
                  </Link>{" "}
                  para más detalles.
                </span>
              </div>
            </div>
          </details>

          <div className="rounded-lg border border-gray-100 text-center p-4 text-sm">
            <span className="font-medium block">
              We appreciate your business and hope you enjoy your purchase!
            </span>
            <span className="text-gray-500 text-xs block">
              Cada compra que realizas nos ayuda a crecer y mejorar. ¡Gracias
              por elegirnos!
            </span>
            <button className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
