import jwt from 'jsonwebtoken';
import { User } from '../Models/User.js'; // Import User model

export const Authenticated = async (req, res, next) => {
    const token = req.headers.auth; // Get the token from the Auth header
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Decode the token using your secret key
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace with your actual secret key
        const user = await User.findById(decoded.id); // Find the user by ID from the token payload
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user._id; // Attach the user's ID to the request object
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(400).json({ message: 'Invalid token.' });
    }
};
