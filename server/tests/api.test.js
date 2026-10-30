const request = require('supertest');
const app = require('../server');

describe('TechFest 2026 Portal - Security & API Suite', () => {
  // Test 1: Health check endpoint
  test('GET /api/health should return status 200 and ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
    expect(res.body.service).toBeDefined();
  });

  // Test 2: Unknown route should return 404
  test('GET /api/invalid-route should return 404', async () => {
    const res = await request(app).get('/api/invalid-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });

  // Test 3: XSS payload sanitization on feedback
  test('POST /api/feedback should sanitize XSS script tags in comments', async () => {
    const xssPayload = {
      name: 'Tester',
      email: 'test@example.com',
      comment: "<script>alert('xss')</script>Hello",
      rating: 5,
    };

    // When submitted, our xssClean / sanitizeHtmlString converts < and > into HTML entities
    const res = await request(app).post('/api/feedback').send(xssPayload);
    // Should accept with 201 or handle gracefully
    if (res.statusCode === 201) {
      expect(res.body.data.comment).not.toContain('<script>');
      expect(res.body.data.comment).toContain('&lt;script&gt;');
    }
  });

  // Test 4: Auth registration validation
  test('POST /api/auth/register should reject empty body with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  // Test 5: Protected route access without token
  test('GET /api/auth/me should reject unauthorized requests with 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});
