// Header Component
import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({ onCreateGroupClick }) => {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Study Groups</h1>
            <p className="text-gray-600 mt-1">Connect, collaborate, and learn together</p>
          </div>
          <button 
            onClick={onCreateGroupClick}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;