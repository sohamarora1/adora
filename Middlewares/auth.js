import jwt from 'jsonwebtoken';
import { User } from '../Models/User.js';

export const Authenticated = async (req, res, next) => {
    const token = req.headers.auth; // Token is sent in the `Auth` header
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace with your JWT secret
        const user = await User.findById(decoded.id); // Find the user by ID from the token
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        req.user = user._id; // Attach the user's ID to the request
        next(); // Pass control to the next middleware
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
