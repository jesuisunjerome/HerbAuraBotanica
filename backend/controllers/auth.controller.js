import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { COOKIE_NAME } from "../lib/constants.js";
import crypto from "crypto";
import fetch from "node-fetch";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Utilidad para generar tokens y guardar la sesión
 */
const generateTokensAndSetCookies = async (req, res, user) => {
  const jwtSecret = process.env.JWT_SECRET;
  const accessTimeStr = COOKIE_NAME.jwtTokenInMinute;
  const refreshTimeStr = COOKIE_NAME.refreshTokenInDay;

  // Validaciones
  if (!jwtSecret) {
    throw new Error("Falta JWT_SECRET en las variables de entorno");
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
    maxAge: parseInt(accessTimeStr) * 60 * 1000, // milisegundos
  });

  res.cookie(COOKIE_NAME.refreshToken, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    maxAge: parseInt(refreshTimeStr) * 24 * 60 * 60 * 1000, // milisegundos
  });

  return { accessToken, refreshToken, session };
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Por favor, proporciona todos los campos obligatorios",
      });
    }

    const unformattedEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: unformattedEmail });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = new User({
      name,
      email: unformattedEmail,
      password,
    });

    await user.save();

    await generateTokensAndSetCookies(res, user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, proporciona correo y contraseña" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.password) {
      return res
        .status(401)
        .json({ message: "Correo y/o contraseña inválidos" });
    }

    // Comprobar la contraseña mediante bycrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Correo y/o contraseña inválidos" });
    }

    await generateTokensAndSetCookies(req, res, user);

    res.json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    next(error);
  }
};

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res
        .status(400)
        .json({ message: "No se proporcionó el token de Google" });
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
  } catch (error) {
    next(error);
  }
};

// @desc    Facebook login
// @route   POST /api/auth/facebook
// @access  Public
export const facebookLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res
        .status(400)
        .json({ message: "No se proporcionó el token de Facebook" });
    }

    // Validate the token and get user profile
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
    );
    const data = await response.json();

    if (data.error) {
      return res.status(401).json({ message: "Token de Facebook inválido" });
    }

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
      if (!user.avatar && picture && picture.data && picture.data.url) {
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
    await generateTokensAndSetCookies(res, user);

    res.json({ message: "Inicio de sesión con Facebook exitoso" });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res, next) => {
  try {
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
      });
    }

    res.json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const currentRefreshToken = req.cookies[COOKIE_NAME.refreshToken];

    if (!currentRefreshToken) {
      return res
        .status(401)
        .json({ message: "No se proporcionó el token de actualización" });
    }

    let decoded;
    try {
      decoded = jwt.verify(currentRefreshToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "El token de actualización es inválido o ha expirado",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

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
      return res.status(401).json({
        message:
          "La sesión fue revocada por detección de reutilización del token",
      });
    }

    if (new Date(session.expiresAt) < new Date()) {
      // Remover sesión expirada
      user.sessions = user.sessions.filter(
        (s) => s.refreshToken !== hashedToken,
      );
      await user.save();
      return res
        .status(401)
        .json({ message: "El token de actualización ha expirado" });
    }

    // Token Rotation (Refresh Token Rotation): borramos el token anterior asegurando de un solo uso
    user.sessions = user.sessions.filter((s) => s.refreshToken !== hashedToken);

    // Generamos un nuevo par de tokens (Refresh + Access)
    await generateTokensAndSetCookies(res, user);

    res.json({ message: "Token actualizado exitosamente" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get connected user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    // El middleware req.user protege esta ruta y ya contiene la información del usuario en req.user
    if (!req.user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};
