import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Token Validation Endpoint
export const validateToken = async (req, res) => {
    try {
        const token = req.body.token || 
                      req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ valid: false, message: 'No token provided' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Additional check: Verify user exists
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ valid: false, message: 'User not found' });
            }

            // Check token expiration (optional additional check)
            if (decoded.exp * 1000 < Date.now()) {
                return res.status(401).json({ valid: false, message: 'Token expired' });
            }

            return res.json({ 
                valid: true, 
                userId: decoded.userId 
            });
        } catch (verifyError) {
            return res.status(401).json({ 
                valid: false, 
                message: 'Invalid token',
                error: verifyError.message 
            });
        }
    } catch (error) {
        console.error('Token Validation Error:', error);
        res.status(500).json({ 
            valid: false, 
            message: 'Internal server error during token validation' 
        });
    }
};
//user register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res.json({ message: "User already exist", success: false });
    const hashPass = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashPass });
    res.json({ message: "User register successfully", user, success: true });
  } catch (error) {
    res.json({ message: error.message });
  }
};
//user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found", success: false });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.json({ message: "invalid credential", success: false });

    const token = jwt.sign({ userId: user._id }, "(*&98767", {
      expiresIn: "365d",
    });

    res.json({ message: `welcome ${user.name}`, token, success: true });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//get all user
export const users = async (req, res) => {
  try {
    let users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
};

//get profile
export const profile = async (req, res) => {
  res.json({ user: req.user });
};
