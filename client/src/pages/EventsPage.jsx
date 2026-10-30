import React, { useState } from 'react';
import EventList from '../components/EventList';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function EventsPage() {
  const { cartItems, removeFromCart, clearCart, totalFee } = useCart();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    category: 'Technical',
    description: '',
    fee: 100,
    seats: 50,
    date: '2026-11-15',
    venue: 'Seminar Hall 2',
  });
  const [msg, setMsg] = useState('');

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/events', newEvent);
      if (res.data.success) {
        setMsg('✅ Event created successfully! Refresh to see it in the list.');
        setShowAddModal(false);
        window.location.reload();
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create event. Must be logged in.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>TechFest 2026 Events</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Filter by domain, check live seat availability, and register instantly.
          </p>
        </div>

        {user && (
          <button onClick={() => setShowAddModal(!showAddModal)} className="btn-primary">
            {showAddModal ? 'Close Form' : '➕ Add New Event'}
          </button>
        )}
      </div>

      {msg && (
        <div style={{ padding: '12px', background: '#dcfce7', color: '#15803d', borderRadius: '8px', marginBottom: '1rem' }}>
          {msg}
        </div>
      )}

      {/* Add Event Form Modal */}
      {showAddModal && (
        <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Event</h3>
          <form onSubmit={handleCreateEvent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Event Name</label>
              <input
                type="text"
                required
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
              >
                <option value="Technical">Technical</option>
                <option value="Workshop">Workshop</option>
                <option value="Gaming">Gaming</option>
                <option value="Management">Management</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Registration Fee (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={newEvent.fee}
                onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Total Seats</label>
              <input
                type="number"
                min="1"
                required
                value={newEvent.seats}
                onChange={(e) => setNewEvent({ ...newEvent, seats: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
              <textarea
                required
                rows="2"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <button type="submit" className="btn-primary">Save Event</button>
            </div>
          </form>
        </div>
      )}

      {/* Cart Summary Panel if items selected */}
      {cartItems.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem' }}>🛒 Selected Events ({cartItems.length})</h3>
            <button onClick={clearCart} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
              Clear Cart
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            {cartItems.map((item) => (
              <span
                key={item._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {item.name} (₹{item.fee})
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontWeight: 'bold' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            <span><strong>Total Amount:</strong> ₹{totalFee}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered through CartContext state</span>
          </div>
        </div>
      )}

      {/* Dynamic Event List */}
      <EventList />
    </div>
  );
}
