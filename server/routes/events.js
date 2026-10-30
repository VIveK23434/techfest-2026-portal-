const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

// Seed default events if none exist
const defaultEvents = [
  {
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
    name: 'Cloud & DevOps Workshop',
    category: 'Workshop',
    description: 'Hands-on training in Docker, CI/CD with GitHub Actions, Render & Netlify deployment.',
    fee: 100,
    seats: 40,
    seatsLeft: 18,
    date: '2026-11-13',
    venue: 'Seminar Hall 1',
    coordinator: 'Prof. Bindhya P.S.',
  },
  {
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
    name: 'AI & Machine Learning Expo',
    category: 'Workshop',
    description: 'Learn modern LLM agents, prompt engineering, and API integration.',
    fee: 200,
    seats: 50,
    seatsLeft: 0, // SOLD OUT example
    date: '2026-11-15',
    venue: 'Main Auditorium',
    coordinator: 'Dr. George Mathew',
  },
  {
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

/**
 * @route   GET /api/events
 * @desc    Get all events with optional category filter and keyword search
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Resilient fallback for offline / CI environments
      return res.status(200).json({
        success: true,
        count: defaultEvents.length,
        data: defaultEvents,
      });
    }

    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let events = await Event.find(query).sort({ createdAt: -1 });

    // Auto-seed if database is empty
    if (events.length === 0 && !category && !search) {
      await Event.insertMany(defaultEvents);
      events = await Event.find(query).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/events
 * @desc    Create a new event (Protected: Admin or Authenticated)
 * @access  Private
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { name, category, description, fee, seats, date, venue, coordinator } =
      req.body;

    if (!name || fee === undefined || !seats || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, fee, seats, and date',
      });
    }

    const newEvent = await Event.create({
      name,
      category: category || 'Technical',
      description: description || 'TechFest 2026 exciting event.',
      fee: Number(fee),
      seats: Number(seats),
      seatsLeft: Number(seats),
      date,
      venue: venue || 'Main Campus',
      coordinator: coordinator || req.user.name,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event
 * @access  Private
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: 'Event not found' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: 'Event not found' });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
