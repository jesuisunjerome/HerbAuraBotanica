import { z } from "zod";

export function formatCurrency(amount, locale, currency = "MXN") {
  return Intl.NumberFormat(locale || navigator.language, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export const cartInfoSchema = z.object({
  firstName: z
    .string("El nombre es obligatorio")
    .min(1, "El nombre es obligatorio")
    .nonempty("El nombre es obligatorio")
    .trim(),
  lastName: z
    .string("El apellido es obligatorio")
    .min(1, "El apellido es obligatorio")
    .nonempty("El apellido es obligatorio")
    .trim(),
  email: z
    .email("El correo no es válido")
    .min(1, "El correo es obligatorio")
    .nonempty("El correo es obligatorio")
    .trim(),
  phone: z
    .string("El teléfono es obligatorio")
    .min(1, "El teléfono es obligatorio")
    .nonempty("El teléfono es obligatorio")
    .trim(),
  address: z
    .string("La dirección es obligatoria")
    .min(1, "La dirección es obligatoria")
    .nonempty("La dirección es obligatoria")
    .trim(),
  city: z
    .string("La ciudad es obligatoria")
    .min(1, "La ciudad es obligatoria")
    .nonempty("La ciudad es obligatoria")
    .trim(),
  postalCode: z
    .string("El código postal es obligatorio")
    .min(1, "El código postal es obligatorio")
    .nonempty("El código postal es obligatorio")
    .trim(),
  country: z
    .string("El país es obligatorio")
    .min(1, "El país es obligatorio")
    .nonempty("El país es obligatorio")
    .trim(),
  paymentMethod: z.enum(
    ["Paypal", "MercadoPago", "Stripe"],
    "El método de pago es obligatorio",
  ),
});
