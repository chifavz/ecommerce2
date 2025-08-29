const request = require('supertest');
const app = require('../app');
const db = require('../models/db');

describe('Auth API', () => {
  const user = { name: 'Test User', username: 'testuser', email: 'test@example.com', password: 'password123' };

  afterAll(async () => {
    await db.close();
  });

  it('should register a new user', async () => {
    const unique = Date.now();
    const newUser = { ...user, username: `testuser${unique}`, email: `test${unique}@example.com` };
    const res = await request(app).post('/api/auth/register').send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registered/i);
  });

  it('should not register a user with duplicate email', async () => {
    const unique = Date.now();
    const newUser = { ...user, username: `testuser${unique}` };
    await request(app).post('/api/auth/register').send(newUser);
    const res = await request(app).post('/api/auth/register').send(newUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should login and return a token', async () => {
    const unique = Date.now();
    const newUser = { ...user, username: `testuser${unique}`, email: `test${unique}@example.com` };
    await request(app).post('/api/auth/register').send(newUser);
    const res = await request(app).post('/api/auth/login').send({ username: newUser.username, password: newUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const unique = Date.now();
    const newUser = { ...user, username: `testuser${unique}`, email: `test${unique}@example.com` };
    await request(app).post('/api/auth/register').send(newUser);
    const res = await request(app).post('/api/auth/login').send({ username: newUser.username, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should not login with non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nouser', password: 'password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('should not register a user with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'missingfields' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.message).toBeDefined();
  });

  it('should not login with missing password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should not login with missing username', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'password123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});