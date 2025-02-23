import React from 'react';

const SessionStats = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold mb-4">Session Stats</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Duration</span>
          <span className="font-medium">{stats.duration}</span>
        </div>
        <div className="flex justify-between">
          <span>Distractions</span>
          <span className="font-medium">{stats.distractions}</span>
        </div>
        <div className="flex justify-between">
          <span>Peak Focus</span>
          <span className="font-medium">{Math.round(stats.peakFocus)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;