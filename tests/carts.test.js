const request = require('supertest');
const app = require('../app');
const db = require('../models/db');

describe('Carts API', () => {
  let userId, productId;

  beforeAll(async () => {
    const unique = Date.now();
    const userRes = await request(app).post('/api/users').send({
      name: 'Test User',
      username: `testuser${unique}`,
      email: `test${unique}@example.com`,
      password: 'password123'
    });
    userId = userRes.body.id;
    // Create product
    const prodRes = await request(app)
      .post('/api/products')
      .send({ name: 'OrderProduct', price: 10, description: '', stock: 10, image_url: '' });
    productId = prodRes.body.id;
  });

  it('should add item to cart', async () => {
    const res = await request(app)
      .post(`/api/carts/${userId}/add`)
      .send({ product_id: productId, quantity: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body.product_id).toBe(productId);
  });

  it('should get cart for a user', async () => {
    const res = await request(app).get(`/api/carts/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.cart)).toBe(true);
  });

  it('should update item quantity in cart', async () => {
    const res = await request(app)
      .put(`/api/carts/${userId}/update`)
      .send({ product_id: productId, quantity: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(5);
  });

  it('should remove item from cart', async () => {
    const res = await request(app)
      .delete(`/api/carts/${userId}/remove`)
      .send({ product_id: productId });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/removed/i);
  });

  it('should clear cart', async () => {
    const res = await request(app).delete(`/api/carts/${userId}/clear`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/cleared/i);
  });
});

afterAll(async () => {
  await db.close();
});