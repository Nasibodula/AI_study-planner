// models/focusSession.js
const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  focusedDuration: {
    type: Number,
    default: 0
  },
  peakFocusScore: {
    type: Number,
    default: 0
  },
  averageFocusScore: {
    type: Number,
    default: 0
  },
  focusDataPoints: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    isFocused: {
      type: Boolean,
      default: false
    },
    eyeDistance: Number,
    eyeNoseDistance: Number,
    leftIrisPosition: Number,
    rightIrisPosition: Number,
    focusScore: Number
  }]
});

// Create indexes for efficient querying
focusSessionSchema.index({ userId: 1, startTime: -1 });
focusSessionSchema.index({ userId: 1, 'focusDataPoints.timestamp': 1 });

const FocusSession = mongoose.model('FocusSession', focusSessionSchema);

module.exports = FocusSession;