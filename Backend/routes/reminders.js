// reminderSchema.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

const ReminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Reminder title is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Reminder date is required']
  },
  time: {
    type: String,
    required: [true, 'Reminder time is required']
  },
  sound: {
    type: Boolean,
    default: true
  },
  notified: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Get all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id })
      .sort({ date: 1, time: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new reminder
router.post('/', async (req, res) => {
  try {
    const reminder = new Reminder({
      ...req.body,
      user: req.user.id
    });
    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update reminder
router.patch('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete reminder
router.delete('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;