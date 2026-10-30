import React, { useState } from 'react';
import axios from 'axios';

export default function SecurityAuditPage() {
  const [nosqlInput, setNosqlInput] = useState('{"$ne": null}');
  const [xssInput, setXssInput] = useState("<script>alert('TechFest XSS Attack')</script>");
  const [testResult, setTestResult] = useState(null);
  const [headersResult, setHeadersResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Test XSS submission against /api/feedback
  const handleTestXss = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await axios.post('/api/feedback', {
        name: 'Vulnerability Tester',
        email: 'security@mbcet.ac.in',
        comment: xssInput,
        rating: 5,
      });
      setTestResult({
        type: 'XSS Prevention Test',
        status: 'SUCCESS',
        sanitizedData: res.data.data.comment,
        explanation:
          res.data.data.comment.includes('<script>')
            ? '❌ VULNERABLE: Raw script tag was preserved!'
            : '🛡️ SECURE: Dangerous HTML tags successfully escaped to safe entities (&lt;script&gt;) preventing script injection.',
      });
    } catch (err) {
      setTestResult({
        type: 'XSS Test',
        status: 'BLOCKED',
        explanation: 'Server blocked or rejected the payload: ' + (err.response?.data?.message || err.message),
      });
    } finally {
      setLoading(false);
    }
  };

  // Inspect security response headers from Render API
  const handleCheckHeaders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/health');
      setHeadersResult({
        status: res.status,
        headers: res.headers,
        data: res.data,
      });
    } catch (err) {
      setHeadersResult({ error: 'Could not fetch headers: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          🛡️ Experiment 5: Security & OWASP Audit
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Interactive verification of Web Application Security defenses implemented in Module 5.
        </p>

        {/* 1. OWASP Top 10 Defenses Overview */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            1. Implemented Security Controls Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <strong>🔒 NoSQL Injection Defense:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <code>express-mongo-sanitize</code> strips prohibited operators (<code>$gt</code>, <code>$ne</code>, <code>$where</code>) from incoming body and query parameters.
              </p>
            </div>

            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <strong>🛡️ Cross-Site Scripting (XSS):</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                React escapes strings by default; server sanitizes text via HTML entity encoder; Helmet enforces Content-Security-Policy (CSP).
              </p>
            </div>

            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <strong>🍪 CSRF & Cookie Security:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Authentication tokens transmitted with <code>httpOnly</code> (inaccessible to JS), <code>secure</code> (HTTPS only), and <code>sameSite: Lax/Strict</code>.
              </p>
            </div>

            <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <strong>🔑 Cryptographic Password Hashing:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Passwords hashed using <code>bcryptjs</code> with 10 salt rounds before persistence to MongoDB Atlas.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Interactive XSS Demonstration (Exp 5 Procedure Step 4) */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>
            2. Cross-Site Scripting (XSS) Live Test
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Enter a malicious script tag (e.g. <code>&lt;script&gt;alert('hi')&lt;/script&gt;</code>) and send it to the backend feedback route:
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={xssInput}
              onChange={(e) => setXssInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
              }}
            />
            <button onClick={handleTestXss} disabled={loading} className="btn-primary">
              {loading ? 'Testing...' : 'Send Payload'}
            </button>
          </div>

          {testResult && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
              }}
            >
              <h4 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Test Result:</h4>
              <p><strong>Sanitized Value Returned by Server:</strong> <code>{testResult.sanitizedData}</code></p>
              <p style={{ marginTop: '6px', fontWeight: 600 }}>{testResult.explanation}</p>
            </div>
          )}
        </div>

        {/* 3. HTTP Security Headers Audit (Helmet) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem' }}>3. Live HTTP Security Headers Inspection</h2>
            <button onClick={handleCheckHeaders} disabled={loading} className="btn-secondary">
              Inspect Headers
            </button>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Queries <code>/api/health</code> to verify security headers injected by <code>helmet()</code>.
          </p>

          {headersResult && (
            <pre
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                overflowX: 'auto',
                border: '1px solid var(--border)',
              }}
            >
              {JSON.stringify(headersResult, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
