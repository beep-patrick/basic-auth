const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/redisClient', () => require('./redisMock'));
const redisClient = require('../src/redisClient');

beforeEach(() => {
  redisClient.__reset();
});

describe('POST /users', () => {
  const userStore = require('../src/users/userStore');

  it('should create a user whos password we can later verify', async () => {
    const user = { username: 'testuser', password: 'testpass' };
    const res = await request(app).post('/users').send(user);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ username: user.username });

    const storedUser = await userStore.getUser(user.username);
    expect(storedUser).toEqual({ username: user.username });

    const isMatch = await userStore.verifyUser(user.username, user.password);
    expect(isMatch).toBe(true);
  });

  it('should not create a user if username is missing', async () => {
    const res = await request(app).post('/users').send({ password: 'pass1' });

    expect(res.statusCode).toBe(400);

    expect(res.body).toHaveProperty('error');

    const storedUser = await userStore.getUser('');
    expect(storedUser).toBeNull();
  });

  it('should not create a user if password is missing', async () => {
    const res = await request(app).post('/users').send({ username: 'user1' });

    expect(res.statusCode).toBe(400);

    expect(res.body).toHaveProperty('error');

    const storedUser = await userStore.getUser('user1');
    expect(storedUser).toBeNull();
  });

  it('should not create a user if extra fields are present', async () => {
    const res = await request(app)
      .post('/users')
      .send({ username: 'user1', password: 'pass1', email: 'test@example.com' });

    expect(res.statusCode).toBe(400);
    
    expect(res.body).toHaveProperty('error');
    
    const storedUser = await userStore.getUser('user1');
    expect(storedUser).toBeNull();
  });
});
