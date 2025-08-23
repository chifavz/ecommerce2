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
          },
          responses: {
            201: {
              description: 'Product created'
            }
          }
        }
      }
    }
  }
};