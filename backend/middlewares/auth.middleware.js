import jwt from "jsonwebtoken";
import "dotenv/config";
import { COOKIE_NAME } from "../lib/constants.js";

export const verifyCookieToken = (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME.name];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};

export const createCookieToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  // Set token in HTTP-only cookie
  res.cookie(COOKIE_NAME.name, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
};

export const clearCookieToken = (res) => {
  res.clearCookie(COOKIE_NAME.name, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
};
