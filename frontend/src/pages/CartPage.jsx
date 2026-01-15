import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import NoData from "../components/NoData";
import SEORender from "../layouts/SEORender";
import { cartInfoSchema, formatCurrency } from "../lib/helper";
import { useCartStore } from "../store/useCartStore";

export default function CartPage() {
  const [cartStep, setCartStep] = useState(CART_STEPS.CART_INFO);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const { cart, addToCart, removeFromCart, clearCart, decreaseQuantity } =
    useCartStore();
  const IVA = 0.19; // 19% IVA
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * IVA;
  const shipping = cart.length > 0 ? 19.0 : 0;
  const total = subtotal + tax + shipping;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(cartInfoSchema),
    mode: "all",
  });

  const handlePaymentMethodSelect = (name) => {
    setSelectedPaymentMethod(name);
    setValue("paymentMethod", name);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <SEORender
        title="Carrito de Compras :: HerbAura Botanica"
        description="Revisa y gestiona los productos en tu carrito de compras en HerbAura Botanica. Tu camino hacia un cabello natural y saludable comienza aquí."
      />

      <section className="md:px-5 px-3 lg:px-20 pt-10 pb-20 relative">
        {cartStep === CART_STEPS.CART_INFO ? (
          <>
            <div className="mb-5">
              <Link
                to="/products"
                className="text-amber-600 hover:underline flex items-center gap-1 group"
              >
                <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
                <span>Volver a Productos</span>
              </Link>
            </div>

            {cart.length > 0 && (
              <h1 className="text-3xl mb-5">Tu Carrito de Compras</h1>
            )}
            <div className="flex flex-col md:flex-row gap-10 xl:gap-20">
              <div className="w-full md:w-8/12 xl:w-9/12 p-5 rounded-2xl">
                {cart.length === 0 && (
                  <NoData
                    img="/images/empty-cart.png"
                    message="Tu carrito está vacío."
                  />
                )}

                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="py-4 border-t border-gray-100 grid grid-cols-3 lg:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                  >
                    <div className="col-span-3 lg:col-auto flex items-center gap-6">
                      <div className="bg-gray-100 overflow-hidden rounded-xl p-2">
                        <img
                          loading="lazy"
                          src={item.img}
                          className="w-20 h-20 object-contain bg-gray-100 rounded-xl"
                          alt={item.name}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-amber-600">
                          {formatCurrency(item.price)}
                        </p>
                        <p
                          className="text-xs max-w-xs line-clamp-2 text-gray-600 leading-5"
                          title={item.description}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 lg:col-auto">
                      <div className="flex items-center border border-gray-300 rounded-lg w-max p-0.5 gap-3">
                        <button
                          onClick={() => decreaseQuantity(item.productId)}
                          className="bg-gray-200 rounded-md p-1 h-7 w-7 flex items-center justify-center"
                        >
                          <MinusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="text-lg px-3">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gray-200 rounded-md p-1 h-7 w-7 flex items-center justify-center"
                        >
                          <PlusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 rounded-md p-1 h-8 w-8 flex items-center justify-center transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex flex-wrap gap-4 items-center justify-between mt-10">
                  <p className="text-sm text-gray-600">
                    ¿Necesitas ayuda? Revisa nuestro{" "}
                    <Link to="/help" className="text-amber-600 hover:underline">
                      Centro de Ayuda
                    </Link>
                    .
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to="/products"
                      className="border border-gray-600 text-gray-600 px-5 py-2 rounded group hover:text-white hover:bg-gray-700 transition hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                    >
                      <ChevronLeftIcon className="h-5 w-5 group-hover:-translate-x-2 transition-all" />
                      <span>Volver</span>
                    </Link>
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="border bg-red-50 border-red-300 text-red-500 px-5 py-2 rounded group hover:text-gray-700 hover:bg-red-300 transition hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 justify-center"
                      >
                        <span>Vaciar Carrito</span>
                        <TrashIcon className="h-5 w-5 group-hover:translate-x-2 transition-all" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-4/12 xl:w-3/12 text-white">
                <div className="flex flex-col sticky top-20">
                  <div className="p-7 lg:p-10 flex flex-col gap-10 bg-gray-700 rounded-2xl">
                    <div>
                      <div className="border-b border-white/10 pb-3 mb-5">
                        <p className="text-xl">Resumen del Pedido</p>
                      </div>
                      <div className="flex justify-between mb-3 border-b border-white/10 pb-3 text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between mb-3 border-b border-white/10 pb-3 text-sm">
                        <span>IVA (19%)</span>
                        <span>{formatCurrency(tax)}</span>
                      </div>
                      <div className="flex justify-between mb-3 border-b border-white/10 pb-3 text-sm">
                        <span>Envío</span>
                        <span>{formatCurrency(shipping)}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between my-8 border-t border-white/10 pt-3">
                        <span className="font-medium">Total</span>
                        <span className="font-semibold">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 rounded-2xl bg-gray-100 flex flex-col gap-6">
                    <div className="flex gap-2 items-center text-sm">
                      {PAYMENT_METHODS.map((method) => (
                        <div
                          className={`w-1/${PAYMENT_METHODS.length} p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center`}
                          key={method.id}
                        >
                          <img
                            src={method.img}
                            alt={method.name}
                            className="h-8 mx-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>

                    {cart.length > 0 && (
                      <button
                        onClick={() => setCartStep(CART_STEPS.PAYMENT)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors"
                      >
                        Proceder al Pago
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-5">
              <button
                onClick={() => setCartStep(CART_STEPS.CART_INFO)}
                className="text-amber-600 hover:underline flex items-center gap-1 group"
              >
                <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
                <span>Regresar</span>
              </button>
            </div>

            <h1 className="text-3xl mb-5">Información de Envío</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:flex-row gap-10 xl:gap-20"
            >
              <div className="w-full xl:w-7/12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block mb-2 font-medium"
                    >
                      Nombre <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block mb-2 font-medium"
                    >
                      Apellido(s) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">
                      Correo Electrónico <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium">
                      Número de Teléfono <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2 md:col-span-1 xl:col-span-2">
                    <label htmlFor="address" className="block mb-2 font-medium">
                      Dirección de Envío <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="city" className="block mb-2 font-medium">
                      Ciudad <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="block mb-2 font-medium">
                      Estado <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("state")}
                    />
                    {errors.state && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block mb-2 font-medium"
                    >
                      Código Postal <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("postalCode")}
                    />
                    {errors.postalCode && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="country" className="block mb-2 font-medium">
                      País <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="country"
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      {...register("country")}
                    />
                    {errors.country && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full xl:w-5/12">
                <div className="flex flex-col sticky top-20">
                  <div className="border-b border-gray-300 pb-3 mb-5">
                    <p className="text-xl">Resumen del Pedido</p>
                  </div>
                  <div className="flex justify-between mb-3 border-b border-gray-300 pb-3 text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between mb-3 border-b border-gray-300 pb-3 text-sm">
                    <span>IVA (19%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between mb-3 border-b border-gray-300 pb-3 text-sm">
                    <span>Envío</span>
                    <span>{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between mb-10 border-b border-gray-300 pb-3">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div>
                    <p className="mb-2">Selecciona un método de pago:</p>
                    <div className="flex gap-2 items-center text-sm mb-3">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          type="button"
                          onClick={() => handlePaymentMethodSelect(method.name)}
                          className={`w-1/${PAYMENT_METHODS.length} p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer ${
                            selectedPaymentMethod === method.name
                              ? "ring-2 ring-amber-500"
                              : ""
                          }`}
                          key={method.id}
                        >
                          <img
                            src={method.img}
                            alt={method.name}
                            className="h-8 mx-auto object-contain"
                          />
                          <input
                            {...register("paymentMethod")}
                            type="hidden"
                            value={method.name}
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={!isValid}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors disabled:hover:bg-amber-500"
                    >
                      Continuar al Pago
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </section>
    </>
  );
}

const PAYMENT_METHODS = [
  {
    id: 2,
    name: "PayPal",
    description: "Paga de forma segura a través de tu cuenta PayPal.",
    img: "/images/payments/paypal-icon.png",
  },
  {
    id: 3,
    name: "MercadoPago",
    description:
      "Utiliza MercadoPago para una experiencia de pago rápida y segura.",
    img: "/images/payments/mercadopago-icon.png",
  },
  {
    id: 4,
    name: "Stripe",
    description: "Paga con tarjeta de crédito o débito a través de Stripe.",
    img: "/images/payments/stripe-icon.png",
  },
];

const CART_STEPS = {
  CART_INFO: "CART_INFO",
  PAYMENT: "PAYMENT",
};
