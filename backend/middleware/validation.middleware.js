import { AppError } from "../lib/error.js";

/**
 * Middleware de validación de peticiones utilizando esquemas de Zod
 */
export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const errorDetails = result.error.errors
      .map((err) => {
        // Remueve la raíz 'body', 'query' o 'params' para mostrar solo la ruta del campo
        const fieldName = err.path.slice(1).join(".");
        return `${fieldName || "campo"}: ${err.message}`;
      })
      .join(", ");

    throw new AppError(`Error de validación: ${errorDetails}`, 400);
  }

  const data = result.data;

  if (data.body !== undefined) req.body = data.body;
  if (data.params !== undefined) req.params = data.params;

  // No reasignar req.query en Express 5
  if (data.query !== undefined) req.validatedQuery = data.query;

  next();
};
