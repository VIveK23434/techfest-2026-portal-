import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';

const fallbackEvents = [
  {
    _id: '1',
    name: 'Full-Stack Hackathon 2026',
    category: 'Technical',
    description: 'Build complete MERN applications within 24 hours. Exciting prizes!',
    fee: 150,
    seats: 60,
    seatsLeft: 42,
    date: '2026-11-12',
    venue: 'Computing Lab 3',
    coordinator: 'Dr. Anand / Prof. Meera',
  },
  {
    _id: '2',
    name: 'Cloud & DevOps Workshop',
    category: 'Workshop',
    description: 'Hands-on training in Docker, CI/CD with GitHub Actions, Render & Netlify deployment.',
    fee: 100,
    seats: 40,
    seatsLeft: 18,
    date: '2026-11-13',
    venue: 'Seminar Hall 1',
    coordinator: 'Dept. Faculty Coordinator',
  },
  {
    _id: '3',
    name: 'CyberSecurity CTF Challenge',
    category: 'Technical',
    description: 'Capture The Flag competition testing OWASP Top 10 web vulnerabilities & cryptography.',
    fee: 120,
    seats: 35,
    seatsLeft: 5,
    date: '2026-11-14',
    venue: 'Network Security Lab',
    coordinator: 'Prof. Rahul S.',
  },
  {
    _id: '4',
    name: 'AI & Machine Learning Expo',
    category: 'Workshop',
    description: 'Learn modern LLM agents, prompt engineering, and API integration.',
    fee: 200,
    seats: 50,
    seatsLeft: 0, // SOLD OUT demonstration
    date: '2026-11-15',
    venue: 'Main Auditorium',
    coordinator: 'Dr. George Mathew',
  },
  {
    _id: '5',
    name: 'E-Sports LAN Gaming',
    category: 'Gaming',
    description: 'Inter-collegiate Valorant and FIFA championship with live stream.',
    fee: 80,
    seats: 64,
    seatsLeft: 22,
    date: '2026-11-15',
    venue: 'Student Activity Hub',
    coordinator: 'Student Council Leads',
  },
];

export default function EventList() {
  const [events, setEvents] = useState(fallbackEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      if (res.data.success && res.data.data.length > 0) {
        setEvents(res.data.data);
        setError(null);
      }
    } catch (err) {
      console.warn('API currently waking up; serving resilient cached events:', err);
      // Fallback events already displayed; do not block the student UI!
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
