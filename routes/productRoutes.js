const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { body, validationResult } = require('express-validator');

// Get all products
router.get('/', productsController.getAllProducts);

// Get a product by ID
router.get('/:id', productsController.getProductById);

// Create a new product
router.post(
  '/',
  [
    body('name').notEmpty(),
    body('price').isNumeric()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  productsController.createProduct
);

// Update a product by ID
router.put('/:id', productsController.updateProduct);

// Delete a product by ID
router.delete('/:id', productsController.deleteProduct);

module.exports = router;