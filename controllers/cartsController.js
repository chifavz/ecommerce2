const db = require('../models/db');

// Get cart for a user
exports.getCart = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM carts WHERE user_id = $1', [req.params.userId]);
    if (result.rows.length === 0) {
      return res.json({ cart: [] });
    }
    res.json({ cart: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [req.params.userId, product_id, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const result = await db.query(
      'UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, req.params.userId, product_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { product_id } = req.body;
  try {
    const result = await db.query(
      'DELETE FROM carts WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.params.userId, product_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await db.query('DELETE FROM carts WHERE user_id = $1', [req.params.userId]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};