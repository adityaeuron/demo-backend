const request = require('supertest');
const app = require('../src/index');

describe('Calculator API', () => {
    test('POST /api/calculator/add - should return sum', async () => {
        const res = await request(app)
            .post('/api/calculator/add')
            .send({ a: 5, b: 3 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('operation', 'add');
        expect(res.body).toHaveProperty('result', 8);
    });

    test('POST /api/calculator/divide - should handle division by zero', async () => {
        const res = await request(app)
            .post('/api/calculator/divide')
            .send({ a: 10, b: 0 });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Cannot divide by zero');
    });

    test('POST /api/calculator/add - should validate input types', async () => {
        const res = await request(app)
            .post('/api/calculator/add')
            .send({ a: 'five', b: 3 });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Both operands must be numbers');
    });

    test('POST /api/calculator/factorial - should calculate factorial', async () => {
        const res = await request(app)
            .post('/api/calculator/factorial')
            .send({ n: 5 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('result', 120);
    });
});
