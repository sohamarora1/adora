import { Cart } from "../Models/Cart.js";

// Add to Cart
export const addToCart = async (req, res) => {
    const { productId, title, description = "No description provided", price, category = "uncategorized", type = "unknown", qty, imgSrc } = req.body;
    
    // Validate the fields you must have
    if (!productId || !title || !price || !qty || !imgSrc) {
        return res.status(400).json({ 
            message: 'Missing required fields. Ensure productId, title, price, qty, and imgSrc are included.' 
        });
    }

    const userId = req.user;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].qty += qty;
        } else {
            cart.items.push({ productId, title, description, price, category, type, qty, imgSrc });
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart.', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart.', error: error.message });
    }
};

        // Save the updated cart
        await cart.save();
        res.status(200).json({ message: 'Product added to cart successfully.', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart.', error: error.message });
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
