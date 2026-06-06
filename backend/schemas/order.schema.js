import { z } from "zod";

const orderItemSchema = z.object({
  name: z.string({ required_error: "El nombre del producto es obligatorio" }),
  quantity: z
    .number({ required_error: "La cantidad es obligatoria" })
    .int()
    .positive("La cantidad debe ser mayor a 0"),
  image: z.string({ required_error: "La imagen del producto es obligatoria" }),
  price: z.number().nonnegative().optional(), // El precio se verificará y asignará desde el backend
  product: z
    .string({ required_error: "El ID de producto es obligatorio" })
    .regex(/^[0-9a-fA-F]{24}$/, "ID de producto inválido"),
});

const shippingAddressSchema = z.object({
  address: z.string({ required_error: "La dirección es obligatoria" }),
  city: z.string({ required_error: "La ciudad es obligatoria" }),
  postalCode: z.string({ required_error: "El código postal es obligatorio" }),
  state: z.string({ required_error: "El estado/provincia es obligatorio" }),
  country: z.string({ required_error: "El país es obligatorio" }),
});

const customerSchema = z.object({
  name: z.string({ required_error: "El nombre del cliente es obligatorio" }),
  email: z
    .string({ required_error: "El correo del cliente es obligatorio" })
    .email("El correo del cliente no es válido"),
  phone: z.string().optional(),
});

export const createOrderSchema = z.object({
  body: z.object({
    orderItems: z
      .array(orderItemSchema)
      .min(1, "La orden debe contener al menos un producto"),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(["PayPal", "Stripe", "Apple Pay", "Mercado Pago"], {
      errorMap: () => ({ message: "Método de pago no soportado" }),
    }),
    customer: customerSchema,
  }),
});

export const capturePaypalOrderSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de orden inválido"),
  }),
  body: z.object({
    paypalOrderId: z.string({
      required_error: "El ID de orden de PayPal es obligatorio",
    }),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de orden inválido"),
  }),
  body: z.object({
    updatedStatus: z.enum(["Processing", "Shipped", "Delivered", "Cancelled"], {
      errorMap: () => ({ message: "Estatus de orden inválido" }),
    }),
    comment: z.string().optional(),
  }),
});
