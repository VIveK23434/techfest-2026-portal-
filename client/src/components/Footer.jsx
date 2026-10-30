import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '2.5rem 0 1.5rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              TechFest 2026
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Mar Baselios College of Engineering and Technology (MBCET)
              <br />Autonomous | Thiruvananthapuram, Kerala
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              Architecture
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>Frontend: React (SPA) on <strong>Netlify</strong></li>
              <li>Backend: Express & Node.js on <strong>Render</strong></li>
              <li>Database: <strong>MongoDB Atlas</strong> (Cloud M0)</li>
              <li>CI/CD: <strong>GitHub Actions</strong></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              Security Hardening
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>🛡️ Helmet CSP & HTTP Headers</li>
              <li>🛡️ NoSQL Injection Sanitization</li>
              <li>🛡️ XSS HTML Escaping</li>
              <li>🛡️ Bcrypt Password Hashing & JWT</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1.25rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          © 2026 Mar Baselios College of Engineering and Technology. Web Technology Laboratory (23CSB40B) — Experiment 5.
        </div>
      </div>
    </footer>
  );
}
