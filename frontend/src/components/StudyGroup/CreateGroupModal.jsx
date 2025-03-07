// Create Group Modal Component
import React, { useState } from 'react';
import { X, Brain } from 'lucide-react';

const CreateGroupModal = ({ newGroup, setNewGroup, onClose, onSubmit }) => {
  const [currentTag, setCurrentTag] = useState('');

  const addTag = () => {
    if (currentTag.trim() !== '' && !newGroup.tags.includes(currentTag.trim())) {
      setNewGroup({
        ...newGroup,
        tags: [...newGroup.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewGroup({
      ...newGroup,
      tags: newGroup.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Create New Study Group</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={newGroup.name}
              onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter group name"
            />
          </div>
          
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={newGroup.subject}
              onChange={(e) => setNewGroup({...newGroup, subject: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., Mathematics, Physics, Computer Science"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newGroup.description}
              onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your study group"
              rows={3}
            />
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (helps in GraphRAG matching)
            </label>
            <div className="flex">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-blue-600 text-white rounded-r"
              >
                Add
              </button>
            </div>
            
            {/* Tag display */}
            <div className="flex flex-wrap gap-2 mt-2">
              {newGroup.tags.map((tag, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-800 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          {/* Privacy Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={newGroup.isPrivate}
              onChange={(e) => setNewGroup({...newGroup, isPrivate: e.target.checked})}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
              Private group (invitation only)
            </label>
          </div>
          
          {/* Integration Note */}
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600 flex items-start">
              <Brain className="h-4 w-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                Your group will be analyzed by GraphRAG to match with relevant students based on study patterns and knowledge graphs.
              </span>
            </p>
          </div>
          
          {/* Create Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onSubmit(newGroup)}
              disabled={!newGroup.name || !newGroup.subject}
              className={`px-4 py-2 rounded ${
                !newGroup.name || !newGroup.subject
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;