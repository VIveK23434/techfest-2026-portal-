const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: ['Technical', 'Workshop', 'Cultural', 'Gaming', 'Management'],
      default: 'Technical',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    fee: {
      type: Number,
      required: [true, 'Event fee is required'],
      min: [0, 'Fee cannot be negative'],
      default: 0,
    },
    seats: {
      type: Number,
      required: [true, 'Total seats required'],
      min: [1, 'Must have at least 1 seat'],
    },
    seatsLeft: {
      type: Number,
      required: true,
      min: [0, 'Seats left cannot be negative'],
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    venue: {
      type: String,
      default: 'Campus Auditorium',
    },
    coordinator: {
      type: String,
      default: 'TechFest Faculty/Student Leads',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
