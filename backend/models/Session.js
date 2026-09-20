import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
    index: { expires: 0 }, // Automáticamente elimina la sesión cuando expira
  },
});

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
export default Session;
