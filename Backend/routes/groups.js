// // routes/groups.js
// // const express = require('express');
// const { createStudyGroup, getRecommendedGroups } = require('../arango');

// // Create a new study group
// router.post('/', async (req, res) => {
//   try {
//     // Get user ID from session/auth
//     const userId = req.user?.id || 'users/anonymous';
    
//     const groupData = {
//       ...req.body,
//       createdBy: userId,
//       members: [userId] // Creator is automatically a member
//     };
    
//     const result = await createStudyGroup(groupData);
//     res.status(201).json(result);
//   } catch (error) {
//     console.error('API error creating group:', error);
//     res.status(500).json({ error: 'Failed to create group' });
//   }
// });

// // Get all groups (with optional filters)
// router.get('/', async (req, res) => {
//   try {
//     // Implement general group listing logic here
//     // This is a placeholder - implement according to your needs
//     res.status(200).json({ message: "Group listing not implemented yet" });
//   } catch (error) {
//     console.error('API error fetching groups:', error);
//     res.status(500).json({ error: 'Failed to fetch groups' });
//   }
// });

// // Get recommended groups for current user
// router.get('/recommended', async (req, res) => {
//   try {
//     // Get user ID from session/auth
//     const userId = req.user?.id || 'users/anonymous';
//     const limit = parseInt(req.query.limit) || 5;
    
//     const groups = await getRecommendedGroups(userId, limit);
//     res.status(200).json(groups);
//   } catch (error) {
//     console.error('API error fetching recommended groups:', error);
//     res.status(500).json({ error: 'Failed to fetch recommended groups' });
//   }
// });

// // Get a specific group by ID
// router.get('/:id', async (req, res) => {
//   // Implement get single group logic
//   res.status(200).json({ message: "Get single group not implemented yet" });
// });

// // Join a group
// router.post('/:id/join', async (req, res) => {
//   try {
//     // Get user ID from session/auth
//     const userId = req.user?.id || 'users/anonymous';
//     const groupId = req.params.id;
    
//     await addMembersToGroup(groupId, [userId]);
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error('API error joining group:', error);
//     res.status(500).json({ error: 'Failed to join group' });
//   }
// });

// module.exports = router;

// // routes/study.js
// const express = require('express');
// const router = express.Router();
// const { trackUserStudyTopic } = require('../lib/arango');

// // Track user study activity
// router.post('/track', async (req, res) => {
//   try {
//     const { topic } = req.body;
//     const userId = req.user?.id || 'users/anonymous';
    
//     if (!topic) {
//       return res.status(400).json({ error: 'Topic is required' });
//     }
    
//     await trackUserStudyTopic(userId, topic);
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error('API error tracking study topic:', error);
//     res.status(500).json({ error: 'Failed to track study topic' });
//   }
// });

// module.exports = router;



// routes/groups.js
const express = require('express');
const router = express.Router();
const { createStudyGroup, getRecommendedGroups, addMembersToGroup } = require('../arango');

// Create a new study group
router.post('/', async (req, res) => {
  try {
    // Get user ID from session/auth
    const userId = req.user?.id || 'users/anonymous';
    
    const groupData = {
      ...req.body,
      createdBy: userId,
      members: [userId] // Creator is automatically a member
    };
    
    const result = await createStudyGroup(groupData);
    res.status(201).json(result);
  } catch (error) {
    console.error('API error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get all groups (with optional filters)
router.get('/', async (req, res) => {
  try {
    // Implement general group listing logic here
    // This is a placeholder - implement according to your needs
    res.status(200).json({ message: "Group listing not implemented yet" });
  } catch (error) {
    console.error('API error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get recommended groups for current user
router.get('/recommended', async (req, res) => {
  try {
    // Get user ID from session/auth
    const userId = req.user?.id || 'users/anonymous';
    const limit = parseInt(req.query.limit) || 5;
    
    const groups = await getRecommendedGroups(userId, limit);
    res.status(200).json(groups);
  } catch (error) {
    console.error('API error fetching recommended groups:', error);
    res.status(500).json({ error: 'Failed to fetch recommended groups' });
  }
});

// Get a specific group by ID
router.get('/:id', async (req, res) => {
  // Implement get single group logic
  res.status(200).json({ message: "Get single group not implemented yet" });
});

// Join a group
router.post('/:id/join', async (req, res) => {
  try {
    // Get user ID from session/auth
    const userId = req.user?.id || 'users/anonymous';
    const groupId = req.params.id;
    
    await addMembersToGroup(groupId, [userId]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('API error joining group:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

module.exports = router;