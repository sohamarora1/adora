import jwt from 'jsonwebtoken';
import { User } from '../Models/User.js';

export const Authenticated = async (req, res, next) => {
    try {
        const token = req.headers.auth;
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, "(*&98767"); // Use the same secret as in login
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user; // Attach the full user object
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token.' });
    }
};
