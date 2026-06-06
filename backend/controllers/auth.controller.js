import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { COOKIE_NAME } from "../lib/constants.js";
import crypto from "crypto";
import fetch from "node-fetch";
import { AppError } from "../lib/error.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Utilidad para generar tokens y guardar la sesión
 * El parámetro `user` debe ser un documento de Mongoose completo (no lean)
 */
const generateTokensAndSetCookies = async (req, res, user) => {
  const jwtSecret = process.env.JWT_SECRET;
  const accessTimeStr = COOKIE_NAME.jwtTokenInMinute;
  const refreshTimeStr = COOKIE_NAME.refreshTokenInDay;

  // Validaciones
  if (!jwtSecret) {
    throw new AppError("Falta JWT_SECRET en las variables de entorno", 500);
  }

  // Generar Access Token
  const accessToken = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: `${accessTimeStr}m`,
  });

  // Generar Refresh Token
  const refreshToken = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: `${refreshTimeStr}d`,
  });

  // Guardar en la base de datos la sesión codificada por seguridad (Hashing)
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + parseInt(refreshTimeStr));

  const session = {
    tokenId: crypto.randomBytes(16).toString("hex"),
    refreshToken: hashedRefreshToken,
    expiresAt,
    device: req.headers["user-agent"],
    ip: req.ip,
  };

  user.sessions.push(session);
  await user.save();

  // Opciones de cookie
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(COOKIE_NAME.accessToken, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    maxAge: parseInt(accessTimeStr) * 60 * 1000,
  });

  res.cookie(COOKIE_NAME.refreshToken, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    maxAge: parseInt(refreshTimeStr) * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken, session };
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new AppError(
      "Por favor, proporciona todos los campos obligatorios",
      400,
    );

  const unformattedEmail = email.toLowerCase();

  const userExists = await User.findOne({ email: unformattedEmail }).lean();
  if (userExists) throw new AppError("El usuario ya existe", 400);

  const user = new User({
    name,
    email: unformattedEmail,
    password,
  });

  await user.save();

  await generateTokensAndSetCookies(req, res, user);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new AppError("Por favor, proporciona correo y contraseña", 400);

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.password)
    throw new AppError("Correo y/o contraseña inválidos", 401);

  // Comprobar la contraseña mediante bycrypt
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError("Correo y/o contraseña inválidos", 401);

  await generateTokensAndSetCookies(req, res, user);

  res.json({ message: "Inicio de sesión exitoso" });
};

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) {
    throw new AppError("No se proporcionó el token de Google", 400);
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({
    $or: [{ googleId }, { email: email.toLowerCase() }],
  });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
    }
    if (!user.avatar) {
      user.avatar = picture;
    }
  } else {
    user = new User({
      name,
      email: email.toLowerCase(),
      googleId,
      avatar: picture,
    });
  }

  await user.save();
  await generateTokensAndSetCookies(req, res, user);

  res.json({ message: "Inicio de sesión con Google exitoso" });
};

// @desc    Facebook login
// @route   POST /api/auth/facebook
// @access  Public
export const facebookLogin = async (req, res, next) => {
  const { accessToken } = req.body;

  if (!accessToken)
    throw new AppError("No se proporcionó el token de Facebook", 400);

  // Validate the token and get user profile
  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
  );
  const data = await response.json();

  if (data.error) throw new AppError("Token de Facebook inválido", 401);

  const { id: facebookId, name, email, picture } = data;

  // Email might be missing from FB depending on permissions
  let userQuery = [];
  if (facebookId) userQuery.push({ facebookId });
  if (email) userQuery.push({ email: email.toLowerCase() });

  let user = await User.findOne({ $or: userQuery });

  if (user) {
    if (!user.facebookId) {
      user.facebookId = facebookId;
    }
    if (!user.avatar && picture?.data?.url) {
      user.avatar = picture.data.url;
    }
  } else {
    user = new User({
      name,
      email: email ? email.toLowerCase() : undefined,
      facebookId,
      avatar: picture?.data?.url,
    });
  }

  await user.save();
  await generateTokensAndSetCookies(req, res, user);

  res.json({ message: "Inicio de sesión con Facebook exitoso" });
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res, next) => {
  // Tomamos el refresh token que nos manda
  const currentRefreshToken = req.cookies[COOKIE_NAME.refreshToken];

  // Limpiamos las cookies primero
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME.accessToken, "", {
    maxAge: 0,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
  });
  res.cookie(COOKIE_NAME.refreshToken, "", {
    maxAge: 0,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
  });

  // Si había usuario y token, borrar la sesión calculando el hash primero
  if (req.user && currentRefreshToken) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(currentRefreshToken)
      .digest("hex");

    // Como el middleware 'protect' excluye -sessions, usamos $pull directamente sobre la DB
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { sessions: { refreshToken: hashedToken } },
    }).lean();
  }

  res.json({ message: "Sesión cerrada exitosamente" });
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  const currentRefreshToken = req.cookies[COOKIE_NAME.refreshToken];

  if (!currentRefreshToken)
    throw new AppError("No se proporcionó el token de actualización", 401);

  let decoded;
  try {
    decoded = jwt.verify(currentRefreshToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError(
      "El token de actualización es inválido o ha expirado",
      401,
    );
  }

  const user = await User.findById(decoded.id);

  if (!user) throw new AppError("Usuario no encontrado", 401);

  // Verificar si el refresh token existe consultando su hash
  const hashedToken = crypto
    .createHash("sha256")
    .update(currentRefreshToken)
    .digest("hex");
  const session = user.sessions.find((s) => s.refreshToken === hashedToken);

  if (!session) {
    // Token Reuse Detection: el jwt validó pero el hash no está en DB.
    // Posible robo de token. Por seguridad, invalidamos TODAS las sesiones del usuario.
    user.sessions = [];
    await user.save();
    throw new AppError(
      "La sesión fue revocada por detección de reutilización del token",
      401,
    );
  }

  if (new Date(session.expiresAt) < new Date()) {
    user.sessions = user.sessions.filter((s) => s.refreshToken !== hashedToken);
    await user.save();
    throw new AppError("El token de actualización ha expirado", 401);
  }

  user.sessions = user.sessions.filter((s) => s.refreshToken !== hashedToken);

  await generateTokensAndSetCookies(req, res, user);

  res.json({ message: "Token actualizado exitosamente" });
};

// @desc    Get connected user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  // El middleware req.user protege esta ruta y ya contiene la información del usuario en req.user
  if (!req.user) throw new AppError("Usuario no encontrado", 404);

  res.json(req.user);
};
