// const express = require('express');
// const mongoose = require('mongoose');
// const Session = require('../models/Session');

// const router = express.Router(); // Initialize the router

// // Start a new session
// router.post('/start', async (req, res) => {
//   const { userId } = req.body;

//   // Validate userId
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ message: 'Invalid userId' });
//   }

//   const session = new Session({ userId, focusScore: 0, duration: 0 });
//   await session.save();
//   res.status(201).json({ message: 'Session started', sessionId: session._id });
// });

// // End a session and save data
// // router.post('/end', async (req, res) => {
// //   const { sessionId, focusScore, duration } = req.body;

// //   // Check if duration is more than 1 minute (60 seconds)
// //   if (duration < 60) {
// //     await Session.findByIdAndDelete(sessionId); // Delete the session if duration is less than 1 minute
// //     return res.status(200).json({ message: 'Session discarded (duration < 1 minute)' });
// //   }

// //   // Update the session with focus score and duration
// //   const session = await Session.findByIdAndUpdate(
// //     sessionId,
// //     { focusScore, duration, endTime: Date.now() },
// //     { new: true }
// //   );

// //   res.status(200).json({ message: 'Session saved', session });
// // });
// router.post('/end', async (req, res) => {
//     const { sessionId, focusScore, duration, distractions, peakFocus } = req.body;
  
//     try {
//       // Check if duration is more than 1 minute (60 seconds)
//       if (duration < 60) {
//         await Session.findByIdAndDelete(sessionId); // Delete the session if duration is less than 1 minute
//         return res.status(200).json({ message: 'Session discarded (duration < 1 minute)' });
//       }
  
//       // Update the session with focus score, duration, distractions, peak focus, and end time
//       const session = await Session.findByIdAndUpdate(
//         sessionId,
//         { 
//           focusScore, 
//           duration, 
//           distractions, 
//           peakFocus, 
//           endTime: Date.now() 
//         },
//         { new: true } // Return the updated session
//       );
  
//       // Check if the session was found and updated
//       if (!session) {
//         return res.status(404).json({ message: 'Session not found' });
//       }
  
//       res.status(200).json({ message: 'Session saved', session });
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });

// // Get all sessions for a user
// router.get('/user/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const sessions = await Session.find({ userId }).sort({ startTime: -1 });
//   res.status(200).json(sessions);
// });

// module.exports = router; // Export the router


const express = require('express');
const router = express.Router();
const FocusSession = require('../models/FocusSession');

// Create a new focus session
router.post('/', async (req, res) => {
  try {
    const { duration, peakFocus, distractions, alerts } = req.body;

    // Validate minimum duration requirement
    if (duration < 60) {
      return res.status(400).json({
        error: 'Session duration must be at least 1 minute'
      });
    }

    const session = new FocusSession({
      userId: req.userId, // From auth middleware
      duration,
      peakFocus,
      distractions,
      alerts: alerts.map(alert => ({ type: alert })),
      startTime: new Date(Date.now() - duration * 1000),
      endTime: new Date()
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all sessions for the current user
router.get('/', async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userId: req.userId })
      .sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's session statistics
router.get('/stats', async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userId: req.userId });
    
    const stats = {
      totalSessions: sessions.length,
      totalDuration: sessions.reduce((acc, session) => acc + session.duration, 0),
      averageFocus: sessions.reduce((acc, session) => acc + session.peakFocus, 0) / sessions.length || 0,
      totalDistractions: sessions.reduce((acc, session) => acc + session.distractions, 0),
      bestSession: await FocusSession.findOne({ userId: req.userId })
        .sort({ peakFocus: -1 })
        .limit(1)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sessions by date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const sessions = await FocusSession.find({
      userId: req.userId,
      startTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ startTime: -1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a session
router.delete('/:sessionId', async (req, res) => {
  try {
    const session = await FocusSession.findOneAndDelete({
      _id: req.params.sessionId,
      userId: req.userId
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;