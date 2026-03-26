import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { COOKIE_NAME } from "../lib/constants.js";

/**
 * Middleware para proteger rutas, verificando el JWT access token.
 */
export const protect = async (req, res, next) => {
  let token;

  // Intentar obtener el token de las cookies o del header de Autorización (Bearer)
  if (req.cookies && req.cookies[COOKIE_NAME.accessToken]) {
    token = req.cookies[COOKIE_NAME.accessToken];
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Decodificar el token usando el secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario por el ID del payload y excluir el password
    req.user = await User.findById(decoded.id).select("-password -sessions");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
