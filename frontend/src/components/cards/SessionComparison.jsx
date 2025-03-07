import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, ArrowLeftRight } from 'lucide-react';
import { getFocusSessions } from '../../Pages/focusTrackingAPI';

const SessionComparisonCard = ({ userId }) => {
  const [focusData, setFocusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('timeOfDay');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sessions = await getFocusSessions(userId);
        
        if (sessions && sessions.length > 0) {
          // Process the session data
          const processedData = processSessionData(sessions);
          setFocusData(processedData);
        } else {
          setError('No session data available');
        }
      } catch (err) {
        setError(`Error fetching session data: ${err.message}`);
        console.error('Error fetching focus sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const processSessionData = (sessions) => {
    // Time of day comparison (Morning vs Afternoon)
    const morningData = sessions.filter(session => {
      const startHour = new Date(session.start_time).getHours();
      return startHour >= 5 && startHour < 12;
    });
    
    const afternoonData = sessions.filter(session => {
      const startHour = new Date(session.start_time).getHours();
      return startHour >= 12 && startHour < 18;
    });

    // Day of week comparison (Weekday vs Weekend)
    const weekdayData = sessions.filter(session => {
      const day = new Date(session.start_time).getDay();
      return day >= 1 && day <= 5; // Monday to Friday
    });
    
    const weekendData = sessions.filter(session => {
      const day = new Date(session.start_time).getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    });

    // Session length comparison (Short vs Long)
    const shortData = sessions.filter(session => {
      const startTime = new Date(session.start_time);
      const endTime = new Date(session.end_time);
      const durationMinutes = (endTime - startTime) / (1000 * 60);
      return durationMinutes < 60;
    });
    
    const longData = sessions.filter(session => {
      const startTime = new Date(session.start_time);
      const endTime = new Date(session.end_time);
      const durationMinutes = (endTime - startTime) / (1000 * 60);
      return durationMinutes >= 60;
    });

    // Calculate averages
    const calculateAvg = (data, field) => {
      if (!data.length) return 0;
      return data.reduce((sum, session) => sum + session[field], 0) / data.length;
    };

    const timeOfDayData = [
      { name: 'Morning', focusScore: calculateAvg(morningData, 'focus_score'), focusPercent: calculateAvg(morningData, 'focused_time') / calculateAvg(morningData, 'total_time') * 100, sessions: morningData.length },
      { name: 'Afternoon', focusScore: calculateAvg(afternoonData, 'focus_score'), focusPercent: calculateAvg(afternoonData, 'focused_time') / calculateAvg(afternoonData, 'total_time') * 100, sessions: afternoonData.length }
    ];

    const dayTypeData = [
      { name: 'Weekday', focusScore: calculateAvg(weekdayData, 'focus_score'), focusPercent: calculateAvg(weekdayData, 'focused_time') / calculateAvg(weekdayData, 'total_time') * 100, sessions: weekdayData.length },
      { name: 'Weekend', focusScore: calculateAvg(weekendData, 'focus_score'), focusPercent: calculateAvg(weekendData, 'focused_time') / calculateAvg(weekendData, 'total_time') * 100, sessions: weekendData.length }
    ];

    const durationData = [
      { name: 'Short (<60min)', focusScore: calculateAvg(shortData, 'focus_score'), focusPercent: calculateAvg(shortData, 'focused_time') / calculateAvg(shortData, 'total_time') * 100, sessions: shortData.length },
      { name: 'Long (≥60min)', focusScore: calculateAvg(longData, 'focus_score'), focusPercent: calculateAvg(longData, 'focused_time') / calculateAvg(longData, 'total_time') * 100, sessions: longData.length }
    ];

    return {
      timeOfDayData,
      dayTypeData,
      durationData
    };
  };

  const renderBarChart = (data) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 100]} />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 100]} />
          <Tooltip formatter={(value) => value.toFixed(1)} />
          <Legend />
          <Bar yAxisId="left" dataKey="focusScore" name="Focus Score" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="focusPercent" name="Focus %" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md w-full h-80">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading session data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md w-full h-80">
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!focusData) {
    return (
      <div className="bg-white rounded-lg shadow-md w-full h-80">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No session data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Session Comparison Analysis</h3>
      </div>
      
      <div className="p-4">
        {/* Custom Tabs */}
        <div className="flex w-full border border-gray-200 rounded-md mb-4">
          <button 
            onClick={() => setActiveTab('timeOfDay')}
            className={`flex items-center justify-center flex-1 py-2 px-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'timeOfDay' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Clock size={16} className="mr-2" />
            Morning vs Afternoon
          </button>
          
          <button 
            onClick={() => setActiveTab('dayType')}
            className={`flex items-center justify-center flex-1 py-2 px-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'dayType' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar size={16} className="mr-2" />
            Weekday vs Weekend
          </button>
          
          <button 
            onClick={() => setActiveTab('duration')}
            className={`flex items-center justify-center flex-1 py-2 px-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'duration' 
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ArrowLeftRight size={16} className="mr-2" />
            Short vs Long Sessions
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'timeOfDay' && (
            <div>
              <div className="text-sm text-center mb-2 text-gray-600">
                Compare your focus performance during morning and afternoon sessions
              </div>
              {renderBarChart(focusData.timeOfDayData)}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {focusData.timeOfDayData.map(item => (
                  <div key={item.name} className="text-sm text-center bg-gray-50 p-3 rounded-md">
                    <div className="font-semibold text-gray-700">{item.name}</div>
                    <div className="text-gray-600">{item.sessions} sessions</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'dayType' && (
            <div>
              <div className="text-sm text-center mb-2 text-gray-600">
                Compare your productivity on weekdays versus weekends
              </div>
              {renderBarChart(focusData.dayTypeData)}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {focusData.dayTypeData.map(item => (
                  <div key={item.name} className="text-sm text-center bg-gray-50 p-3 rounded-md">
                    <div className="font-semibold text-gray-700">{item.name}</div>
                    <div className="text-gray-600">{item.sessions} sessions</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'duration' && (
            <div>
              <div className="text-sm text-center mb-2 text-gray-600">
                Compare the effectiveness of short versus long study sessions
              </div>
              {renderBarChart(focusData.durationData)}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {focusData.durationData.map(item => (
                  <div key={item.name} className="text-sm text-center bg-gray-50 p-3 rounded-md">
                    <div className="font-semibold text-gray-700">{item.name}</div>
                    <div className="text-gray-600">{item.sessions} sessions</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionComparisonCard;