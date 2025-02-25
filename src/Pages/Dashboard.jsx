import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, Brain, BarChart2, Target, TrendingUp } from 'lucide-react';
import axios from 'axios';
import StudyTimegraph from '../components/graphs/Study';
import FocusTrendgraph from '../components/graphs/FocusTrend';
import FocusHeatmap from '../components/graphs/FocusHeatmap';

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
  const [studyTimeData, setStudyTimeData] = useState([]);

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
          <FocusTrendgraph/>

          {/* StudyTimeGraph */}
          <StudyTimegraph/>
        </div>

        {/* Focus Heatmap */}
        <FocusHeatmap/>
      </main>
    </div>
  );
};

export default DashboardPage;