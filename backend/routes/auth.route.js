import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  facebookLogin,
  logoutUser,
  refreshToken,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/facebook", facebookLogin);
router.post("/refresh-token", refreshToken);

// Rutas protegidas
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

export default router;
