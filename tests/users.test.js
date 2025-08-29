const request = require('supertest');
const app = require('../app');
const db = require('../models/db');

describe('Users API', () => {
  let userId, productId;
  const unique = Date.now();
  const user = {
    name: 'Test User',
    username: `testuser${unique}`,
    email: `test${unique}@example.com`,
    password: 'password123'
  };

  beforeAll(async () => {
    // Create user
    const userRes = await request(app).post('/api/users').send({ username: 'orderuser', email: 'order@example.com', password: 'pass' });
    userId = userRes.body.id;
    // Create product
    const prodRes = await request(app).post('/api/products').send({ name: 'OrderProduct', price: 10, description: '', stock: 10, image_url: '' });
    productId = prodRes.body.id;
  });

  it('should create a user', async () => {
    const res = await request(app).post('/api/users').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    userId = res.body.id;
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a user by ID', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ username: 'updateduser', email: 'updated@example.com', password: 'newpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('updateduser');
  });

  it('should delete a user', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});

afterAll(async () => {
  await db.close();
});