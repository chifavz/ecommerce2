const request = require('supertest');
const app = require('../app');
const db = require('../models/db');

describe('Orders API', () => {
  let orderId, userId, productId;
  let order;

  beforeAll(async () => {
    // Create user with name
    const unique = Date.now();
    const userRes = await request(app)
      .post('/api/users')
      .send({
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

    // Prepare order object with correct user_id and product_id
    order = { user_id: userId, items: [{ product_id: productId, quantity: 2 }], status: 'pending' };
  });

  it('should create an order', async () => {
    const res = await request(app).post('/api/orders').send(order);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    orderId = res.body.id;
  });

  it('should get all orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get an order by ID', async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(orderId);
  });

  it('should update an order', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'shipped' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('shipped');
  });

  it('should delete an order', async () => {
    const res = await request(app).delete(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});

afterAll(async () => {
  await db.close();
});