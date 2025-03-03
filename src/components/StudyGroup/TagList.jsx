// Tag List Component
import React from 'react';

const TagList = ({ tags, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, idx) => (
        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagList;