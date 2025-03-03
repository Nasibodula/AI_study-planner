// My Groups List Component
import React from 'react';
import { Users, BookOpen, Clock, Calendar, MessageCircle, Settings } from 'lucide-react';
import TagList from './TagList';

const MyGroupsList = ({ groups }) => {
  return (
    <div className="space-y-4">
      {groups.map(group => (
        <div key={group.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <div className="flex items-center mt-2 text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span className="mr-4">{group.members} members</span>
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{group.subject}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {group.unreadMessages > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {group.unreadMessages} new
                </span>
              )}
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          <TagList tags={group.tags} className="mt-3" />
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Next: {group.nextSession}</span>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </button>
              <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyGroupsList;