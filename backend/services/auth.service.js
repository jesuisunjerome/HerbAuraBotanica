import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { AppError } from "../lib/error.js";
import { COOKIE_NAME } from "../lib/constants.js";
import Session from "../models/Session.js";
import { hashToken } from "../lib/token.util.js";

/**
 * Utility to generate tokens and save the session.
 */
export const generateTokensAndSetCookies = async (req, res, user) => {
  const jwtSecret = process.env.JWT_SECRET;
  const accessTimeStr = COOKIE_NAME.jwtTokenInMinute;
  const refreshTimeStr = COOKIE_NAME.refreshTokenInDay;

  if (!jwtSecret) {
    throw new AppError("Falta JWT_SECRET en las variables de entorno", 500);
  }

  // Generate Access Token
  const accessToken = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: `${accessTimeStr}m`,
  });

  // Generate Refresh Token
  const refreshToken = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: `${refreshTimeStr}d`,
  });

  // Save session in DB
  const hashedRefreshToken = hashToken(refreshToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + Number.parseInt(refreshTimeStr));

  const sessionData = {
    user: user._id,
    tokenId: crypto.randomBytes(16).toString("hex"),
    refreshToken: hashedRefreshToken,
    expiresAt,
    device: req.headers["user-agent"],
    ip: req.ip,
  };

  const session = await Session.create(sessionData);

  // Cookie Options
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(COOKIE_NAME.accessToken, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    maxAge: Number.parseInt(accessTimeStr, 10) * 60 * 1000,
  });

  res.cookie(COOKIE_NAME.refreshToken, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    maxAge: Number.parseInt(refreshTimeStr, 10) * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken, session };
};
