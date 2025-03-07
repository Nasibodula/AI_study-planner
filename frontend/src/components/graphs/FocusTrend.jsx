import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFocusSessions } from '../../Pages/focusTrackingAPI'; // Import the API function

export default function FocusTrendGraph({ userId }) {
  const [focusData, setFocusData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFocusData = async () => {
      if (!userId) {
        setError("No user ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch the focus sessions from the API
        const sessions = await getFocusSessions(userId);
        
        // Process the data for the chart
        const processedData = sessions.map(session => {
          // Convert ISO date to readable time
          const startTime = new Date(session.start_time);
          const formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          // Calculate session duration in minutes
          const endTime = new Date(session.end_time);
          const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
          
          return {
            time: formattedTime,
            date: startTime.toLocaleDateString(),
            focusScore: session.focus_score,
            duration: durationMinutes,
            topic: session.topic,
            // Include session ID for reference
            id: session.id || session.session_id
          };
        });
        
        // Sort by date and time
        processedData.sort((a, b) => {
          const dateA = new Date(a.date + ' ' + a.time);
          const dateB = new Date(b.date + ' ' + b.time);
          return dateA - dateB;
        });
        
        setFocusData(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching focus data:", error);
        setError("Failed to load focus data");
        setIsLoading(false);
      }
    };

    fetchFocusData();
  }, [userId]);

  // Function to get color based on focus score
  const getFocusColor = (score) => {
    if (score >= 90) return 'rgb(0, 0, 180)';
    if (score >= 80) return 'rgb(30, 30, 220)';
    if (score >= 70) return 'rgb(60, 60, 255)';
    if (score >= 60) return 'rgb(100, 100, 255)';
    if (score >= 50) return 'rgb(150, 150, 255)';
    return 'rgb(200, 200, 255)';
  };

  // Custom tooltip to show more details
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{data.date} {data.time}</p>
          <p>Topic: <span className="font-semibold">{data.topic}</span></p>
          <p>Focus Score: <span className="font-semibold">{data.focusScore}%</span></p>
          <p>Duration: <span className="font-semibold">{data.duration} min</span></p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading focus data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (focusData.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No focus data available. Start a new focus session to see your trends!</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Line Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Focus Journey</h2>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={focusData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time, index) => {
                // Every 3rd tick, show the date instead of time for better context
                return index % 3 === 0 ? focusData[index].date : time;
              }}
            />
            <YAxis yAxisId="left" domain={[0, 100]} label={{ value: 'Focus Score (%)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, Math.max(...focusData.map(d => d.duration)) + 10]} label={{ value: 'Duration (min)', angle: 90, position: 'insideRight' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="focusScore"
              name="Focus Score"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="duration"
              name="Duration"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4, fill: "#10b981" }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Topic Breakdown */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-gray-700">Topics Studied</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(focusData.map(item => item.topic))).map(topic => (
              <span 
                key={topic} 
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}