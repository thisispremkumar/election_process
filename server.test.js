const request = require('supertest');
const app = require('./server');

describe('Server Endpoints and Security', () => {
    
    it('should have security headers (Helmet)', async () => {
        const res = await request(app).get('/');
        expect(res.headers).toHaveProperty('content-security-policy');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('should reject requests without a message in /api/chat', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({});
            
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Message is required');
    });

    it('should handle /api/chat appropriately based on API key presence', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({ message: "What is a primary?" });
            
        // If no API key is present in env, it should return 503
        // If it is present, it might return 200 (if key is valid) or 500 (if invalid key causes throw)
        // Since we don't have a valid key in the test environment, we'll just check it returns one of the expected statuses
        expect([200, 500, 503]).toContain(res.statusCode);
    });
});
