import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { mocckCheckoutClientData } from "../../../lib/data";
import {
  calculateCartTotals,
  CART,
  COUNTRY_LIST,
  formatCurrency,
  IVA_RATE,
} from "../../../lib/helper";
import { checkoutSchema } from "../../../lib/schemas";
import { useCartStore } from "../../../store/useCartStore";
import RHFInput from "../../common/form/RHFInput";
import RHFSelect from "../../common/form/RHFSelect";
import PaymentButton from "./PaymentButton";

export default function CheckoutForm() {
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const { subtotal, tax, shipping, total } = calculateCartTotals(cart);

  const {
    register,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: mocckCheckoutClientData,
    resolver: zodResolver(checkoutSchema),
    mode: "all",
  });

  const paymentMethod = watch("paymentMethod");
  const disabled = Object.keys(errors).length > 0 || !paymentMethod;

  const onSubmit = async () => {
    return;
  };

  // Data shape expected
  const formData = {
    customer: {
      name: `${getValues("firstName")} ${getValues("lastName")}`,
      email: getValues("email"),
      phone: getValues("phone"),
    },
    shippingAddress: {
      address: getValues("address"),
      city: getValues("city"),
      state: getValues("state"),
      postalCode: getValues("postalCode"),
      country: getValues("country"),
    },
    paymentMethod: getValues("paymentMethod"),
  };

  return (
    <>
      <div className="mb-5">
        <button
          type="button"
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
        className="flex flex-col md:flex-row gap-10 xl:gap-20 relative"
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
              {/* <RHFInput
                label="País"
                id="country"
                required={true}
                register={register}
                error={errors.country}
              /> */}
              <RHFSelect
                label="País"
                id="country"
                options={COUNTRY_LIST.map((country) => ({
                  value: country.value,
                  label: country.label,
                  // disabled: !country.supportsStripe,
                }))}
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
              <span>IVA ({IVA_RATE * 100}%)</span>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center text-sm mb-7">
                {CART.PAYMENT_METHODS.map((method) => (
                  <button
                    type="button"
                    onClick={() => setValue("paymentMethod", method.name)}
                    className={`p-2 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer"} ${
                      paymentMethod === method.name
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
                  </button>
                ))}
              </div>

              <PaymentButton
                paymentMethod={paymentMethod}
                formData={formData}
                disabled={disabled}
                onSuccess={(orderId) =>
                  navigate(`/order-confirmation/${orderId}`)
                }
              />

              <p className="text-center text-slate-400 text-[10px] uppercase tracking-widest mt-5">
                Al hacer clic, aceptas nuestros{" "}
                <Link to="/terms" className="underline">
                  Términos y Condiciones y Política de Privacidad.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* {(isCreatingSession || isUpdatingPaymentStatus || isFinalizing) && (
        <div className="fixed top-0 left-0 w-full z-50 h-full bg-black/60 flex justify-center items-center">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-gray-800 text-center p-8 rounded-lg flex flex-col items-center">
              <LoaderIcon className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-white mt-4 text-center">
                {isCreatingSession && "Creando sesión de pago..."}
                {isUpdatingPaymentStatus && "Actualizando estado de pago..."}
                {isFinalizing && "Finalizando pedido..."}
              </p>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
