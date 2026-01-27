import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import {
  useCreateCheckoutSession,
  useFinalizeCheckoutSession,
  useUpdateCheckoutPaymentStatus,
} from "../../../hooks/checkout/mutations";
import { mocckCheckoutClientData } from "../../../lib/data";
import {
  calculateCartTotals,
  CART,
  formatCurrency,
  PAYMENT_STATUS,
} from "../../../lib/helper";
import { checkoutSchema } from "../../../lib/schemas";
import { useCartStore } from "../../../store/useCartStore";
import RHFInput from "../../common/form/RHFInput";
import PayPalButton from "./PayPalButton";

export default function CheckoutForm() {
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    mocckCheckoutClientData.paymentMethod,
  );

  const { isCreatingSession, checkoutId, createCheckoutSession } =
    useCreateCheckoutSession();
  const { isUpdatingPaymentStatus, updatePaymentStatus } =
    useUpdateCheckoutPaymentStatus();
  const { isFinalizing, finalizeOrder } = useFinalizeCheckoutSession();
  const { subtotal, tax, shipping, total } = calculateCartTotals(cart);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: mocckCheckoutClientData,
    resolver: zodResolver(checkoutSchema),
    mode: "all",
  });

  const handlePaymentMethodSelect = (name) => {
    setSelectedPaymentMethod(name);
    setValue("paymentMethod", name);
  };

  const handlePaymentSuccess = async (details) => {
    console.log("Payment Successful:", details);
    const checkoutData = {
      checkoutId,
      paymentStatus: PAYMENT_STATUS.PAID,
      paymentDetails: details,
    };

    updatePaymentStatus(checkoutData, {
      onSuccess: () => {
        finalizeOrder(checkoutId, {
          onSuccess: (data) => {
            navigate(`/order-confirmation/${data._id}`, { replace: true });
          },
        });
      },
    });
  };

  const onSubmit = (data) => {
    const shippingDetails = {
      user: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        state: data.state,
        country: data.country,
      },
    };

    const checkoutItems = cart.map((item) => ({
      productId: item._id,
      name: item.name,
      image: item.images[0].url,
      price: item.price,
      quantity: item.quantity,
    }));

    const checkoutData = {
      shippingDetails,
      paymentMethod: data.paymentMethod,
      checkoutItems,
      totalAmount: total,
    };

    createCheckoutSession(checkoutData);
  };

  const handlePaymentError = (error) => {
    console.error("Payment Error:", error);
    toast.error(
      "There was an error processing your payment. Please try again.",
    );
  };

  return (
    <>
      <div className="mb-5">
        <button
          onClick={() => navigate("/products")}
          className="text-amber-600 hover:underline inline-flex items-center gap-1 group"
        >
          <ChevronLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-all" />
          <span>Volver a Productos</span>
        </button>
      </div>

      <h1 className="text-2xl lg:text-3xl mb-3 lg:mb-5">
        Información de Envío
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-10 xl:gap-20"
      >
        <div className="w-full xl:w-7/12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <RHFInput
                label="Nombre"
                id="firstName"
                required={true}
                register={register}
                error={errors.firstName}
                disabled={isCreatingSession || checkoutId}
              />
            </div>
            <div>
              <RHFInput
                label="Apellido(s)"
                id="lastName"
                required={true}
                register={register}
                error={errors.lastName}
                disabled={isCreatingSession || checkoutId}
              />
            </div>
            <div>
              <RHFInput
                label="Correo Electrónico"
                id="email"
                required={true}
                register={register}
                error={errors.email}
                type="email"
                disabled={isCreatingSession || checkoutId}
              />
            </div>
            <div>
              <RHFInput
                label="Número de Teléfono"
                id="phone"
                required={true}
                register={register}
                error={errors.phone}
                type="tel"
                disabled={isCreatingSession || checkoutId}
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1 xl:col-span-2">
              <RHFInput
                label="Dirección de Envío"
                id="address"
                required={true}
                register={register}
                error={errors.address}
                disabled={isCreatingSession || checkoutId}
              />
            </div>
            <div>
              <RHFInput
                label="Ciudad"
                id="city"
                required={true}
                register={register}
                error={errors.city}
                disabled={isCreatingSession || checkoutId}
              />
            </div>
            <div>
              <RHFInput
                label="Región/Estado"
                id="state"
                required={true}
                register={register}
                error={errors.state}
                disabled={isCreatingSession || checkoutId}
              />
            </div>
            <div>
              <RHFInput
                label="Código Postal"
                id="postalCode"
                required={true}
                register={register}
                error={errors.postalCode}
                disabled={isCreatingSession || checkoutId}
              />
            </div>
            <div>
              <RHFInput
                label="País"
                id="country"
                required={true}
                register={register}
                error={errors.country}
                disabled={isCreatingSession || checkoutId}
              />
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
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>

            <div>
              <p className="mb-2">Selecciona un método de pago:</p>
              <div className="flex gap-2 items-center text-sm mb-7">
                {CART.PAYMENT_METHODS.map((method) => (
                  <button
                    type="button"
                    disabled={isCreatingSession || checkoutId}
                    onClick={() => handlePaymentMethodSelect(method.name)}
                    className={`w-1/${CART.PAYMENT_METHODS.length} p-2 rounded-lg border border-gray-200 flex items-center justify-center ${isCreatingSession || checkoutId ? "cursor-not-allowed" : "cursor-pointer"} ${
                      selectedPaymentMethod === method.name
                        ? "ring-2 bg-amber-100 ring-amber-500"
                        : "bg-white"
                    }`}
                    key={method.id}
                  >
                    <img
                      loading="lazy"
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

              {!checkoutId && (
                <button
                  type="submit"
                  disabled={
                    !isValid || !selectedPaymentMethod || isCreatingSession
                  }
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg transition-colors disabled:hover:bg-amber-500 mb-4"
                >
                  {isCreatingSession
                    ? "Creando sesión de pago..."
                    : "Proceder al Pago"}
                </button>
              )}

              {/* {checkoutId && ( */}
              <RenderPaymentMethods
                method={selectedPaymentMethod}
                total={total}
                handlePaymentSuccess={handlePaymentSuccess}
                handlePaymentError={handlePaymentError}
              />
              {/* )} */}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

const RenderPaymentMethods = ({
  method,
  total,
  handlePaymentSuccess,
  handlePaymentError,
}) => {
  switch (method) {
    case "PayPal":
      return (
        <PayPalButton
          amount={total.toFixed(2)}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      );
    case "MercadoPago":
      return (
        <button
          type="button"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg transition-colors disabled:hover:bg-indigo-500"
        >
          MercadoPago Button
        </button>
      );
    case "Stripe":
      return (
        <button
          type="button"
          className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-lg transition-colors disabled:hover:bg-violet-500"
        >
          Stripe Button
        </button>
      );
    default:
      return null;
  }
};
