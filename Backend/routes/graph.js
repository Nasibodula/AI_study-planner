// // const express = require('express');
// // const router = express.Router();
// // const { getRelatedConcepts } = require('../arango');

// // // Get related concepts for a specific topic
// // router.get('/related-concepts/:topic', async (req, res) => {
// //   try {
// //     const { topic } = req.params;
    
// //     if (!topic) {
// //       return res.status(400).json({ error: 'Topic parameter is required' });
// //     }
    
// //     console.log(`API request for related concepts: ${topic}`);
// //     const relatedConcepts = await getRelatedConcepts(topic);
    
// //     return res.json(relatedConcepts);
// //   } catch (error) {
// //     console.error('Error fetching related concepts:', error);
// //     return res.status(500).json({ 
// //       error: 'Failed to fetch related concepts',
// //       details: error.message 
// //     });
// //   }
// // });

// // // Get recommendations based on a list of topics
// // router.post('/recommendations', async (req, res) => {
// //   try {
// //     const { topics } = req.body;
    
// //     if (!Array.isArray(topics) || topics.length === 0) {
// //       return res.status(400).json({ error: 'Topics array is required' });
// //     }
    
// //     const { getRecommendations } = require('../arango');
// //     const recommendations = await getRecommendations(topics);
    
// //     return res.json(recommendations);
// //   } catch (error) {
// //     console.error('Error generating recommendations:', error);
// //     return res.status(500).json({ 
// //       error: 'Failed to generate recommendations',
// //       details: error.message 
// //     });
// //   }
// // });

// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { getRelatedConcepts, getRecommendations } = require('../arango'); // Import all functions at once

// // Get related concepts for a specific topic
// router.get('/related-concepts/:topic', async (req, res) => {
//   const { topic } = req.params;

//   // Validate the topic parameter
//   if (!topic || typeof topic !== 'string') {
//     return res.status(400).json({ 
//       error: 'Topic parameter is required and must be a string' 
//     });
//   }

//   try {
//     console.log(`API request for related concepts: ${topic}`);
//     const relatedConcepts = await getRelatedConcepts(topic);

//     // If no related concepts are found, return a 404
//     if (relatedConcepts.length === 0) {
//       return res.status(404).json({ 
//         message: 'No related concepts found for the given topic' 
//       });
//     }

//     return res.json(relatedConcepts);
//   } catch (error) {
//     console.error('Error fetching related concepts:', error);
//     return res.status(500).json({ 
//       error: 'Failed to fetch related concepts',
//       details: error.message 
//     });
//   }
// });

// // Get recommendations based on a list of topics
// router.post('/recommendations', async (req, res) => {
//   const { topics } = req.body;

//   // Validate the topics array
//   if (!Array.isArray(topics) || topics.length === 0) {
//     return res.status(400).json({ 
//       error: 'Topics array is required and must contain at least one topic' 
//     });
//   }

//   try {
//     console.log('API request for recommendations with topics:', topics);
//     const recommendations = await getRecommendations(topics);

//     // If no recommendations are found, return a 404
//     if (recommendations.length === 0) {
//       return res.status(404).json({ 
//         message: 'No recommendations found for the given topics' 
//       });
//     }

//     return res.json(recommendations);
//   } catch (error) {
//     console.error('Error generating recommendations:', error);
//     return res.status(500).json({ 
//       error: 'Failed to generate recommendations',
//       details: error.message 
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { getRelatedConcepts, getRecommendations } = require('../arango');

// Get related concepts for a specific topic
router.get('/related-concepts/:topic', async (req, res) => {
  const { topic } = req.params;
  
  // Validate the topic parameter
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ 
      error: 'Topic parameter is required and must be a string' 
    });
  }
  
  try {
    console.log(`API request for related concepts: ${topic}`);
    const relatedConcepts = await getRelatedConcepts(topic);
    
    return res.json({ 
      topic: topic, 
      relatedConcepts: relatedConcepts 
    });
  } catch (error) {
    console.error('Error fetching related concepts:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch related concepts', 
      details: error.message 
    });
  }
});

// Get recommendations based on a list of topics
router.post('/recommendations', async (req, res) => {
  const { topics } = req.body;
  
  // Validate the topics array with more lenient fallback
  if (!req.body || !topics) {
    console.log('No topics provided, using default recommendations');
    try {
      const recommendations = await getRecommendations([]);
      return res.json(recommendations);
    } catch (error) {
      console.error('Error generating default recommendations:', error);
      return res.status(500).json({ 
        error: 'Failed to generate recommendations', 
        details: error.message 
      });
    }
  }
  
  // Ensure topics is an array
  const topicsArray = Array.isArray(topics) ? topics : [topics];
  
  try {
    console.log('API request for recommendations with topics:', topicsArray);
    const recommendations = await getRecommendations(topicsArray);
    return res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({ 
      error: 'Failed to generate recommendations', 
      details: error.message 
    });
  }
});

module.exports = router;