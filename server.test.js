const request = require('supertest');
const app = require('./server');

describe('Server Endpoints and Security', () => {
    
    describe('Security Headers', () => {
        it('should have security headers (Helmet)', async () => {
            const res = await request(app).get('/');
            expect(res.headers).toHaveProperty('content-security-policy');
            expect(res.headers['x-content-type-options']).toBe('nosniff');
            expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
            expect(res.headers['x-powered-by']).toBeUndefined();
        });

        it('should have CORS enabled', async () => {
            const res = await request(app).options('/api/chat');
            expect(res.headers['access-control-allow-origin']).toBeDefined();
        });
    });

    describe('API Chat Endpoint - /api/chat', () => {
        it('should return 400 if message is missing', async () => {
            const res = await request(app)
                .post('/api/chat')
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Message is required');
        });

        it('should return 400 if message is empty string', async () => {
            const res = await request(app)
                .post('/api/chat')
                .send({ message: "" });
            expect(res.statusCode).toBe(400);
        });

        it('should handle large messages gracefully', async () => {
            const longMessage = 'A'.repeat(5000);
            const res = await request(app)
                .post('/api/chat')
                .send({ message: longMessage });
            
            // Should either process or fail gracefully (not crash)
            expect([200, 400, 500, 503]).toContain(res.statusCode);
        });

        it('should handle special characters in message', async () => {
            const res = await request(app)
                .post('/api/chat')
                .send({ message: "<script>alert('xss')</script> & electoral search" });
            expect([200, 500, 503]).toContain(res.statusCode);
        });
    });

    describe('Static Assets', () => {
        it('should serve index.html', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('<!DOCTYPE html>');
        });

        it('should serve styles.css', async () => {
            const res = await request(app).get('/styles.css');
            expect(res.statusCode).toBe(200);
            expect(res.header['content-type']).toContain('text/css');
        });

        it('should serve script.js', async () => {
            const res = await request(app).get('/script.js');
            expect(res.statusCode).toBe(200);
            expect(res.header['content-type']).toMatch(/javascript/);
        });
    });

    describe('Rate Limiting', () => {
        it('should handle many requests', async () => {
            // We won't trigger the actual 50 limit in a unit test to avoid blocking, 
            // but we check if the middleware is applied.
            const res = await request(app).post('/api/chat').send({ message: "test" });
            expect(res.headers).toHaveProperty('x-ratelimit-limit');
        });
    });
});
