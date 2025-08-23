const db = require('../models/db');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Fetch user first
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    let hashedPassword = userResult.rows[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, username, email, created_at',
      [
        username || userResult.rows[0].username,
        email || userResult.rows[0].email,
        hashedPassword,
        req.params.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
