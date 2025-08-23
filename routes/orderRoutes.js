const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all orders (admin or user)
router.get('/', authMiddleware, ordersController.getAllOrders);

// Get a specific order by ID
router.get('/:id', authMiddleware, ordersController.getOrderById);

// Create a new order
router.post('/', authMiddleware, ordersController.createOrder);

// Update an order by ID
router.put('/:id', authMiddleware, ordersController.updateOrder);

// Delete an order by ID
router.delete('/:id', authMiddleware, ordersController.deleteOrder);

module.exports = router;