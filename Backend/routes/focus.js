// const express = require('express');
// const router = express.Router();
// const { insertFocusData, getUserFocusData, getSessionFocusData } = require('../arango');

// // POST - Store focus tracking data
// router.post('/', async (req, res) => {
//   try {
//     const { session_id, focus_score, distraction_count, attention_span, is_final_record } = req.body;
    
//     // Validate required fields
//     if (!session_id || focus_score === undefined) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }
    
//     // Create focus data object
//     const focusData = {
//       _key: `focus_${Date.now()}`,
//       session_id,
//       user_id: req.userId,
//       timestamp: new Date().toISOString(),
//       focus_score: parseInt(focus_score),
//       distraction_count: distraction_count || 0,
//       attention_span: attention_span || 0,
//       is_final_record: is_final_record || false
//     };
    
//     // Insert into ArangoDB
//     const result = await insertFocusData(focusData);
    
//     res.status(201).json({ 
//       message: 'Focus data stored successfully', 
//       data: result 
//     });
//   } catch (error) {
//     console.error('Error storing focus data:', error);
//     res.status(500).json({ error: 'Failed to store focus data' });
//   }
// });

// // GET - Retrieve user's focus data
// router.get('/user', async (req, res) => {
//   try {
//     const focusData = await getUserFocusData(req.userId);
//     res.json(focusData);
//   } catch (error) {
//     console.error('Error retrieving focus data:', error);
//     res.status(500).json({ error: 'Failed to retrieve focus data' });
//   }
// });

// // GET - Retrieve focus data for a specific session
// router.get('/session/:sessionId', async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;
//     const focusData = await getSessionFocusData(sessionId);
//     res.json(focusData);
//   } catch (error) {
//     console.error('Error retrieving session focus data:', error);
//     res.status(500).json({ error: 'Failed to retrieve session focus data' });
//   }
// });

// module.exports = router;

// // routes/focusRoutes.js
// const express = require('express');
// const router = express.Router();
// const FocusService = require('../services/FocusService');

// // POST endpoint to receive focus data
// router.post('/focus-data', async (req, res) => {
//   try {
//     const userId = req.body.user_id || 'user_1'; // Get from auth in production
//     const result = await FocusService.processFocusData(userId, req.body);
//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     console.error('API Error:', error);
//     res.status(500).json({ success: false, message: 'Error processing focus data' });
//   }
// });

// // GET endpoint to retrieve user's focus data
// router.get('/focus-data/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const data = await FocusService.getUserFocusData(userId);
//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     console.error('API Error:', error);
//     res.status(500).json({ success: false, message: 'Error retrieving focus data' });
//   }
// });

// // Add this to your focusRoutes.js
// router.get('/test-focus', async (req, res) => {
//     try {
//       const { insertFocusData } = require('../arango');
//       const testData = {
//         _key: `focus_test_${Date.now()}`,
//         session_id: 'test_session',
//         user_id: 'test_user',
//         timestamp: new Date().toISOString(),
//         focus_score: 85,
//         distraction_count: 2,
//         attention_span: 25,
//         is_final_record: true
//       };
      
//       const result = await insertFocusData(testData);
//       res.status(200).json({ 
//         success: true, 
//         message: 'Test focus data added successfully',
//         data: result 
//       });
//     } catch (error) {
//       console.error('Test API Error:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Error adding test focus data',
//         error: error.message
//       });
//     }
//   });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { insertFocusData, getUserFocusData, getSessionFocusData } = require('../arango');
const authMiddleware = require('../middleware/auth'); // Import auth middleware
const mongoose = require('mongoose');

// POST endpoint to receive focus data
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { session_id, focus_score, distraction_count, attention_span, is_final_record } = req.body;
    const user_Id = req.userId; // Get user ID from auth middleware
    
    // Validate required fields
    if (!session_id || !focus_score || !user_Id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: session_id, focus_score, or user_id' 
      });
    }

    // Prepare focus data
    const focusData = {
      session_id,
      timestamp: new Date().toISOString(),
      focus_score: parseInt(focus_score),
      distraction_count: parseInt(distraction_count || 0),
      attention_span: parseFloat(attention_span || 0),
      user_Id,
      is_final_record: is_final_record || false,
    };

    // Insert focus data into ArangoDB
    const result = await insertFocusData(focusData);
    res.status(201).json({ 
      success: true, 
      message: 'Focus data saved successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error saving focus data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save focus data', 
      error: error.message 
    });
  }
});

// GET endpoint to retrieve user's focus data
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Fetch focus data from ArangoDB
    const data = await getUserFocusData(userId);
    res.status(200).json({ 
      success: true, 
      message: 'Focus data retrieved successfully', 
      data 
    });
  } catch (error) {
    console.error('Error retrieving focus data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve focus data', 
      error: error.message 
    });
  }
});

// GET endpoint to retrieve focus data for a specific session
router.get('/session/:sessionId', authMiddleware, async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // Validate session ID
    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID is required' 
      });
    }

    // Fetch session focus data from ArangoDB
    const data = await getSessionFocusData(sessionId);
    res.status(200).json({ 
      success: true, 
      message: 'Session focus data retrieved successfully', 
      data 
    });
  } catch (error) {
    console.error('Error retrieving session focus data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve session focus data', 
      error: error.message 
    });
  }
});

// Test endpoint to insert focus data (for debugging purposes)
router.post('/test-focus', async (req, res) => {
  try {
    const testData = {
      _key: `focus_test_${Date.now()}`,
      session_id: 'test_session',
      user_Id: 'test_user',
      timestamp: new Date().toISOString(),
      focus_score: 85,
      distraction_count: 2,
      attention_span: 25,
      is_final_record: true
    };

    // Insert test data into ArangoDB
    const result = await insertFocusData(testData);
    res.status(200).json({ 
      success: true, 
      message: 'Test focus data added successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error adding test focus data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add test focus data', 
      error: error.message 
    });
  }
});

module.exports = router;