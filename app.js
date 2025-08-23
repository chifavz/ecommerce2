require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/carts', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running' });
});

// Error handler (optional)
if (require('fs').existsSync('./middleware/errorHandler.js')) {
  app.use(require('./middleware/errorHandler'));
}

module.exports = app;