import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/events');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      setError('Could not connect to backend server. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search and category
  const filteredEvents = events.filter((e) => {
    const matchesCategory = category === 'All' || e.category === category;
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                          e.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section style={{ margin: '2rem 0' }}>
      {/* Search and Filter Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          padding: '1.25rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ flex: '1', minWidth: '240px' }}>
          <input
            type="text"
            placeholder="🔍 Search events by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
            }}
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Workshop">Workshop</option>
            <option value="Gaming">Gaming</option>
            <option value="Management">Management</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--primary)', fontWeight: 600 }}>
          ⏳ Loading TechFest events from API...
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          {error}
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={fetchEvents} className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Event Cards Grid */}
      {!loading && filteredEvents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          No events match your criteria.
        </div>
      )}

      <div className="card-grid">
        {filteredEvents.map((event) => (
          <EventCard key={event._id || event.name} event={event} onBookSuccess={fetchEvents} />
        ))}
      </div>
    </section>
  );
}
