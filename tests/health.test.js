const request = require('supertest');
const app = require('../src/index');

describe('Health API', () => {
    test('GET /health - should return health status', async () => {
        const res = await request(app).get('/health');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('uptime');
    });

    test('GET / - should return app info', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Demo Backend API');
        expect(res.body).toHaveProperty('version');
    });
});
