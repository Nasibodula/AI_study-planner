// import React, { useState, useEffect } from 'react';
// import { getFocusHeatmap } from '../../Pages/focusTrackingAPI';

// const FocusHeatmap = ({ userId = 'user1' }) => {
//   const [heatmapData, setHeatmapData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Fetch heatmap data
//   useEffect(() => {
//     const fetchHeatmap = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getFocusHeatmap(userId);
//         console.log('Heatmap data received:', response);
        
//         // Transform the API data into the format needed for the heatmap
//         if (response && response.heatmap_data && response.heatmap_data.length > 0) {
//           const formattedData = {};
          
//           // Initialize all days with zeros
//           days.forEach(day => {
//             formattedData[day.toLowerCase()] = Array(24).fill(0);
//           });
          
//           // Fill in the actual data points
//           response.heatmap_data.forEach(point => {
//             const dayLower = point.day.toLowerCase();
//             if (formattedData[dayLower] && point.hour >= 0 && point.hour < 24) {
//               formattedData[dayLower][point.hour] = point.focus_score;
//             }
//           });
          
//           setHeatmapData(formattedData);
//         }
//       } catch (err) {
//         console.error('Error fetching heatmap data:', err);
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchHeatmap();
//   }, [userId]);
  
//   // If we don't have real data yet, create a placeholder
//   const getPlaceholderData = () => {
//     const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     const placeholder = {};
    
//     days.forEach(day => {
//       placeholder[day] = Array(24).fill(0).map(() => Math.floor(Math.random() * 100));
//     });
    
//     return placeholder;
//   };
  
//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const hours = Array.from({ length: 24 }, (_, i) => i);
  
//   // Replace the getColor function with this implementation
//   const getColor = (value) => {
//     // Normalize value to 0-100
//     const normalizedValue = Math.max(0, Math.min(100, value));
    
//     if (normalizedValue === 0) return 'bg-gray-100';
//     if (normalizedValue < 20) return 'bg-blue-100';
//     if (normalizedValue < 40) return 'bg-blue-300';
//     if (normalizedValue < 60) return 'bg-blue-500';
//     if (normalizedValue < 80) return 'bg-blue-700';
//     return 'bg-blue-900';
//   };
//   // Use actual data or placeholder
//   const data = heatmapData || getPlaceholderData();

//   return (
//     <div className="p-4 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-4">Focus Patterns</h2>
//       <p className="text-sm text-gray-500 mb-4">
//         This heatmap shows your focus patterns throughout the week.
//         Darker colors indicate higher focus scores during those time periods.
//       </p>
      
//       <div className="relative overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr>
//               <th className="p-2"></th>
//               {hours.map(hour => (
//                 <th key={hour} className="p-1 text-xs text-gray-500 text-center" style={{ width: '30px' }}>
//                   {hour}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {days.map((day, dayIndex) => (
//               <tr key={day}>
//                 <td className="p-2 text-sm font-medium">{day.slice(0, 3)}</td>
//                 {hours.map(hour => {
//                   const dayKey = day.toLowerCase();
//                   const value = data[dayKey] ? data[dayKey][hour] || 0 : 0;
                  
//                   return (
//                     <td key={`${day}-${hour}`} className="p-0">
//                       <div 
//                         className={`w-full h-8 ${getColor(value)}`}
//                         title={`${day} at ${hour}:00 - Focus Score: ${value}%`}
//                       ></div>
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Legend */}
//       <div className="mt-4">
//         <p className="text-sm font-medium mb-2">Focus Intensity:</p>
//         <div className="flex items-center space-x-1">
//           <div className="bg-gray-100 w-6 h-6"></div>
//           <div className="bg-blue-100 w-6 h-6"></div>
//           <div className="bg-blue-300 w-6 h-6"></div>
//           <div className="bg-blue-500 w-6 h-6"></div>
//           <div className="bg-blue-700 w-6 h-6"></div>
//           <div className="bg-blue-900 w-6 h-6"></div>
//           <span className="text-xs text-gray-500 ml-2">Low → High</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FocusHeatmap;


import React, { useState, useEffect } from 'react';
import { getFocusHeatmap } from '../../Pages/focusTrackingAPI';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const FocusHeatmap = ({ userId = 'user1' }) => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        setIsLoading(true);
        const response = await getFocusHeatmap(userId);
        console.log('Heatmap data received:', response);
        
        // Transform the API data into the format needed for the heatmap
        if (response && response.heatmap_data && response.heatmap_data.length > 0) {
          const formattedData = {};
          
          // Initialize all days with zeros
          days.forEach(day => {
            formattedData[day.toLowerCase()] = Array(24).fill(0);
          });
          
          // Fill in the actual data points
          response.heatmap_data.forEach(point => {
            const dayLower = point.day.toLowerCase();
            if (formattedData[dayLower] && point.hour >= 0 && point.hour < 24) {
              formattedData[dayLower][point.hour] = point.focus_score;
            }
          });
          
          setHeatmapData(formattedData);
        }
      } catch (err) {
        console.error('Error fetching heatmap data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHeatmap();
  }, [userId]);
  
  // If we don't have real data yet, create a placeholder
  const getPlaceholderData = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const placeholder = {};
    
    days.forEach(day => {
      placeholder[day] = Array(24).fill(0).map(() => Math.floor(Math.random() * 100));
    });
    
    return placeholder;
  };
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Enhanced color function with smoother gradients
  const getColor = (value) => {
    // Normalize value to 0-100
    const normalizedValue = Math.max(0, Math.min(100, value));
    
    if (normalizedValue === 0) return 'bg-gray-100';
    if (normalizedValue < 20) return 'bg-blue-100';
    if (normalizedValue < 40) return 'bg-blue-200';
    if (normalizedValue < 60) return 'bg-blue-400';
    if (normalizedValue < 80) return 'bg-blue-600';
    return 'bg-blue-800';
  };
  
  // Get text color based on background color
  const getTextColor = (value) => {
    return value >= 60 ? 'text-white' : 'text-gray-700';
  };
  
  // Format time display
  const formatHour = (hour) => {
    return hour === 0 ? '12am' : 
           hour === 12 ? '12pm' : 
           hour < 12 ? `${hour}am` : 
           `${hour-12}pm`;
  };
  
  // Calculate day averages for the sidebar
  const getDayAverage = (day) => {
    const dayData = data[day.toLowerCase()] || [];
    if (dayData.length === 0) return 0;
    return Math.round(dayData.reduce((sum, val) => sum + val, 0) / dayData.length);
  };
  
  // Use actual data or placeholder
  const data = heatmapData || getPlaceholderData();
  
  // Get current highest focus hours
  const getTopFocusPeriods = () => {
    let topPeriods = [];
    days.forEach(day => {
      const dayLower = day.toLowerCase();
      if (data[dayLower]) {
        data[dayLower].forEach((score, hour) => {
          topPeriods.push({ day, hour, score });
        });
      }
    });
    
    return topPeriods
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg flex items-center justify-center h-64">
        <div className="animate-pulse text-blue-600">Loading your focus data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Unable to load focus data</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with title and description */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center mb-2">
          <Calendar className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Focus Patterns</h2>
        </div>
        <p className="text-gray-500">
          Track when you're most focused throughout the week. Darker blues indicate higher focus intensity.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Day sidebar with averages */}
        <div className="w-full md:w-36 bg-gray-50 p-4 border-r border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Daily Average</h3>
          {days.map(day => {
            const avg = getDayAverage(day);
            return (
              <div 
                key={day} 
                className={`flex items-center justify-between p-2 mb-1 rounded cursor-pointer hover:bg-gray-100 transition-colors ${selectedDay === day ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              >
                <span className="font-medium">{day.slice(0, 3)}</span>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${getColor(avg)} ${getTextColor(avg)}`}>
                  {avg}%
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Main heatmap */}
        <div className="p-4 overflow-x-auto flex-1">
          <div className="mb-4 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Hours (24-hour format)</span>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-16"></th>
                {hours.map(hour => (
                  <th key={hour} className="p-1 text-xs text-gray-500 text-center w-8">
                    {hour % 3 === 0 ? formatHour(hour) : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, dayIndex) => (
                <tr key={day} className={`${selectedDay === day ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <td className="py-1 px-2 text-sm font-medium">{day.slice(0, 3)}</td>
                  {hours.map(hour => {
                    const dayKey = day.toLowerCase();
                    const value = data[dayKey] ? data[dayKey][hour] || 0 : 0;
                    
                    return (
                      <td 
                        key={`${day}-${hour}`} 
                        className="p-0"
                        onMouseEnter={() => setHoveredCell({ day, hour, value })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div 
                          className={`w-8 h-8 flex items-center justify-center ${getColor(value)} ${getTextColor(value)} text-xs font-medium transition-all duration-200 hover:scale-110 hover:shadow-md rounded-sm m-px cursor-pointer`}
                        >
                          {value > 0 ? value : ''}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Hover detail card */}
          {hoveredCell && (
            <div className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-10 mt-2">
              <div className="font-medium text-gray-800">{hoveredCell.day}, {formatHour(hoveredCell.hour)}</div>
              <div className="flex items-center mt-1">
                <div className={`w-4 h-4 rounded ${getColor(hoveredCell.value)} mr-2`}></div>
                <span className="text-gray-600">Focus score: <span className="font-bold">{hoveredCell.value}%</span></span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Insights section */}
      <div className="border-t border-gray-100 p-6 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Focus Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">Peak Focus Times</h4>
            <ul className="space-y-2">
              {getTopFocusPeriods().map((period, index) => (
                <li key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getColor(period.score)} mr-2`}></div>
                  <span>{period.day}, {formatHour(period.hour)} <span className="text-gray-500">({period.score}%)</span></span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-700 mb-2">Focus Legend</h4>
            <div className="flex items-center space-x-1">
              <div className="bg-gray-100 w-6 h-6 rounded"></div>
              <div className="bg-blue-100 w-6 h-6 rounded"></div>
              <div className="bg-blue-200 w-6 h-6 rounded"></div>
              <div className="bg-blue-400 w-6 h-6 rounded"></div>
              <div className="bg-blue-600 w-6 h-6 rounded"></div>
              <div className="bg-blue-800 w-6 h-6 rounded"></div>
              <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
              <span className="text-sm text-gray-600">0% to 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusHeatmap;