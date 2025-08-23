const request = require('supertest');
const app = require('../app');
const db = require('../models/db');

describe('Products API', () => {
  it('should get all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should not create a product with invalid data', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: '', price: 'not-a-number' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should create a product with valid data', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test Product', price: 19.99, description: 'A test product', stock: 10, image_url: 'http://example.com/image.jpg' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Product');
  });

  it('should get a product by ID', async () => {
    // First, create a product
    const createRes = await request(app)
      .post('/api/products')
      .send({ name: 'GetById', price: 10, description: 'desc', stock: 5, image_url: '' });
    const productId = createRes.body.id;

    // Then, get it by ID
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  it('should update a product', async () => {
    // Create a product
    const createRes = await request(app)
      .post('/api/products')
      .send({ name: 'ToUpdate', price: 5, description: 'desc', stock: 5, image_url: '' });
    const productId = createRes.body.id;

    // Update it
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .send({ name: 'Updated', price: 15, description: 'updated desc', stock: 10, image_url: '' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated');
  });

  it('should delete a product', async () => {
    // Create a product
    const createRes = await request(app)
      .post('/api/products')
      .send({ name: 'ToDelete', price: 8, description: 'desc', stock: 5, image_url: '' });
    const productId = createRes.body.id;

    // Delete it
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.statusCode).toBe(404);
  });

  // Add more tests as needed
});

afterAll(async () => {
  await db.close();
});