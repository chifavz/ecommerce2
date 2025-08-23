const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/cartsController');
const authMiddleware = require('../middleware/authMiddleware');

// Get cart for a user
router.get('/:userId', authMiddleware, cartsController.getCart);

// Add item to cart
router.post('/:userId/add', authMiddleware, cartsController.addToCart);

// Update item quantity in cart
router.put('/:userId/update', authMiddleware, cartsController.updateCartItem);

// Remove item from cart
router.delete('/:userId/remove', authMiddleware, cartsController.removeFromCart);

// Clear cart
router.delete('/:userId/clear', authMiddleware, cartsController.clearCart);

module.exports = router;