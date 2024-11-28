import { Cart } from "../Models/Cart.js";

// Add to Cart
export const addToCart = async (req, res) => {
    const { productId, title, price, qty, imgSrc } = req.body; // Get product details from the request body
    const userId = req.user; // Get the user ID from the authenticated middleware

    try {
        // Find the user's cart or create a new one
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if the product already exists in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            // If the product exists, increment the quantity
            cart.items[itemIndex].qty += qty;
        } else {
            // Otherwise, add the product to the cart
            cart.items.push({ productId, title, price, qty, imgSrc });
        }

        // Save the cart
        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
};

// Get User Cart
export const userCart = async (req, res) => {
    const userId = req.user;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(200).json({ message: 'Cart not found', cart: { items: [] } });
        }

        const total = cart.items.reduce((sum, item) => sum + item.pricePerUnit * item.qty, 0);
        res.status(200).json({ message: 'User cart', cart, total });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// Remove Product from Cart
export const removeProductFromCart = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(200).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );

        await cart.save();
        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing product', error: error.message });
    }
};

// Clear Cart
export const clearCart = async (req, res) => {
    const userId = req.user;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        } else {
            cart.items = [];
        }

        await cart.save();
        res.status(200).json({ message: 'Cart cleared', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};

// Decrease Product Quantity
export const decreaseProductQty = async (req, res) => {
    const { productId, qty } = req.body;
    const userId = req.user;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(400).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            const item = cart.items[itemIndex];

            if (item.qty > qty) {
                item.qty -= qty;
            } else if (item.qty === qty) {
                cart.items.splice(itemIndex, 1);
            } else {
                return res.status(400).json({ message: 'Invalid quantity to decrease' });
            }
        } else {
            return res.status(400).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json({ message: 'Product quantity decreased', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error decreasing quantity', error: error.message });
    }
};
