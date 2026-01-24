import { z } from "zod";

// Esquema de validación para la información del carrito de compras
export const checkoutSchema = z.object({
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
  state: z
    .string("El estado es obligatorio")
    .min(1, "El estado es obligatorio")
    .nonempty("El estado es obligatorio")
    .trim(),
  country: z
    .string("El país es obligatorio")
    .min(1, "El país es obligatorio")
    .nonempty("El país es obligatorio")
    .trim(),
  paymentMethod: z.enum(
    ["PayPal", "MercadoPago", "Stripe"],
    "El método de pago es obligatorio",
  ),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nombre del producto es obligatorio")
    .nonempty("Nombre del producto es obligatorio"),
  description: z
    .string()
    .min(1, "Descripción es obligatoria")
    .nonempty("Descripción es obligatoria"),
  price: z.coerce
    .number({ invalid_type_error: "Precio debe ser un número" })
    .positive("El precio debe ser positivo")
    .min(0, "El precio no puede ser negativo"),
  images: z
    .array(z.url("Cada imagen debe ser una URL válida"))
    .min(2, "El producto debe tener al menos 2 imágenes"),
  category: z
    .string()
    .min(1, "Categoría es obligatoria")
    .nonempty("Categoría es obligatoria"),
  stockQuantity: z.coerce
    .number({ invalid_type_error: "Cantidad en stock debe ser un número" })
    .min(0, "La cantidad en stock no puede ser negativa"),
  discountPercentage: z.coerce
    .number({
      invalid_type_error: "El porcentaje de descuento debe ser un número",
    })
    .min(0, "El porcentaje de descuento no puede ser negativo")
    .max(100, "El porcentaje de descuento no puede ser mayor a 100")
    .optional(),
  tags: z.string().min(1, "Debe haber al menos una etiqueta"),
  isActive: z.boolean().optional().default(true),
});
