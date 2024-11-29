import express from "express";
import { addToCart, clearCart, decreaseProductQty, removeProductFromCart, userCart } from "../Controllers/cart.js";

import { Authenticated } from "../Middlewares/auth.js";



const router = express.Router();

//add to cart
router.post('/cart/add', authenticateUser, async (req, res) => {
    try {
        // Set CORS headers
        res.header('Access-Control-Allow-Origin', 'https://adorafrontend.vercel.app');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Auth');

        // Your existing cart addition logic
        // ...
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//get user cart
router.get("/user",Authenticated, userCart);

//remove product from cart
router.delete("/remove/:productId",Authenticated,removeProductFromCart);

//clear cart
router.delete('/clear',Authenticated,clearCart)

//decrease items from cart
router.post("/--qty",Authenticated,decreaseProductQty)


export default router;
