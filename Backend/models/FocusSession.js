const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 60 // minimum 60 seconds (1 minute)
  },
  peakFocus: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  distractions: {
    type: Number,
    required: true,
    default: 0
  },
  alerts: [{
    type: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const FocusSession = mongoose.model('FocusSession', focusSessionSchema);

module.exports = FocusSession;