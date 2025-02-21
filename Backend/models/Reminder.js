const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Reminder title is required'],
    trim: true
  },
  time: {
    type: String,
    required: [true, 'Reminder time is required']
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

module.exports = mongoose.model('Reminder', ReminderSchema);