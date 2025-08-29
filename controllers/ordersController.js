const db = require('../models/db');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { user_id, items, status } = req.body;
    // Calculate total (sum of quantity * product price for each item)
    let total = 0;
    for (const item of items) {
      const prodRes = await db.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
      if (prodRes.rows.length === 0) continue;
      total += prodRes.rows[0].price * item.quantity;
    }
    const result = await db.query(
      'INSERT INTO orders (user_id, items, status, total) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, JSON.stringify(items), status || 'pending', total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { status, items } = req.body;
  try {
    // Get current order
    const current = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (!current.rows.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const currentItems = current.rows[0].items;
    const updatedItems = items !== undefined ? items : currentItems;
    const result = await db.query(
      'UPDATE orders SET status = $1, items = $2 WHERE id = $3 RETURNING *',
      [status, JSON.stringify(updatedItems), orderId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};