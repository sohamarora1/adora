import express from 'express';
import { 
    registerUser, 
    loginUser, 
    validateToken 
} from '../Controllers/user.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/validate-token', validateToken); // New validation endpoint

export default router;
