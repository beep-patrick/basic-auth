const request = require('supertest');
const app = require('../src/app');
jest.mock('../src/redisClient', () => require('./redisMock'));

describe('GET /', () => {
  it('should return 200 and hello', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('hello');
  });
});
