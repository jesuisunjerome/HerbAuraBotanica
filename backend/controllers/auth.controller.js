import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";

import User from "../models/User.js";
import Session from "../models/Session.js";
import { AppError } from "../lib/error.js";
import { COOKIE_NAME } from "../lib/constants.js";
import { generateTokensAndSetCookies } from "../services/auth.service.js";
import { hashToken } from "../lib/token.util.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

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

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user?.password)
    throw new AppError("Correo y/o contraseña inválidos", 401);

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
    if (!user.googleId) user.googleId = googleId;
    if (!user.avatar) user.avatar = picture;
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

  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
  );
  const data = await response.json();

  if (data.error) throw new AppError("Token de Facebook inválido", 401);

  const { id: facebookId, name, email, picture } = data;

  let userQuery = [];
  if (facebookId) userQuery.push({ facebookId });
  if (email) userQuery.push({ email: email.toLowerCase() });

  let user = await User.findOne({ $or: userQuery });

  if (user) {
    if (!user.facebookId) user.facebookId = facebookId;
    if (!user.avatar && picture?.data?.url) user.avatar = picture.data.url;
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
  const currentRefreshToken = req.cookies[COOKIE_NAME.refreshToken];

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

  if (req.user && currentRefreshToken) {
    const hashedToken = hashToken(currentRefreshToken);
    await Session.deleteOne({ refreshToken: hashedToken, user: req.user._id });
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

  const hashedToken = hashToken(currentRefreshToken);
  const session = await Session.findOne({ refreshToken: hashedToken, user: user._id });

  if (!session) {
    // Token Reuse Detection
    await Session.deleteMany({ user: user._id });
    throw new AppError(
      "La sesión fue revocada por detección de reutilización del token",
      401,
    );
  }

  if (new Date(session.expiresAt) < new Date()) {
    await Session.deleteOne({ _id: session._id });
    throw new AppError("El token de actualización ha expirado", 401);
  }

  await Session.deleteOne({ _id: session._id });

  await generateTokensAndSetCookies(req, res, user);

  res.json({ message: "Token actualizado exitosamente" });
};

// @desc    Get connected user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  if (!req.user) throw new AppError("Usuario no encontrado", 404);
  res.json(req.user);
};
