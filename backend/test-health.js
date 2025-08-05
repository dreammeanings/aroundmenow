const app = require('./src/index');
const request = require('supertest');

describe('Health Check', () => {
  it('should return 200 for health endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
}); 