import React, { useState, useEffect } from 'react';
import { getSuggestedSchedule } from '../../Pages/focusTrackingAPI';

const StudyScheduleRecommendation = ({ userId }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await getSuggestedSchedule(userId);
        setSchedule(response.suggested_schedule || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Failed to load your recommended schedule. Please try again later.');
        setLoading(false);
      }
    };

    if (userId) {
      fetchSchedule();
    }
  }, [userId]);

  // Order days of week properly
  const orderDays = (scheduleData) => {
    const dayOrder = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
      'Sunday': 7
    };
    
    return [...scheduleData].sort((a, b) => dayOrder[a.day] - dayOrder[b.day]);
  };

  const getDayColor = (day) => {
    const colors = {
      'Monday': 'bg-blue-100',
      'Tuesday': 'bg-green-100',
      'Wednesday': 'bg-yellow-100',
      'Thursday': 'bg-purple-100',
      'Friday': 'bg-pink-100',
      'Saturday': 'bg-indigo-100',
      'Sunday': 'bg-orange-100'
    };
    
    return colors[day] || 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Optimized Study Schedule</h2>
        <div className="flex justify-center">
          <p>Loading your personalized schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Optimized Study Schedule</h2>
        <div className="bg-red-100 p-3 rounded-md text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const orderedSchedule = orderDays(schedule);

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto mt- 3">
      <h2 className="text-xl font-semibold mb-4">Optimized Study Schedule</h2>
      <p className="text-gray-600 mb-4">
        Based on your past focus sessions, we recommend the following study schedule:
      </p>
      
      {orderedSchedule.length === 0 ? (
        <p className="text-gray-500 italic">
          No schedule data available yet. Complete more focus sessions to get personalized recommendations.
        </p>
      ) : (
        <div className="space-y-3">
          {orderedSchedule.map((item, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-md ${getDayColor(item.day)} flex justify-between items-center`}
            >
              <div>
                <span className="font-medium">{item.day}</span>
                <p className="text-sm text-gray-700">{item.time} • {item.topic}</p>
              </div>
              {item.focus_score && (
                <div className="flex items-center bg-white bg-opacity-60 px-2 py-1 rounded">
                  <span className="text-xs font-medium">
                    Focus Score: {Math.round(item.focus_score)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          This schedule is optimized based on times when your focus was highest.
        </p>
      </div>
    </div>
  );
};

export default StudyScheduleRecommendation;