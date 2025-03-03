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