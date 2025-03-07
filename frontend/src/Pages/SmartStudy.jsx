import React, { useState, useEffect } from 'react';
import { Search, Book, Brain, Clock, Bookmark, ArrowRight, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService'; // Import auth service like in Dashboard

// Create API instance with interceptor
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to all requests automatically
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const SmartStudyRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [relatedTopics, setRelatedTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  
  // Make sure we always have the latest user data
  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  // Fetch recommendations from the backend
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        console.log('Fetching recommendations for user:', currentUser?.id || 'default');
        
        // Use the api instance with interceptor instead of axios directly
        const response = await api.get('/api/tasks/recommendations');
        
        console.log('Received data:', response.data);
        
        if (Array.isArray(response.data)) {
          setRecommendations(response.data);
          
          // Extract all unique topics from recommendations
          const topics = [...new Set(response.data.flatMap(rec => 
            rec.relatedConcepts ? [...rec.relatedConcepts, rec.topic] : [rec.topic]
          ))];
          
          // Fetch related concepts for each topic
          await fetchRelatedTopicsForAll(topics);
        } else {
          console.warn('Received non-array response:', response.data);
          setRecommendations([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error details:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Failed to load recommendations';
        console.error('Error fetching recommendations:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchRecommendations();
    } else {
      setError('User not authenticated. Please log in.');
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch related topics for a list of topics
  const fetchRelatedTopicsForAll = async (topics) => {
    const topicsData = {};
    
    for (const topic of topics) {
      try {
        // Use the api instance with interceptor
        const response = await api.get(`/api/graph/related-concepts/${encodeURIComponent(topic)}`);
        
        if (response.data && response.data.relatedConcepts) {
          topicsData[topic] = response.data.relatedConcepts;
        }
      } catch (err) {
        console.warn(`Could not fetch related topics for "${topic}":`, err.message);
        // Still add the topic to avoid repeated failed requests
        topicsData[topic] = [];
      }
    }
    
    setRelatedTopics(topicsData);
  };

  // Filter recommendations based on search query
  const filteredRecommendations = recommendations.filter(rec => 
    rec.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (rec.relatedConcepts && rec.relatedConcepts.some(concept => 
      concept.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  // Handle topic selection for detailed view
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic === selectedTopic ? null : topic);
  };

  // Generate a color based on a string (for consistent topic colors)
  const getTopicColor = (topic) => {
    const colors = [
      'bg-blue-50 text-blue-700',
      'bg-green-50 text-green-700',
      'bg-purple-50 text-purple-700',
      'bg-yellow-50 text-yellow-700',
      'bg-red-50 text-red-700',
      'bg-indigo-50 text-indigo-700',
      'bg-pink-50 text-pink-700'
    ];
    
    // Simple hash function to get consistent colors
    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
      hash = topic.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smart Study Recommendations</h1>
        <p className="text-gray-600">Personalized learning suggestions based on your study patterns and topic relationships</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search topics, concepts, or descriptions..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading personalized recommendations...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-6 bg-red-50 rounded-lg mb-8">
          <Brain className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-gray-600 mt-2">Please make sure you're logged in and try again</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-white text-gray-800 rounded-md flex items-center mx-auto border"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      )}

      {/* Selected Topic Detail View */}
      {selectedTopic && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{selectedTopic}</h2>
            <button 
              onClick={() => setSelectedTopic(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {relatedTopics[selectedTopic] && relatedTopics[selectedTopic].length > 0 ? (
                relatedTopics[selectedTopic].map((topic, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm ${getTopicColor(topic)}`}
                  >
                    {topic}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No related topics found</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Recommended Learning Path</h3>
            <div className="space-y-2">
              {relatedTopics[selectedTopic] && relatedTopics[selectedTopic].length > 0 ? (
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded">
                      {selectedTopic}
                    </div>
                    <ArrowRight className="mx-2 text-gray-400" />
                    <div className="bg-green-100 text-green-800 p-2 rounded">
                      {relatedTopics[selectedTopic][0]}
                    </div>
                    {relatedTopics[selectedTopic].length > 1 && (
                      <>
                        <ArrowRight className="mx-2 text-gray-400" />
                        <div className="bg-purple-100 text-purple-800 p-2 rounded">
                          {relatedTopics[selectedTopic][1]}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No learning path available yet</p>
              )}
            </div>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center">
            <Book className="h-4 w-4 mr-2" />
            Create Study Plan for {selectedTopic}
          </button>
        </div>
      )}

      {/* Recommendations Grid */}
      {!loading && !error && filteredRecommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((rec, index) => (
            <div 
              key={`${rec.topic}-${index}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              {/* Card Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{rec.topic}</h2>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {rec.confidence}% Match
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Time Estimate */}
                <div className="flex items-center mb-3 text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{rec.timeEstimate}</span>
                </div>

                {/* Description */}
                <p className="mb-4 text-gray-700">{rec.description}</p>

                {/* Related Concepts */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Related Concepts:</h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.relatedConcepts && rec.relatedConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-full text-sm ${getTopicColor(concept)}`}
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Knowledge Graph Indicator */}
                {relatedTopics[rec.topic] && relatedTopics[rec.topic].length > 0 && (
                  <div className="mb-4 p-2 bg-blue-50 rounded flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      {relatedTopics[rec.topic].length} connected topics in knowledge graph
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <Book className="h-4 w-4 mr-1" />
                    Start Learning
                  </button>
                  <button 
                    className="flex items-center text-gray-600 hover:text-gray-800"
                    onClick={() => handleTopicSelect(rec.topic)}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    Explore Graph
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600">
            Complete more study sessions to get personalized recommendations
          </p>
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center mx-auto">
            <Bookmark className="h-4 w-4 mr-2" />
            Add Study Topics
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartStudyRecommendations;