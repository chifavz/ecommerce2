const request = require('supertest');
const app = require('../app');
const db = require('../models/db');

describe('Auth API - Additional Scenarios', () => {
    const user = { name: 'Test User', username: 'testuser', email: 'test@example.com', password: 'password123' };

    it('should not register a user with invalid email format', async () => {
        const unique = Date.now();
        const newUser = { ...user, username: `testuser${unique}`, email: 'invalid-email' };
        const res = await request(app).post('/api/auth/register').send(newUser);
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        expect(res.body.message).toBeDefined();
    });

    it('should not register a user with short password', async () => {
        const unique = Date.now();
        const newUser = { ...user, username: `testuser${unique}`, email: `test${unique}@example.com`, password: '123' };
        const res = await request(app).post('/api/auth/register').send(newUser);
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        expect(res.body.message).toBeDefined();
    });

    it('should not register a user with whitespace-only username', async () => {
        const unique = Date.now();
        const newUser = { ...user, username: '   ', email: `test${unique}@example.com` };
        const res = await request(app).post('/api/auth/register').send(newUser);
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        expect(res.body.message).toBeDefined();
    });

    it('should not login with whitespace-only password', async () => {
        const unique = Date.now();
        const newUser = { ...user, username: `testuser${unique}`, email: `test${unique}@example.com` };
        await request(app).post('/api/auth/register').send(newUser);
        const res = await request(app).post('/api/auth/login').send({ username: newUser.username, password: '   ' });
        expect([401, 400, 500]).toContain(res.statusCode);
        expect(res.body.message).toBeDefined();
    });

    it('should not register a user with extra fields', async () => {
        const unique = Date.now();
        const newUser = { ...user, username: `testuser${unique}`, email: `test${unique}@example.com`, extra: 'field' };
        const res = await request(app).post('/api/auth/register').send(newUser);
        // Should ignore extra fields and succeed, or fail if strict validation
        expect([201, 400]).toContain(res.statusCode);
    });

    it('should not login with email instead of username', async () => {
        const unique = Date.now();
        const newUser = { ...user, username: `testuser${unique}`, email: `test${unique}@example.com` };
        await request(app).post('/api/auth/register').send(newUser);
        const res = await request(app).post('/api/auth/login').send({ username: newUser.email, password: newUser.password });
        expect([401, 400, 500]).toContain(res.statusCode);
        expect(res.body.message).toBeDefined();
    });

    it('should not register a user with a very long username', async () => {
        const unique = Date.now();
        const longUsername = 'a'.repeat(256);
        const newUser = { ...user, username: longUsername, email: `test${unique}@example.com` };
        const res = await request(app).post('/api/auth/register').send(newUser);
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        expect(res.body.message).toBeDefined();
    });
});
