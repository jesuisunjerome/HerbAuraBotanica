import { z } from "zod";

const productImageSchema = z.object({
  url: z.string().url("La URL de la imagen debe ser válida"),
  isMain: z.boolean().default(false),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "El nombre es obligatorio" })
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z
      .string({ required_error: "La descripción es obligatoria" })
      .trim()
      .min(10, "La descripción debe tener al menos 10 caracteres"),
    price: z
      .number({ required_error: "El precio es obligatorio" })
      .positive("El precio debe ser un número positivo"),
    category: z
      .string({ required_error: "La categoría es obligatoria" })
      .trim(),
    stockQuantity: z
      .number({ required_error: "El stock es obligatorio" })
      .int("El stock debe ser un número entero")
      .nonnegative("El stock no puede ser negativo"),
    lowStockThreshold: z
      .number()
      .int("El umbral de stock debe ser un número entero")
      .nonnegative("El umbral de stock no puede ser negativo")
      .default(5),
    tags: z.string().optional(),
    images: z
      .array(productImageSchema)
      .min(1, "Se requiere al menos una imagen"),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3).optional(),
    description: z.string().trim().min(10).optional(),
    price: z.number().positive().optional(),
    category: z.string().trim().optional(),
    stockQuantity: z.number().int().nonnegative().optional(),
    lowStockThreshold: z.number().int().nonnegative().optional(),
    tags: z.string().optional(),
    images: z.array(productImageSchema).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de producto inválido"),
  }),
});

export const filterProductSchema = z.object({
  query: z.object({
    search: z.string().optional().default(""),
    sortBy: z
      .enum(["priceAsc", "priceDesc", "newest", ""])
      .optional()
      .default(""),
  }),
});
