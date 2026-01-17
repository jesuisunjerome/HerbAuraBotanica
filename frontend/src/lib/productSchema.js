import { z } from "zod";

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
    .min(1, "El producto debe tener al menos una imagen"),
  category: z
    .string()
    .min(1, "Categoría es obligatoria")
    .nonempty("Categoría es obligatoria"),
  stockQuantity: z.coerce
    .number({ invalid_type_error: "Cantidad en stock debe ser un número" })
    .min(0, "La cantidad en stock no puede ser negativa"),
  isActive: z.boolean().optional().default(true),
});

export const newProduct = {
  isActive: true,
  name: "Producto de Ejemplo",
  description: "Descripción del producto de ejemplo",
  price: 9.99,
  category: "categoria1",
  stockQuantity: 100,
};
