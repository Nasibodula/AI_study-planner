// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
// import { Clock, Calendar, Brain, BarChart2, Target, TrendingUp } from 'lucide-react';

// const DashboardPage = () => {
//   // Sample data for charts
//   const focusData = [
//     { day: 'Mon', score: 85 },
//     { day: 'Tue', score: 75 },
//     { day: 'Wed', score: 90 },
//     { day: 'Thu', score: 82 },
//     { day: 'Fri', score: 88 },
//     { day: 'Sat', score: 70 },
//     { day: 'Sun', score: 85 }
//   ];

//   const subjectData = [
//     { subject: 'Math', hours: 12 },
//     { subject: 'Physics', hours: 8 },
//     { subject: 'Chemistry', hours: 6 },
//     { subject: 'Biology', hours: 9 }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <h1 className="text-2xl font-bold text-gray-800">Dashboard & Analytics</h1>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {/* Stat Card 1 */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Total Study Hours</p>
//                 <p className="text-2xl font-bold">35.5</p>
//               </div>
//               <Clock className="w-8 h-8 text-blue-500" />
//             </div>
//           </div>

//           {/* Stat Card 2 */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Average Focus Score</p>
//                 <p className="text-2xl font-bold">82%</p>
//               </div>
//               <Brain className="w-8 h-8 text-green-500" />
//             </div>
//           </div>

//           {/* Stat Card 3 */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Study Sessions</p>
//                 <p className="text-2xl font-bold">24</p>
//               </div>
//               <Calendar className="w-8 h-8 text-purple-500" />
//             </div>
//           </div>

//           {/* Stat Card 4 */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Goals Completed</p>
//                 <p className="text-2xl font-bold">8/10</p>
//               </div>
//               <Target className="w-8 h-8 text-red-500" />
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Focus Trend */}
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 <TrendingUp className="w-5 h-5" />
//                 Focus Score Trend
//               </h2>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={focusData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="day" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line 
//                       type="monotone" 
//                       dataKey="score" 
//                       stroke="#2563eb" 
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Subject Distribution */}
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold flex items-center gap-2">
//                 <BarChart2 className="w-5 h-5" />
//                 Study Time by Subject
//               </h2>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={subjectData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="subject" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="hours" fill="#4ade80" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Focus Heatmap */}
//         <div className="bg-white rounded-lg shadow mt-8">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold">Weekly Focus Heatmap</h2>
//             <div className="grid grid-cols-7 gap-2 mt-4">
//               {Array.from({ length: 24 }).map((_, hourIndex) => (
//                 <React.Fragment key={hourIndex}>
//                   {Array.from({ length: 7 }).map((_, dayIndex) => {
//                     const intensity = Math.random();
//                     return (
//                       <div
//                         key={`${hourIndex}-${dayIndex}`}
//                         className="aspect-square rounded"
//                         style={{
//                           backgroundColor: `rgba(37, 99, 235, ${intensity})`,
//                         }}
//                         title={`Hour ${hourIndex}, Day ${dayIndex + 1}`}
//                       />
//                     );
//                   })}
//                 </React.Fragment>
//               ))}
//             </div>
//             <div className="mt-4 flex justify-between text-sm text-gray-500">
//               <span>Less Focused</span>
//               <div className="flex gap-2">
//                 <div className="w-4 h-4 bg-blue-100"></div>
//                 <div className="w-4 h-4 bg-blue-300"></div>
//                 <div className="w-4 h-4 bg-blue-500"></div>
//                 <div className="w-4 h-4 bg-blue-700"></div>
//               </div>
//               <span>More Focused</span>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;


import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, Brain, BarChart2, Target, TrendingUp } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tasks: ' + (err.response?.data?.message || err.message));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculate total study hours (only for completed tasks)
  const totalStudyHours = tasks
    .filter(task => task.completed) // Only include completed tasks
    .reduce((total, task) => total + (task.duration || 0), 0) / 60; // Convert minutes to hours

  // Calculate goals completed (number of completed tasks)
  const goalsCompleted = tasks.filter(task => task.completed).length;

  // Sample data for charts
  const focusData = [
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 75 },
    { day: 'Wed', score: 90 },
    { day: 'Thu', score: 82 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 70 },
    { day: 'Sun', score: 85 }
  ];

  const subjectData = [
    { subject: 'Math', hours: 12 },
    { subject: 'Physics', hours: 8 },
    { subject: 'Chemistry', hours: 6 },
    { subject: 'Biology', hours: 9 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard & Analytics</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat Card 1: Total Study Hours */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Study Hours</p>
                <p className="text-2xl font-bold">{totalStudyHours.toFixed(2)}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Stat Card 2: Goals Completed */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Goals Completed</p>
                <p className="text-2xl font-bold">{goalsCompleted}</p>
              </div>
              <Target className="w-8 h-8 text-red-500" />
            </div>
          </div>

          {/* Stat Card 3: Average Focus Score */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Focus Score</p>
                <p className="text-2xl font-bold">82%</p>
              </div>
              <Brain className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {/* Stat Card 4: Study Sessions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Study Sessions</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Focus Trend */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Focus Score Trend
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={focusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Subject Distribution */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                Study Time by Subject
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Heatmap */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Weekly Focus Heatmap</h2>
            <div className="grid grid-cols-7 gap-2 mt-4">
              {Array.from({ length: 24 }).map((_, hourIndex) => (
                <React.Fragment key={hourIndex}>
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={`${hourIndex}-${dayIndex}`}
                        className="aspect-square rounded"
                        style={{
                          backgroundColor: `rgba(37, 99, 235, ${intensity})`,
                        }}
                        title={`Hour ${hourIndex}, Day ${dayIndex + 1}`}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>Less Focused</span>
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-blue-100"></div>
                <div className="w-4 h-4 bg-blue-300"></div>
                <div className="w-4 h-4 bg-blue-500"></div>
                <div className="w-4 h-4 bg-blue-700"></div>
              </div>
              <span>More Focused</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;