import { z } from "zod";

export const subscribeSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "El correo es obligatorio" })
      .trim()
      .email("El correo electrónico no es válido"),
  }),
});
