const db = require('../models/db');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  // Validation for required fields
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, username, email, password) are required' });
  }

  // Add length validation
  if (name && name.length > 100) {
    return res.status(400).json({ message: 'Name too long (max 100 characters)' });
  }
  if (username && username.length > 100) {
    return res.status(400).json({ message: 'Username too long (max 100 characters)' });
  }
  if (email && email.length > 100) {
    return res.status(400).json({ message: 'Email too long (max 100 characters)' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    let hashedPassword = userResult.rows[0].password_hash;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const result = await db.query(
      'UPDATE users SET name = $1, username = $2, email = $3, password_hash = $4 WHERE id = $5 RETURNING id, name, username, email, created_at',
      [
        name || userResult.rows[0].name,
        username || userResult.rows[0].username,
        email || userResult.rows[0].email,
        hashedPassword,
        req.params.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
