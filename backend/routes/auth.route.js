import express from "express";
import {
  facebookLogin,
  getConnectedUser,
  googleLogin,
  login,
  logout,
} from "../controllers/auth.controller.js";
import { verifyCookieToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/google", googleLogin);
router.post("/facebook", facebookLogin);
router.post("/login", login);
router.get("/me", verifyCookieToken, getConnectedUser);
router.post("/logout", verifyCookieToken, logout);

export default router;
