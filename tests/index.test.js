const request = require('supertest');
const app = require('../src/index');

describe('GET /', () => {
  it('should return 200 and hello', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('hello');
  });
});

describe('POST /users', () => {
  it('should echo username and password if only those are provided', async () => {
    const res = await request(app)
      .post('/users')
      .send({ username: 'user1', password: 'pass1' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ username: 'user1', password: 'pass1' });
  });

  it('should return 400 if username is missing', async () => {
    const res = await request(app)
      .post('/users')
      .send({ password: 'pass1' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/users')
      .send({ username: 'user1' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if extra fields are present', async () => {
    const res = await request(app)
      .post('/users')
      .send({ username: 'user1', password: 'pass1', email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
