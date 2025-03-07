import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, Brain, BarChart2, Target, TrendingUp } from 'lucide-react';
import axios from 'axios';
import StudyTimegraph from '../components/graphs/Study';
import FocusTrendgraph from '../components/graphs/FocusTrend';
import FocusHeatmap from '../components/graphs/FocusHeatmap';
import { authService } from '../services/authService';
import {
  getFocusSessions,
  analyzeFocus,
  getFocusHeatmap,
  getSuggestedSchedule,
  getSchedule,
  getGoals,
  getKnowledgeGraph
} from './focusTrackingAPI'; 
import StudyScheduleRecommendation from '../components/cards/SuggestedSchedule';
import SessionComparisonCard from '../components/cards/SessionComparison';

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
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "user1");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyTimeData, setStudyTimeData] = useState([]);
  const [focusScore, setFocusScore] = useState(0);
  const [averageFocusScore, setAverageFocusScore] = useState(0);
  const [studySessions, setStudySessions] = useState(0);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  
  useEffect(() => {
    // This ensures we always have the latest user data
    setCurrentUser(authService.getCurrentUser());
  }, []); 

  useEffect(() => {
    const focusedTime = parseInt(localStorage.getItem('focusedTime') || 0, 10);
    const totalTime = parseInt(localStorage.getItem('totalTime') || 0, 10);

    // Calculate focus score only if totalTime is greater than 0
    if (totalTime > 0) {
      const score = ((focusedTime / totalTime) * 100).toFixed(2);
      setFocusScore(score);
    } else {
      setFocusScore('0.00'); // Default score when no tracking data is available
    }
  }, []);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data);
        
        // Calculate study sessions from tasks data
        const completedSessions = response.data.filter(task => task.completed).length;
        setStudySessions(completedSessions);
        
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

  // Fetch focus sessions data
  useEffect(() => {
    const fetchFocusData = async () => {
      try {
        if (currentUser && currentUser.id) {
          const focusData = await getFocusSessions(currentUser.id);
          
          // Calculate average focus score from all sessions
          if (focusData && focusData.length > 0) {
            // const totalScore = focusData.reduce((sum, session) => sum + session.score, 0);
            const totalScore = focusData.reduce((sum, session) => sum + session.focus_score, 0);
            const avgScore = (totalScore / focusData.length).toFixed(0);
            setAverageFocusScore(avgScore);
          } else {
            setAverageFocusScore(0);
          }
        }
      } catch (err) {
        console.error('Error fetching focus data:', err);
      }
    };
    
    fetchFocusData();
  }, [currentUser]);

  // Calculate total study hours (only for completed tasks)
  const totalStudyHours = tasks
    .filter(task => task.completed)
    .reduce((total, task) => total + (task.duration || 0), 0) / 60; // Convert minutes to hours

  // Calculate goals completed (number of completed tasks)
  const goalsCompleted = tasks.filter(task => task.completed).length;
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard & Analytics</h1>
          <p className="text-gray-600 mt-1">Current focus score: {focusScore}%</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Stat Card 1: Total Study Hours */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Study Hours</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalStudyHours.toFixed(1)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Stat Card 2: Goals Completed */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Goals Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{goalsCompleted}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Target className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Stat Card 3: Average Focus Score */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Focus Score</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{averageFocusScore}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Stat Card 4: Study Sessions */}
          <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Study Sessions</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{studySessions}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Focus Trend */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <FocusTrendgraph userId={currentUser.id}/>
          </div>

          {/* StudyTimeGraph */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <StudyTimegraph />
          </div>
        </div>

        {/* Focus Heatmap Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <FocusHeatmap userId={currentUser.id} />
        </div>
        
        {/* Recommended Schedule Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Recommended Study Schedule */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <StudyScheduleRecommendation userId={currentUser.id} />
          </div>

          {/* Session Comparison Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <SessionComparisonCard userId={currentUser.id} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;