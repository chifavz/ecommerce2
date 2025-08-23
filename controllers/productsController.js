const db = require('../models/db');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, price, description FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, price, description FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, price, description, stock, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, price, description, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, price, description, stock, image_url',
      [name, price, description, stock, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const productResult = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const result = await db.query(
      'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING id, name, price, description',
      [
        name || productResult.rows[0].name,
        price || productResult.rows[0].price,
        description || productResult.rows[0].description,
        req.params.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};