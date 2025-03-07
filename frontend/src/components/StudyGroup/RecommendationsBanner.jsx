// Recommendations Banner Component
import React from 'react';
import { Brain } from 'lucide-react';

const RecommendationsBanner = () => {
  return (
    <div className="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100">
      <div className="flex items-start">
        <Brain className="h-6 w-6 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-indigo-800">AI-Powered Group Matching</h3>
          <p className="text-sm text-indigo-700">
            Based on your study patterns, knowledge graph, and learning goals, we've identified 
            these study groups that would complement your educational journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsBanner;