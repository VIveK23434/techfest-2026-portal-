import React, { useState } from 'react';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', comment: '', rating: 5 });
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'submitting', msg: '' });

    try {
      const res = await axios.post('/api/feedback', formData);
      if (res.data.success) {
        setStatus({ state: 'success', msg: 'Thank you! Your feedback has been received and sanitized securely.' });
        setFormData({ name: '', email: '', comment: '', rating: 5 });
      }
    } catch (err) {
      setStatus({ state: 'error', msg: err.response?.data?.message || 'Failed to submit feedback.' });
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Contact & Feedback</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
          Have questions regarding TechFest 2026? Send us a message below.
        </p>

        {status.msg && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              backgroundColor: status.state === 'success' ? '#dcfce7' : '#fee2e2',
              color: status.state === 'success' ? '#15803d' : '#991b1b',
            }}
          >
            {status.msg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Bindhya P.S."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Rating (1 - 5)</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
              <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
              <option value={3}>⭐⭐⭐ (3 - Good)</option>
              <option value={2}>⭐⭐ (2 - Fair)</option>
              <option value={1}>⭐ (1 - Needs Improvement)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Message / Comment</label>
            <textarea
              required
              rows="4"
              placeholder="Type your message here..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
            />
          </div>

          <button type="submit" disabled={status.state === 'submitting'} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
            {status.state === 'submitting' ? 'Submitting...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
