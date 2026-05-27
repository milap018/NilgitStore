import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/createToken.js";
import { setTokenCookie } from "../utils/setTokenCookie.js";

function cleanUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  };
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = createToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({ user: cleanUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user._id);
    setTokenCookie(res, token);

    res.json({ user: cleanUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully." });
}

export function session(req, res) {
  res.json({ user: cleanUser(req.user) });
}
