import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { mocckCheckoutClientData } from "../../../lib/data";
import { calculateCartTotals, CART, formatCurrency } from "../../../lib/helper";
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

  const handlePaymentSuccess = (details) => {
    console.log("Payment Successful:", details);
    navigate("/order-confirmation");
  };

  const onSubmit = (data) => {
    console.log(data);
    handlePaymentSuccess();
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
              />
            </div>
            <div>
              <RHFInput
                label="Apellido(s)"
                id="lastName"
                required={true}
                register={register}
                error={errors.lastName}
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
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1 xl:col-span-2">
              <RHFInput
                label="Dirección de Envío"
                id="address"
                required={true}
                register={register}
                error={errors.address}
              />
            </div>
            <div>
              <RHFInput
                label="Ciudad"
                id="city"
                required={true}
                register={register}
                error={errors.city}
              />
            </div>
            <div>
              <RHFInput
                label="Región/Estado"
                id="state"
                required={true}
                register={register}
                error={errors.state}
              />
            </div>
            <div>
              <RHFInput
                label="Código Postal"
                id="postalCode"
                required={true}
                register={register}
                error={errors.postalCode}
              />
            </div>
            <div>
              <RHFInput
                label="País"
                id="country"
                required={true}
                register={register}
                error={errors.country}
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
              <div className="flex gap-2 items-center text-sm mb-3">
                {CART.PAYMENT_METHODS.map((method) => (
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodSelect(method.name)}
                    className={`w-1/${CART.PAYMENT_METHODS.length} p-2 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer ${
                      selectedPaymentMethod === method.name
                        ? "ring-2 bg-amber-100 ring-amber-500"
                        : "bg-white"
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
              <PayPalButton
                amount={total.toFixed(2)}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
