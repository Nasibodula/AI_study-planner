import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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

// Helper function to convert date to a consistent string format for comparison
const formatDateString = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
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
        console.log("All tasks from API:", response.data);
        
        // Store all tasks in state
        setTasks(response.data);
        
        // Get the week dates
        const weekDates = getWeekDates();
        console.log("Week dates:", weekDates);
        
        // Filter only completed tasks
        const completedTasks = response.data.filter(task => task.completed);
        console.log("Completed tasks:", completedTasks);
        
        // Debug: Log all task creation dates
        console.log("Task creation dates:", completedTasks.map(task => ({
          taskId: task._id,
          createdAt: task.createdAt,
          formattedDate: formatDateString(task.createdAt)
        })));
        
        // Create a map of week dates for quick lookup
        const weekDatesMap = {};
        weekDates.forEach(({ date, day }) => {
          weekDatesMap[date] = { date, day, duration: 0 };
        });
        
        // Process completed tasks and add their duration to the appropriate day
        completedTasks.forEach(task => {
          if (!task.createdAt) {
            console.warn("Task missing createdAt field:", task);
            return;
          }
          
          const taskDateStr = formatDateString(task.createdAt);
          
          if (weekDatesMap[taskDateStr]) {
            const duration = task.duration ? task.duration / 60 : 0; // Convert minutes to hours
            weekDatesMap[taskDateStr].duration += duration;
            console.log(`Added ${duration} hours to ${taskDateStr}`);
          } else {
            console.log(`Task date ${taskDateStr} not in current week`);
          }
        });
        
        // Convert the map to an array and sort by date
        const formattedData = Object.values(weekDatesMap);
        formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Format durations to 2 decimal places
        formattedData.forEach(item => {
          item.duration = parseFloat(item.duration.toFixed(2));
        });
        
        console.log("Final formatted data:", formattedData);
        
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          Study Time Per Week (Monday - Sunday)
        </h2>
        
        <div className="h-80">
          {loading ? (
            <p className="text-gray-500 text-center">Loading study data...</p>
          ) : error ? (
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : studyTimeData.length === 0 ? (
            <p className="text-gray-500 text-center">No completed study sessions this week</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={studyTimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis 
                  label={{ value: "Hours", angle: -90, position: "insideLeft" }}
                  allowDecimals={true}
                />
                <Tooltip 
                  formatter={(value) => [`${value} hours`, "Study Time"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="duration" 
                  fill="#4ade80" 
                  name="Study Duration (hours)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}