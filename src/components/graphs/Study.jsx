import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';
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
// Function to get the date for each day of the current week (Monday-Sunday)
const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust for Monday start

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      date: date.toISOString().split("T")[0], // YYYY-MM-DD format
      day: date.toLocaleDateString(undefined, { weekday: "short" }) // "Mon", "Tue", etc.
    };
  });
};

export default function StudyTimegraph() {
  const [studyTimeData, setStudyTimeData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define the function
        const fetchStudyData = async () => {
          try {
            const response = await api.get("/api/tasks");
            
            // Get the week dates
            const weekDates = getWeekDates();
            
            // Filter only completed tasks
            const completedTasks = response.data.filter(task => task.completed);
            
            // Group data by date and calculate total duration per day
            const tasksByDate = completedTasks.reduce((acc, task) => {
              const date = new Date(task.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD format
              if (!acc[date]) acc[date] = { date, duration: 0 };
              acc[date].duration += task.duration / 60; // Convert minutes to hours
              return acc;
            }, {});
            
            // Create the final array with all days of the week, including those with no tasks
            const formattedData = weekDates.map(({ date, day }) => ({
              date,
              day, // This adds the short day name (Mon, Tue, etc.)
              duration: tasksByDate[date] ? tasksByDate[date].duration : 0
            }));
            
            setStudyTimeData(formattedData);
          } catch (err) {
            console.error("Error fetching study time data:", err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
      
        // Execute the function
        fetchStudyData();
      }, []);

   // Calculate total study hours (only for completed tasks)
   const totalStudyHours = tasks
   .filter(task => task.completed) // Only include completed tasks
   .reduce((total, task) => total + (task.duration || 0), 0) / 60; // Convert minutes to hours

 // Calculate goals completed (number of completed tasks)
 const goalsCompleted = tasks.filter(task => task.completed).length;


  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          Study Time Per Week (Monday - Sunday)
        </h2>
        <div className="h-80">
          {studyTimeData.length === 0 ? (
            <p className="text-gray-500 text-center">No completed study sessions this week</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="duration" fill="#4ade80" name="Study Duration (hours)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
