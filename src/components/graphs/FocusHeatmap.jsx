// import React from 'react'

// export default function FocusHeatmap() {
//   return (
//     <div className="bg-white rounded-lg shadow mt-8">
//         <div className="p-6">
//         <h2 className="text-lg font-semibold">Weekly Focus Heatmap</h2>
//         <div className="grid grid-cols-7 gap-2 mt-4">
//             {Array.from({ length: 24 }).map((_, hourIndex) => (
//             <React.Fragment key={hourIndex}>
//                 {Array.from({ length: 7 }).map((_, dayIndex) => {
//                 const intensity = Math.random();
//                 return (
//                     <div
//                     key={`${hourIndex}-${dayIndex}`}
//                     className="aspect-square rounded"
//                     style={{
//                         backgroundColor: `rgba(37, 99, 235, ${intensity})`,
//                     }}
//                     title={`Hour ${hourIndex}, Day ${dayIndex + 1}`}
//                     />
//                 );
//                 })}
//             </React.Fragment>
//             ))}
//         </div>
//         <div className="mt-4 flex justify-between text-sm text-gray-500">
//             <span>Less Focused</span>
//             <div className="flex gap-2">
//             <div className="w-4 h-4 bg-blue-100"></div>
//             <div className="w-4 h-4 bg-blue-300"></div>
//             <div className="w-4 h-4 bg-blue-500"></div>
//             <div className="w-4 h-4 bg-blue-700"></div>
//             </div>
//             <span>More Focused</span>
//         </div>
//         </div>
//     </div>
//   )
// }


import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FocusHeatmap() {
      // Sample focus tracking data - could be replaced with your actual tracked data
  const [focusData, setFocusData] = useState([
    { time: '09:00', focusScore: 85, duration: 25, topic: 'Math' },
    { time: '10:00', focusScore: 72, duration: 30, topic: 'Physics' },
    { time: '11:30', focusScore: 94, duration: 45, topic: 'Chemistry' },
    { time: '13:00', focusScore: 65, duration: 20, topic: 'History' },
    { time: '14:30', focusScore: 88, duration: 35, topic: 'Computer Science' },
    { time: '16:00', focusScore: 76, duration: 30, topic: 'Literature' },
    { time: '17:30', focusScore: 90, duration: 40, topic: 'Biology' },
  ]);

  // Create weekly data for heatmap
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];

  // Sample heatmap data - each cell contains a focus score for that day/time
  const [heatmapData, setHeatmapData] = useState([
    // Monday
    [65, 75, 85, 70, 60, 50, 45],
    // Tuesday
    [70, 80, 90, 85, 75, 65, 60],
    // Wednesday
    [75, 85, 95, 90, 80, 70, 65],
    // Thursday
    [65, 75, 85, 80, 70, 60, 55],
    // Friday
    [60, 70, 80, 75, 65, 55, 50],
    // Saturday
    [50, 60, 70, 65, 55, 45, 40],
    // Sunday
    [55, 65, 75, 70, 60, 50, 45],
  ]);

  // Function to get color based on focus score
  const getFocusColor = (score) => {
    if (score >= 90) return 'rgb(0, 0, 180)';
    if (score >= 80) return 'rgb(30, 30, 220)';
    if (score >= 70) return 'rgb(60, 60, 255)';
    if (score >= 60) return 'rgb(100, 100, 255)';
    if (score >= 50) return 'rgb(150, 150, 255)';
    return 'rgb(200, 200, 255)';
  };

    return (
        <div>
         <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Weekly Focus Heatmap</h2>
            <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className="p-2 border"></th>
                    {hours.map((hour, i) => (
                    <th key={i} className="p-2 border text-gray-600 font-medium">{hour}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {days.map((day, dayIndex) => (
                    <tr key={dayIndex}>
                    <td className="p-2 border font-medium text-gray-700">{day}</td>
                    {hours.map((_, hourIndex) => {
                        const focusScore = heatmapData[dayIndex][hourIndex];
                        return (
                        <td 
                            key={hourIndex} 
                            className="p-2 border text-center w-16 h-16"
                            style={{ 
                            backgroundColor: getFocusColor(focusScore),
                            color: focusScore > 70 ? 'white' : 'black'
                            }}
                        >
                            {focusScore}%
                        </td>
                        );
                    })}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        
        {/* Focus Statistics Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Peak Focus Time</h3>
            <p className="text-3xl font-bold text-blue-600">11:30 AM</p>
            <p className="text-gray-500">Wednesday</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Average Focus Score</h3>
            <p className="text-3xl font-bold text-blue-600">81.4%</p>
            <p className="text-gray-500">This week</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Most Productive Subject</h3>
            <p className="text-3xl font-bold text-blue-600">Chemistry</p>
            <p className="text-gray-500">94% focus score</p>
            </div>
        </div>
    </div>    
    ) 
}   