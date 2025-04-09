const { Database, aql } = require('arangojs');

// Initialize the database connection
const db = new Database({
  url: 'https://df22fe32aaa0.arangodb.cloud:8529',
  databaseName: '_system',
  auth: { username: 'root', password: 'H0FSL0121g5K9mlOYyXf' },
});

// Test the connection
async function testConnection() {
  try {
    const info = await db.version();
    console.log('Connected to ArangoDB:', info);
    return info;
  } catch (err) {
    console.error('Connection failed:', err);
    throw err;
  }
}

// Update the getRelatedConcepts function
async function getRelatedConcepts(topic) {
  try {
    console.log(`Fetching related concepts for: ${topic}`);
    
    // Check if edges collection exists and is of edge type
    const collections = await db.listCollections();
    const edgeCollection = collections.find(c => c.name === 'edges');
    
    if (!edgeCollection || edgeCollection.type !== 3) { // type 3 is for edge collections
      console.log('Edge collection not properly configured, using fallback');
      // Return fallback data when collection isn't properly configured
      return [`Basic ${topic}`, `Advanced ${topic}`, "Related Principles"];
    }
    
    const query = `
      FOR t IN topics
        FILTER LOWER(t.name) == LOWER(@topicName)
        LET related = (
          FOR related, edge IN 1..2 OUTBOUND t edges
            RETURN related.name
        )
        RETURN {
          topic: t.name,
          relatedConcepts: related
        }
    `;
    
    const bindVars = { topicName: topic };
    const cursor = await db.query(query, bindVars);
    const result = await cursor.all();
    
    if (result.length > 0) {
      console.log(`Found ${result[0].relatedConcepts.length} related concepts for ${topic}`);
      return result[0].relatedConcepts;
    }
    
    console.log(`No related concepts found for ${topic}`);
    return [`Basic ${topic}`, `Advanced ${topic}`, "Key Concepts"];
  } catch (err) {
    console.error(`Error fetching related concepts for ${topic}:`, err);
    return [`Basic ${topic}`, `Advanced ${topic}`, "Fundamental Principles"];
  }
}

async function getRecommendations(userStudyTopics) {
  try {
    console.log('Fetching recommendations for topics:', userStudyTopics);
    
    // If userStudyTopics is empty, return mock data for testing
    if (!userStudyTopics || userStudyTopics.length === 0) {
      console.log('No study topics found, returning default recommendations');
      return [
        {
          topic: "Study Fundamentals",
          confidence: 90,
          timeEstimate: "1-2 hours",
          relatedConcepts: ["Time Management", "Note Taking", "Focus Techniques"],
          description: "Get started with effective study habits and core techniques."
        },
        {
          topic: "General Knowledge",
          confidence: 75,
          timeEstimate: "2-3 hours",
          relatedConcepts: ["Basic Concepts", "Foundational Ideas"],
          description: "Build your knowledge foundation with these general topics."
        }
      ];
    }
    
    // Process each topic to find meaningful tokens
    const processedTopics = userStudyTopics.flatMap(topic => {
      // Extract keywords from topic titles/descriptions
      const words = topic.split(/\s+/).filter(word => 
        word.length > 3 && !['and', 'the', 'for', 'with'].includes(word.toLowerCase())
      );
      return words;
    });
    
    const uniqueProcessedTopics = [...new Set(processedTopics)];
    console.log('Processed topics for ArangoDB lookup:', uniqueProcessedTopics);
    
    try {
      // First get base recommendations
      const query = `
        FOR topic IN topics
          FILTER topic.name IN @userTopics OR 
                LENGTH(
                  FOR t IN @processedTopics
                    FILTER CONTAINS(LOWER(topic.name), LOWER(t))
                    RETURN 1
                ) > 0
          SORT RAND()
          LIMIT 6
          RETURN {
            topic: topic.name,
            confidence: RAND() * 30 + 70,
            timeEstimate: "2-3 hours",
            description: CONCAT("Based on your previous studies, we recommend ", topic.name, ".")
          }
      `;
      
      const bindVars = { 
        userTopics: userStudyTopics,
        processedTopics: uniqueProcessedTopics
      };
      
      const cursor = await db.query(query, bindVars);
      let recommendations = await cursor.all();
      
      console.log('Found base recommendations from ArangoDB:', recommendations.length);
      
      // If no recommendations from the query, return default ones based on the user topics
      if (recommendations.length === 0) {
        console.log('No matching topics in ArangoDB, returning similar topic recommendations');
        recommendations = userStudyTopics.map(topic => ({
          topic: `Advanced ${topic}`,
          confidence: Math.floor(Math.random() * 20 + 80),
          timeEstimate: "2-3 hours",
          description: `Deepen your understanding of ${topic} with advanced materials.`
        }));
      }
      
      // For each recommendation, get related concepts
      const enhancedRecommendations = await Promise.all(recommendations.map(async (rec) => {
        try {
          const relatedConcepts = await getRelatedConcepts(rec.topic);
          return {
            ...rec,
            relatedConcepts: relatedConcepts.length > 0 
              ? relatedConcepts 
              : [`More on ${rec.topic}`, "Key Principles", "Practice Exercises"]
          };
        } catch (relatedErr) {
          console.error(`Error getting related concepts for ${rec.topic}:`, relatedErr);
          return {
            ...rec,
            relatedConcepts: [`More on ${rec.topic}`, "Foundational Concepts", "Applications"]
          };
        }
      }));
      
      return enhancedRecommendations;
    } catch (queryErr) {
      console.error('ArangoDB query error:', queryErr);
      console.log('Falling back to topic-based recommendations');
      
      // Fallback if query fails
      return userStudyTopics.map(topic => ({
        topic: `More on ${topic}`,
        confidence: 75,
        timeEstimate: "2-3 hours",
        relatedConcepts: ["Related Concepts", "Key Principles"],
        description: `Continue your progress with more ${topic} materials.`
      }));
    }
  } catch (err) {
    console.error('Error in getRecommendations:', err);
    // Return empty array instead of throwing to prevent API failure
    return [];
  }
}

// Add this to your arango.js file

async function setupCollections() {
  try {
    // Check if edges collection exists
    const collections = await db.collections();
    const collectionNames = collections.map(c => c.name);
    
    // Create topics collection if it doesn't exist
    if (!collectionNames.includes('topics')) {
      console.log('Creating topics collection...');
      await db.createCollection('topics');
      console.log('Topics collection created successfully');
    }
    
    // Create or replace edges collection as an edge collection
    if (collectionNames.includes('edges')) {
      console.log('Dropping existing edges collection...');
      const edgesCollection = db.collection('edges');
      await edgesCollection.drop();
    }
    
    console.log('Creating edges collection as edge type...');
    await db.createEdgeCollection('edges');
    console.log('Edges collection created successfully');
    
    return true;
  } catch (err) {
    console.error('Error setting up collections:', err);
    return false;
  }
}



module.exports = {
  db,
  aql,
  testConnection,
  getRecommendations,
  getRelatedConcepts,
  setupCollections,
};