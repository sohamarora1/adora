import jwt from 'jsonwebtoken';

export const Authenticated = async (req, res, next) => {
    try {
        // Check token in multiple headers
        const token = 
            req.headers['auth'] || 
            req.headers['authorization']?.replace('Bearer ', '') || 
            req.headers['x-access-token'];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.userId;
            next();
        } catch (tokenError) {
            return res.status(401).json({ 
                message: 'Invalid or expired token',
                error: tokenError.message 
            });
        }
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(500).json({ 
            message: 'Internal server error during authentication' 
        });
    }
};
