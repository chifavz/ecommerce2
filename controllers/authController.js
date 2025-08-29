const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const config = require('../config/config');

exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (typeof username !== 'string' || username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters and not whitespace' });
    }
    if (username.length > 100) {
      return res.status(400).json({ message: 'Username too long (max 100 characters)' });
    }
    if (email.length > 100) {
      return res.status(400).json({ message: 'Email too long (max 100 characters)' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, username, email, password_hash) VALUES ($1, $2, $3, $4)',
      [name, username, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // Duplicate key error handling
    if (err.code === '23505') {
      if (err.detail && err.detail.includes('email')) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (err.detail && err.detail.includes('username')) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const userResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};