module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'E-commerce API',
    version: '1.0.0',
    description: 'API documentation for the E-commerce project',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local server'
    }
  ],
  paths: {
    '/api/products': {
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number' },
                  description: { type: 'string' }
                },
                required: ['name', 'price']
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Product created'
          }
        }
      }
    },
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders',
        responses: {
          200: { description: 'List of orders' }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user_id: { type: 'integer' },
                  items: { type: 'array', items: { type: 'object' } },
                  total: { type: 'number' }
                },
                required: ['user_id', 'items', 'total']
              }
            }
          }
        },
        responses: {
          201: { description: 'Order created' }
        }
      }
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        responses: {
          200: { description: 'List of users' }
        }
      },
      post: {
        tags: ['Users'],
        summary: 'Create a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  username: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['name', 'username', 'email', 'password']
              }
            }
          }
        },
        responses: {
          201: { description: 'User created' }
        }
      }
    },
    '/api/carts': {
      get: {
        tags: ['Carts'],
        summary: 'Get all carts',
        responses: {
          200: { description: 'List of carts' }
        }
      },
      post: {
        tags: ['Carts'],
        summary: 'Add item to cart',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user_id: { type: 'integer' },
                  product_id: { type: 'integer' },
                  quantity: { type: 'integer' }
                },
                required: ['user_id', 'product_id', 'quantity']
              }
            }
          }
        },
        responses: {
          201: { description: 'Item added to cart' }
        }
      }
    }
  }
};