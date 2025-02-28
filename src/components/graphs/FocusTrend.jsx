// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer } from 'recharts';
// import {TrendingUp } from 'lucide-react';
// import axios from 'axios';


// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });

// export default function FocusTrendgraph() {

//     // Sample data for charts
//     const focusData = [
//       { day: 'Mon', score: 85 },
//       { day: 'Tue', score: 75 },
//       { day: 'Wed', score: 90 },
//       { day: 'Thu', score: 82 },
//       { day: 'Fri', score: 88 },
//       { day: 'Sat', score: 70 },
//       { day: 'Sun', score: 85 }
//     ];
//   return (
//     <div className="p-6">
//         <h2 className="text-lg font-semibold flex items-center gap-2">
//           <TrendingUp className="w-5 h-5" />
//           Focus Score Trend
//         </h2>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={focusData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Line 
//                 type="monotone" 
//                 dataKey="score" 
//                 stroke="#2563eb" 
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//     </div>

//   )
// }



import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FocusTrendgraph() {

// Create weekly data for heatmap
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hours = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'];

// Sample heatmap data - each cell contains a focus score for that day/time
const [focusData, setFocusData] = useState([
  { time: '09:00', focusScore: 85, duration: 25, topic: 'Math' },
  { time: '10:00', focusScore: 72, duration: 30, topic: 'Physics' },
  { time: '11:30', focusScore: 94, duration: 45, topic: 'Chemistry' },
  { time: '13:00', focusScore: 65, duration: 20, topic: 'History' },
  { time: '14:30', focusScore: 88, duration: 35, topic: 'Computer Science' },
  { time: '16:00', focusScore: 76, duration: 30, topic: 'Literature' },
  { time: '17:30', focusScore: 90, duration: 40, topic: 'Biology' },
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
    <div className="mb-8  ">
         {/* Line Chart Section */}
      <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Daily Focus Scores</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={focusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${value}${name === 'focusScore' ? '%' : ' min'}`, 
                name === 'focusScore' ? 'Focus Score' : 'Duration'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="focusScore" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="duration" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

  )
}
