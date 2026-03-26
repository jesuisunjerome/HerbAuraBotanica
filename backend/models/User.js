import mongoose from "mongoose";
import { USER_ROLES } from "../lib/constants.js";

const sessionSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  device: String,
  ip: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      sparse: true, // permite usuarios sin correo (ej. algunos proveedores sociales)
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },

    // Google OAuth fields
    googleId: {
      type: String,
      index: true,
    },

    // Facebook OAuth fields
    facebookId: {
      type: String,
      index: true,
    },

    avatar: {
      type: String,
    },
    // sessions: [sessionSchema],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
