// Recommended Groups List Component
import React from 'react';
import { Users, BookOpen, Star, GitBranch, UserPlus, Info } from 'lucide-react';
import TagList from './TagList';

const RecommendedGroupsList = ({ groups }) => {
  return (
    <div className="space-y-4">
      {groups.map(group => (
        <div key={group.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
              <GitBranch className="h-3 w-3 mr-1" />
              {group.matchScore}% match
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 mb-3">
            <Users className="h-4 w-4 mr-1" />
            <span className="mr-4">{group.members} members</span>
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="mr-4">{group.subject}</span>
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span>{group.activityLevel}</span>
          </div>
          
          <div className="bg-blue-50 p-2 rounded-md mb-3">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">{group.matchReason}</p>
            </div>
          </div>
          
          <TagList tags={group.tags} className="mb-3" />
          
          <div className="flex items-center justify-end">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Join Group
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedGroupsList;