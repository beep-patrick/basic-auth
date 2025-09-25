const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/redisClient', () => require('./redisMock'));
const redisClient = require('../src/redisClient');

beforeEach(() => {
  redisClient.__reset();
});

function encodeBasicAuth(username, password) {
  return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
}

describe('GET / (root) with Basic Auth', () => {
  it('should return 401 if no credentials are provided', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(401);
    expect(res.text).toMatch(/Authentication required|Invalid credentials/);
  });

  it('should return 401 if credentials are invalid', async () => {
    const res = await request(app)
      .get('/')
      .set('Authorization', encodeBasicAuth('baduser', 'badpass'));
    expect(res.statusCode).toBe(401);
    expect(res.text).toMatch(/Authentication required|Invalid credentials/);
  });

  it('should return 200 and hello if credentials are valid', async () => {
    // First, create a user
    await request(app)
      .post('/users')
      .send({ username: 'user1', password: 'pass1' })
      .expect(200);

    // Now, authenticate with that user
    const res = await request(app)
      .get('/')
      .set('Authorization', encodeBasicAuth('user1', 'pass1'));
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('hello');
  });
});
