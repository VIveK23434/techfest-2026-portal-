const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/registrations
 * @desc    Register authenticated user for an event
 * @access  Private
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { eventId, college, mobile, department } = req.body;

    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: 'Event ID is required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: 'Selected event does not exist' });
    }

    if (event.seatsLeft <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Registration closed: Event is SOLD OUT',
      });
    }

    // Check if user is already registered for this event
    const alreadyRegistered = await Registration.findOne({
      user: req.user.id,
      event: eventId,
      status: 'confirmed',
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event',
      });
    }

    // Create registration record
    const registration = await Registration.create({
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      event: event._id,
      eventName: event.name,
      college: college || 'MBCET',
      mobile: mobile || '9876543210',
      department: department || 'CSE',
      status: 'confirmed',
    });

    // Decrement seatsLeft
    event.seatsLeft = Math.max(0, event.seatsLeft - 1);
    await event.save();

    res.status(201).json({
      success: true,
      message: `Successfully registered for ${event.name}!`,
      data: registration,
      remainingSeats: event.seatsLeft,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/registrations/my
 * @desc    Get registrations for currently logged in user
 * @access  Private
 */
router.get('/my', protect, async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      user: req.user.id,
    }).populate('event', 'name category fee date venue');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/registrations
 * @desc    Get all registrations (Admin / Organizer)
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const registrations = await Registration.find().populate(
      'event',
      'name fee category'
    );
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/registrations/:id
 * @desc    Cancel a registration and restore event seat
 * @access  Private
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: 'Registration not found' });
    }

    // Check ownership or admin
    if (
      registration.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    // Restore event seat
    const event = await Event.findById(registration.event);
    if (event) {
      event.seatsLeft = Math.min(event.seats, event.seatsLeft + 1);
      await event.save();
    }

    await registration.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Registration cancelled and seat restored successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
