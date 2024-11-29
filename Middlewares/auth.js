import jwt from 'jsonwebtoken';

import { User } from '../Models/User.js';

export const Authenticated = async (req, res, next) => {
    try {
        // Extract token from multiple possible sources
        const token = 
            req.headers['authorization']?.replace('Bearer ', '') ||
            req.headers['auth'] ||
            req.body.token;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Additional user existence check
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Attach user ID to request
            req.user = decoded.userId;
            next();
        } catch (verifyError) {
            return res.status(401).json({ 
                message: 'Invalid or expired token',
                error: verifyError.message 
            });
        }
    } catch (error) {
        console.error('Authentication Middleware Error:', error);
        res.status(500).json({ 
            message: 'Internal server error during authentication' 
        });
    }
};
