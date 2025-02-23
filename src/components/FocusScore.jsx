import React from 'react';

const FocusScore = ({ score }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center">
        <div className="text-6xl font-bold text-blue-600">{score}%</div>
        <div className="mt-2 text-gray-500">Focus Score</div>
        <div className="mt-4 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FocusScore;