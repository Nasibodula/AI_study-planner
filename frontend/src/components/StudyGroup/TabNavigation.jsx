// Tab Navigation Component
import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => onTabChange('myGroups')}
        className={`px-4 py-2 rounded-lg ${
          activeTab === 'myGroups'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        My Groups
      </button>
      <button
        onClick={() => onTabChange('discover')}
        className={`px-4 py-2 rounded-lg ${
          activeTab === 'discover'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        GraphRAG Recommendations
      </button>
    </div>
  );
};

export default TabNavigation;