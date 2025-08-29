# E-commerce API

A RESTful API for managing users, products, orders, and carts for an e-commerce platform.

## Features

- User registration and authentication (JWT)
- CRUD operations for users, products, orders, and carts
- Order creation with item validation
- Secure password hashing
- Input validation and error handling
- Swagger/OpenAPI documentation

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/ecommerce-api.git
   cd ecommerce-api
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database and JWT settings.

4. **Set up the database:**
   - Create a PostgreSQL database (e.g., `ecommerce2`).
   - Run the SQL scripts in `/migrations` or use your own schema.

5. **Start the server:**
   ```
   npm start
   ```
   The API will run on `http://localhost:5000` by default.

### Running Tests

```
npm test
```

### API Documentation

- Visit `http://localhost:5000/api-docs` for Swagger UI (if enabled).

## Example Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT
- `GET /api/users` — Get all users (auth required)
- `POST /api/orders` — Create a new order
- `GET /api/products` — List all products

## Project Structure

```
/controllers      # Route handlers
/models           # Database connection and queries
/routes           # Express route definitions
/middleware       # Auth and validation middleware
/tests            # Jest/Supertest test suites
/config           # Configuration files
```

## Contributing

Pull requests are welcome! For major changes, please open an issue
