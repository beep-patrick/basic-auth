const app = require('../src/index');
const request = require('supertest');
const userStore = require('../src/userStore');

jest.mock('../src/redisClient', () => require('./redisMock'));

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

describe('POST /users integration with store', () => {

  it('should add a new user to the store', async () => {
    const user = { username: 'testuser', password: 'testpass' };
    await request(app).post('/users').send(user).expect(200);

    const storedUser = await userStore.getUser('testuser');
    expect(storedUser).toEqual(user);
  });

  it('should not add user if validation fails', async () => {
    await request(app).post('/users').send({ username: 'baduser' }).expect(400);

    const storedUser = await userStore.getUser('baduser');
    expect(storedUser).toBeNull();
  });
});
