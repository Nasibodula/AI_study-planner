// const express = require('express');
// const router = express.Router();
// const Reminder = require('../models/Reminder');
// const auth = require('../middleware/auth');

// router.post('/', auth, async (req, res) => {
//   try {
//     const reminder = new Reminder({
//       ...req.body,
//       userId: req.user._id
//     });
//     await reminder.save();
//     res.status(201).json(reminder);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.get('/', auth, async (req, res) => {
//   try {
//     const reminders = await Reminder.find({ userId: req.user._id });
//     res.json(reminders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const reminder = await Reminder.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user._id
//     });
//     if (!reminder) {
//       return res.status(404).json({ error: 'Reminder not found' });
//     }
//     res.json({ message: 'Reminder deleted' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Reminder Schema
const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Reminder = mongoose.model('Reminder', reminderSchema);

// Get all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user?.id });
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
      userId: req.user?.id
    });
    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;