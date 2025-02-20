import React, { useState } from 'react';
import { Search, Book, Brain, Clock, ArrowRight } from 'lucide-react';

const SmartStudyRecommendations = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Sample data - in a real app this would come from your GraphRAG backend
  const recommendations = [
    {
      id: 1,
      topic: "Linear Algebra",
      confidence: 85,
      timeEstimate: "2 hours",
      relatedConcepts: ["Matrices", "Vectors", "Eigenvalues"],
      description: "Based on your recent focus on calculus, we recommend strengthening your linear algebra foundation."
    },
    {
      id: 2,
      topic: "Organic Chemistry",
      confidence: 92,
      timeEstimate: "1.5 hours",
      relatedConcepts: ["Alkenes", "Reaction Mechanisms", "Stereochemistry"],
      description: "Your upcoming exam topics suggest reviewing organic chemistry concepts."
    },
    {
      id: 3,
      topic: "Python Programming",
      confidence: 78,
      timeEstimate: "3 hours",
      relatedConcepts: ["Data Structures", "Algorithms", "Object-Oriented Programming"],
      description: "To complement your current coursework, we suggest reviewing Python fundamentals."
    }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Smart Study Recommendations</h1>
        <p className="text-gray-600">Personalized learning suggestions based on your study patterns</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
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
                  {rec.relatedConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4">
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                  <Book className="h-4 w-4 mr-1" />
                  Start Learning
                </button>
                <button className="flex items-center text-gray-600 hover:text-gray-800">
                  <Brain className="h-4 w-4 mr-1" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600">
            Complete more study sessions to get personalized recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartStudyRecommendations;