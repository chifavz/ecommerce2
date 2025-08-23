const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all users
router.get('/', authMiddleware, usersController.getAllUsers);

// Get a user by ID
router.get('/:id', authMiddleware, usersController.getUserById);

// Create a new user
router.post('/', usersController.createUser);

// Update a user by ID
router.put('/:id', authMiddleware, usersController.updateUser);

// Delete a user by ID
router.delete('/:id', authMiddleware, usersController.deleteUser);
module.exports = router;