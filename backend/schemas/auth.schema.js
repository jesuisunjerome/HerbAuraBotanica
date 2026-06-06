import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "El nombre es obligatorio" })
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder los 50 caracteres"),
    email: z
      .string({ required_error: "El correo es obligatorio" })
      .trim()
      .email("El correo electrónico no es válido"),
    password: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "El correo es obligatorio" })
      .trim()
      .email("El correo electrónico no es válido"),
    password: z
      .string({ required_error: "La contraseña es obligatoria" }),
  }),
});
