import jwt from 'jsonwebtoken';
import { User } from '../Models/User.js';

export const Authenticated = async (req, res, next) => {
   try {
        // Check for token in different possible header formats
        let token = req.headers.auth || 
                    req.headers.authorization || 
                    req.headers['x-access-token'];
        
        // Remove 'Bearer ' prefix if present
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        // Ensure token is a string
        if (typeof token === 'object') {
            try {
                // If it's an object, try to extract the token
                token = token.token;
            } catch (error) {
                return res.status(401).json({ message: 'Invalid token format.' });
            }
        }
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "(*&98767");
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user._id; // Attach the user ID instead of full object
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token format.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired.' });
        }
        
        res.status(401).json({ message: 'Invalid token.' });
    }
};
