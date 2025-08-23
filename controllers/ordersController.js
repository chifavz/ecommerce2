const db = require('../models/db');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const { user_id, items, status } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO orders (user_id, items, status) VALUES ($1, $2, $3) RETURNING *',
      [user_id, JSON.stringify(items), status || 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  const { items, status } = req.body;
  try {
    const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const result = await db.query(
      'UPDATE orders SET items = $1, status = $2 WHERE id = $3 RETURNING *',
      [
        items ? JSON.stringify(items) : orderResult.rows[0].items,
        status || orderResult.rows[0].status,
        req.params.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};