import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeStyle = ({ isActive }) => ({
    fontWeight: isActive ? '700' : '500',
    color: isActive ? 'var(--primary)' : 'inherit',
    borderBottom: isActive ? '2px solid var(--primary)' : 'none',
    paddingBottom: '4px',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          style={{
            fontSize: '1.35rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>🚀</span>
          <span>TechFest <span style={{ color: 'var(--primary)' }}>2026</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="desktop-nav"
        >
          <NavLink to="/" style={activeStyle}>
            Home
          </NavLink>
          <NavLink to="/events" style={activeStyle}>
            Events
          </NavLink>
          <NavLink to="/register" style={activeStyle}>
            Register
          </NavLink>
          <NavLink to="/gallery" style={activeStyle}>
            Gallery
          </NavLink>
          <NavLink to="/security-audit" style={activeStyle}>
            🛡️ Security Audit
          </NavLink>
          <NavLink to="/contact" style={activeStyle}>
            Contact
          </NavLink>
        </nav>

        {/* Right actions: Theme toggle, Cart badge, Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Cart Badge */}
          <Link
            to="/events"
            style={{
              position: 'relative',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'var(--border)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
            title="Registered Cart"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--danger)',
                  color: '#fff',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark and Light theme"
            style={{
              padding: '8px 12px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* User Auth */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
