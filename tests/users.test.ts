import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('GET /api/users', () => {
  it('returns all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/users/:id', () => {
  it('returns a user by id', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice Johnson');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/users/999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/users', () => {
  it('creates a user with valid data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test User');
  });

  it('returns 400 for missing name', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
  });

  // BUG: This test currently FAILS — empty body causes 500
  // Agent should fix this via DEMO-142
  it('returns 400 for empty body', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({});
    expect(res.status).toBe(400);
  });
});
