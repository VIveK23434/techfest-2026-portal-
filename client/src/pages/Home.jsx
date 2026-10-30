import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    axios
      .get('/api/health')
      .then((res) => setHealth(res.data))
      .catch(() => setHealth({ status: 'offline', database: 'disconnected' }))
      .finally(() => setChecking(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
          color: '#ffffff',
          padding: '5rem 0 4rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container">
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            Mar Baselios College of Engineering and Technology
          </span>

          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>
            TechFest 2026 Portal
          </h1>
          <p style={{ fontSize: '1rem', color: '#fef08a', fontWeight: 600, marginBottom: '0.5rem' }}>
            🔔 Special Announcement: Registrations close on 10th November 2026!
          </p>

          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 2rem', opacity: 0.95 }}>
            Annual National Technical Symposium. Explore cutting-edge workshops, hackathons, and competitions hosted on a production-hardened MERN stack.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/events">
              <button
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1e3a8a',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}
              >
                Browse Events
              </button>
            </Link>
            <Link to="/security-audit">
              <button
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#ffffff',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(5px)',
                }}
              >
                🛡️ View Security Audit
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cloud & DevOps Deployment Status Bar */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>☁️</span>
            <div>
              <strong style={{ fontSize: '0.9rem' }}>Experiment 5 Cloud Status:</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                Netlify (Frontend) ➔ Render (Backend) ➔ Atlas (DB)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                padding: '4px 10px',
                borderRadius: '15px',
                backgroundColor: health?.status === 'ok' ? '#dcfce7' : '#fee2e2',
                color: health?.status === 'ok' ? '#15803d' : '#b91c1c',
                fontWeight: 600,
              }}
            >
              API: {checking ? 'Checking...' : health?.status === 'ok' ? 'Online (Render)' : 'Offline'}
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                padding: '4px 10px',
                borderRadius: '15px',
                backgroundColor: health?.database === 'connected' ? '#dcfce7' : '#fef3c7',
                color: health?.database === 'connected' ? '#15803d' : '#b45309',
                fontWeight: 600,
              }}
            >
              DB: {health?.database === 'connected' ? 'Atlas Connected' : 'Resilient Seed Mode'}
            </span>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Features / Highlights */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Symposium Highlights</h2>
            <p style={{ color: 'var(--text-muted)' }}>Experience national level coding challenges and technology sessions</p>
          </div>

          <div className="card-grid">
            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💻</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>24h Hackathon</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Collaborate in teams to build innovative web and cloud applications solving real-world challenges.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☁️</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Cloud & DevOps</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Master automated CI/CD workflows, Docker containerization, and production cloud monitoring.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Security & CTF</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Learn OWASP Top 10 defenses including XSS sanitization, NoSQL injection prevention, and CSP.
              </p>
            </div>
          </div>
        </section>

        {/* Tabular Event Schedule (Manual Requirement) */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.25rem' }}>Event Schedule</h2>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)',
              }}
            >
              <caption style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Official TechFest 2026 Programme Schedule
              </caption>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Time</th>
                  <th style={{ padding: '12px 16px' }}>Event Name</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Venue</th>
                  <th style={{ padding: '12px 16px' }}>Coordinator</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>09:30 AM</td>
                  <td style={{ padding: '12px 16px' }}>Inauguration Ceremony</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-available">General</span></td>
                  <td style={{ padding: '12px 16px' }}>Main Auditorium</td>
                  <td style={{ padding: '12px 16px' }}>Principal & HOD CSE</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>10:30 AM</td>
                  <td style={{ padding: '12px 16px' }}>Full-Stack Hackathon 2026</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-available">Technical</span></td>
                  <td style={{ padding: '12px 16px' }}>Computing Lab 3</td>
                  <td style={{ padding: '12px 16px' }}>Dr. Anand</td>
                </tr>
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>01:00 PM</td>
                  <td colSpan="4" style={{ padding: '12px 16px', textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    🍱 Networking Lunch Break
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>02:00 PM</td>
                  <td style={{ padding: '12px 16px' }}>Cloud & DevOps Deployment Hands-on</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-available">Workshop</span></td>
                  <td style={{ padding: '12px 16px' }}>Seminar Hall 1</td>
                  <td style={{ padding: '12px 16px' }}>Prof. Bindhya P.S.</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>04:00 PM</td>
                  <td style={{ padding: '12px 16px' }}>CyberSecurity CTF Finale</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-available">Technical</span></td>
                  <td style={{ padding: '12px 16px' }}>Security Lab</td>
                  <td style={{ padding: '12px 16px' }}>Prof. Rahul S.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: 'var(--bg-card)', borderTop: '2px solid var(--border)' }}>
                  <td colSpan="5" style={{ padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Total registered events: 5 | Venue: MBCET Autonomous Campus
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Organizing Committee & Sponsors */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Organizing Committee</h3>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem' }}>
              <div>
                <dt style={{ fontWeight: 700 }}>Chief Patron:</dt>
                <dd style={{ color: 'var(--text-muted)', marginLeft: '12px' }}>Rev. Fr. John V. (Director)</dd>
              </div>
              <div>
                <dt style={{ fontWeight: 700 }}>Staff Coordinator:</dt>
                <dd style={{ color: 'var(--text-muted)', marginLeft: '12px' }}>Prof. Bindhya P.S. (Dept. of CSE)</dd>
              </div>
              <div>
                <dt style={{ fontWeight: 700 }}>Student Convener:</dt>
                <dd style={{ color: 'var(--text-muted)', marginLeft: '12px' }}>Abhishek Nair (S7 CSE)</dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Sponsors & Partners</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              <li><strong>GitHub Education</strong> — Student Developer Pack & CI/CD</li>
              <li><strong>MongoDB Atlas</strong> — Cloud Database Partner</li>
              <li><strong>Render Cloud</strong> — Scalable API Hosting</li>
              <li><strong>Netlify</strong> — Global Edge CDN Deployment</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Floating Register Button */}
      <Link to="/register" className="floating-register-btn" aria-label="Register for TechFest 2026">
        <span>✍️</span> Register Now
      </Link>
    </div>
  );
}
