import {
  clearCookieToken,
  createCookieToken,
} from "../middlewares/auth.middleware.js";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("login controller");

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    createCookieToken(user, res);
    res.json({ message: "Login successful" });
  } catch (error) {
    console.log("Server error in login controller", error.message);
    return res
      .status(500)
      .json({ message: "Error del servidor: " + error.message });
  }
};

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  console.log("googleLogin controller");

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({ googleId: sub, email, name, avatar: picture });
      await user.save();
    }

    createCookieToken(user, res);
    res.json({ message: "Login successful" });
  } catch (error) {
    console.log("Server error in Google login controller", error.message);
    return res
      .status(500)
      .json({ message: "Error del servidor: " + error.message });
  }
};

// @desc    Facebook login
// @route   POST /api/auth/facebook
// @access  Public
export const facebookLogin = async (req, res) => {
  const { token } = req.body;

  console.log("facebookLogin controller");

  try {
    // Verificar token con Graph API de Facebook
    const fbResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`,
    );
    if (!fbResponse.ok) {
      throw new Error("Invalid Facebook token");
    }

    const { id, name, email, picture } = await fbResponse.json();

    let user = await User.findOne({ facebookId: id });
    if (!user) {
      user = new User({
        facebookId: id,
        email,
        name,
        avatar: picture?.data?.url || null,
      });

      await user.save();
    }

    createCookieToken(user, res);
    res.json({ message: "Login successful" });
  } catch (error) {
    console.log("Server error in Facebook login controller", error.message);
    return res
      .status(500)
      .json({ message: "Error del servidor: " + error.message });
  }
};

// @desc    Get connected user
// @route   GET /api/auth/me
// @access  Private
export const getConnectedUser = async (req, res) => {
  console.log("getConnectedUser controller");

  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log("Server error in getConnectedUser controller", error.message);
    return res
      .status(500)
      .json({ message: "Error del servidor: " + error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (_, res) => {
  console.log("logout controller");

  clearCookieToken(res);

  res.json({ message: "Logout successful" });
};
