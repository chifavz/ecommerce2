require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce2',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};