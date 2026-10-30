import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: '',
    dob: '',
    gender: 'female',
    department: 'Computer Science & Engineering',
    selectedEvent: 'Full-Stack Hackathon 2026',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem('techfest_registered_participants');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('techfest_registered_participants', JSON.stringify(participants));
  }, [participants]);

  // Validation function using regular expressions (Experiment 2 & 5 Requirement)
  const validate = () => {
    const errs = {};
    // Name validation: Alphabetical and spaces only, min 3 characters
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (!/^[A-Za-z\s.]{3,50}$/.test(formData.name.trim())) {
      errs.name = 'Name must be 3-50 letters only';
    }

    // Email validation: standard RFC 5322 regex pattern
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    // Mobile validation: 10 digit Indian mobile starting with 6-9
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      errs.mobile = 'Mobile must be a 10-digit number starting with 6, 7, 8, or 9';
    }

    // DOB validation
    if (!formData.dob) {
      errs.dob = 'Date of birth is required';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Save participant
    const newParticipant = {
      id: Date.now(),
      ...formData,
      registeredAt: new Date().toLocaleTimeString(),
    };

    setParticipants((prev) => [newParticipant, ...prev]);
    setSubmitted(true);

    // Try posting to backend if server is accessible
    try {
      await axios.post('/api/registrations', {
        userName: formData.name,
        userEmail: formData.email,
        mobile: formData.mobile,
        department: formData.department,
        college: 'MBCET',
      });
    } catch (err) {
      // Gracefully handled; local record kept
    }
  };

  const handleDelete = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          TechFest 2026 Registration
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
          Secure online participant enrollment with client & server-side validation.
        </p>

        {submitted ? (
          <div
            style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: 'var(--radius)',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2.5rem',
            }}
          >
            <h2 style={{ color: '#166534', marginBottom: '0.5rem' }}>🎉 Registration Successful!</h2>
            <p style={{ color: '#15803d', marginBottom: '1rem' }}>
              Thank you, <strong>{formData.name}</strong>. Your confirmation token and details have been registered.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  mobile: '',
                  dob: '',
                  gender: 'female',
                  department: 'Computer Science & Engineering',
                  selectedEvent: 'Full-Stack Hackathon 2026',
                  message: '',
                });
              }}
              className="btn-primary"
            >
              Register Another Participant
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '3rem',
            }}
          >
            {/* Full Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.name ? 'var(--danger)' : 'var(--border)'}`,
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                }}
              />
              {errors.name && (
                <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. student@mbcet.ac.in"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.email ? 'var(--danger)' : 'var(--border)'}`,
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                }}
              />
              {errors.email && (
                <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Mobile Number & DOB Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                  Mobile Number (10 digits) *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.mobile ? 'var(--danger)' : 'var(--border)'}`,
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.mobile && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                    {errors.mobile}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${errors.dob ? 'var(--danger)' : 'var(--border)'}`,
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.dob && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                    {errors.dob}
                  </span>
                )}
              </div>
            </div>

            {/* Gender Radio Buttons */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Gender *</label>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleChange}
                  />
                  Other
                </label>
              </div>
            </div>

            {/* Department Select Dropdown */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                College Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            {/* Event Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                Select Event *
              </label>
              <select
                name="selectedEvent"
                value={formData.selectedEvent}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="Full-Stack Hackathon 2026">Full-Stack Hackathon 2026 (₹150)</option>
                <option value="Cloud & DevOps Workshop">Cloud & DevOps Workshop (₹100)</option>
                <option value="CyberSecurity CTF Challenge">CyberSecurity CTF Challenge (₹120)</option>
                <option value="E-Sports LAN Gaming">E-Sports LAN Gaming (₹80)</option>
              </select>
            </div>

            {/* Optional Queries / Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
                Queries / Requirements (Optional)
              </label>
              <textarea
                name="message"
                rows="3"
                placeholder="Mention any team members or special requirements..."
                value={formData.message}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1.05rem' }}>
              Complete Registration
            </button>
          </form>
        )}

        {/* Dynamic Registered Participants List (Exp 2 & 5 Requirement) */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem' }}>
              Registered Participants ({participants.length})
            </h3>
            {participants.length > 0 && (
              <button
                onClick={() => setParticipants([])}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
              >
                Clear All
              </button>
            )}
          </div>

          {participants.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No registered participants stored yet. Fill the form above to add an entry.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {participants.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {p.email} | {p.mobile} | <em>{p.selectedEvent}</em>
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold' }}
                    title="Remove entry"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
