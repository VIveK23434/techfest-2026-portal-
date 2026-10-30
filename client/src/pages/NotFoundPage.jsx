import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
        The requested URL was not found on this server. Please return to the homepage or check the URL.
      </p>
      <Link to="/">
        <button className="btn-primary">Return to Home</button>
      </Link>
    </div>
  );
}
