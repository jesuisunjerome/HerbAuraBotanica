import { z } from "zod";

export function formatCurrency(amount, locale, currency = "MXN") {
  return Intl.NumberFormat(locale || navigator.language, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function base64ToFile(base64String, filename) {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1]; // extrae el tipo MIME
  const bstr = atob(arr[1]); // decodifica base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export const CART = {
  PAYMENT_METHODS: [
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
  ],
  STEPS: {
    CART_INFO: "CART_INFO",
    PAYMENT: "PAYMENT",
  },
};

export const SORT_BY_OPTIONS = [
  { value: "", label: "Todos los productos" },
  { value: "price-low-high", label: "Precio: Bajo a Alto" },
  { value: "price-high-low", label: "Precio: Alto a Bajo" },
  { value: "newest", label: "Novedades" },
];

// Esquema de validación para la información del carrito de compras
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
