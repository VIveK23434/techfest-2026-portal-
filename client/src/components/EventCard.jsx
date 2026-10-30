import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function EventCard({ event, onBookSuccess }) {
  const [seatsLeft, setSeatsLeft] = useState(event.seatsLeft);
  const [isBooking, setIsBooking] = useState(false);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleRegisterClick = async () => {
    if (seatsLeft <= 0) return;

    setIsBooking(true);
    setMessage('');

    try {
      // If user is logged in, attempt to register on the backend API
      if (user) {
        const res = await axios.post('/api/registrations', {
          eventId: event._id,
          college: 'MBCET',
          department: 'Computer Science',
          mobile: '9876543210',
        });
        if (res.data.success) {
          setSeatsLeft((prev) => Math.max(0, prev - 1));
          addToCart(event);
          setMessage('✅ Registered successfully!');
          if (onBookSuccess) onBookSuccess();
        }
      } else {
        // Local simulation if guest
        setSeatsLeft((prev) => Math.max(0, prev - 1));
        addToCart(event);
        setMessage('Added to cart! (Login to reserve in database)');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const isSoldOut = seatsLeft <= 0;

  return (
    <div className="card">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--primary)',
              letterSpacing: '0.5px',
            }}
          >
            {event.category}
          </span>
          <span className={`badge ${isSoldOut ? 'badge-soldout' : 'badge-available'}`}>
            {isSoldOut ? 'SOLD OUT' : `${seatsLeft} seats left`}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {event.name}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem', minHeight: '55px' }}>
          {event.description}
        </p>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>📅 <strong>Date:</strong> {event.date}</div>
          <div>📍 <strong>Venue:</strong> {event.venue || 'Campus Lab'}</div>
          <div>👤 <strong>Coordinator:</strong> {event.coordinator || 'Faculty Lead'}</div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            ₹{event.fee}
          </span>
          <button
            onClick={handleRegisterClick}
            disabled={isSoldOut || isBooking}
            className={`btn-primary ${isSoldOut ? 'btn-disabled' : ''}`}
            style={{
              backgroundColor: isSoldOut ? '#94a3b8' : undefined,
            }}
          >
            {isSoldOut ? 'SOLD OUT' : isBooking ? 'Processing...' : 'Register Now'}
          </button>
        </div>

        {message && (
          <p style={{ fontSize: '0.8rem', color: isSoldOut ? 'var(--danger)' : 'var(--primary)', marginTop: '4px' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
