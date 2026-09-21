import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { USER_ROLES } from "../lib/constants.js";

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
    password: String,
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
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (solo para usuarios con contraseña local)
userSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
