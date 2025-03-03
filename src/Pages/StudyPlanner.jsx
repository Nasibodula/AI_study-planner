import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, ListTodo, Bell } from 'lucide-react';
import axios from 'axios';
import ReminderComponent from '../components/Reminder';


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

const StudyPlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', duration: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



// Add this at the top of your StudyPlannerPage component
useEffect(() => {
  const token = localStorage.getItem('token');
  console.log('Current auth token:', token);
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header set:', api.defaults.headers.common['Authorization']);
  } else {
    console.log('No auth token found');
  }
}, []);



  // Fetch tasks for selected date
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const formattedDate = selectedDate.toISOString();
        const response = await api.get('/api/tasks', {
          params: { date: formattedDate }
        });
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
  }, [selectedDate]);

  

  // Fetch reminders
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await api.get('/api/reminders');
        setReminders(response.data);
      } catch (err) {
        console.error('Failed to fetch reminders:', err);
      }
    };

    fetchReminders();
  }, []);

//addtasks
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.title,
        dueDate: selectedDate,
        duration: parseInt(newTask.duration), // Make sure duration is sent as a number
        status: 'pending'
      };
      
      console.log('Sending task data:', taskData); // For debugging
      const response = await api.post('/api/tasks', taskData);
      
      console.log('Task added successfully:', response.data);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', duration: '' });
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task: ' + (err.response?.data?.message || err.message));
    }
  };

  // Toggle task completion
  const handleToggleTask = async (taskId, completed) => {
    try {
      const response = await api.patch(`/api/tasks/${taskId}`, {
        completed: !completed
      });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
    } catch (err) {
      setError('Failed to update task: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  //Delete tasks
  const handleDeleteTask = async (taskId) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await api.delete(`/api/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
      }
    } catch (err) {
      setError('Failed to delete task: ' + (err.response?.data?.message || err.message));
    }
  };

  // Add reminder
  const handleAddReminder = async () => {
    try {
      const response = await api.post('/api/reminders', {
        title: 'New Reminder',
        time: '09:00'
      });
      setReminders([...reminders, response.data]);
    } catch (err) {
      console.error('Failed to add reminder:', err);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    return Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);
  };


  // Rest of your component remains the same
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Study Planner</h1>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <Calendar className="w-5 h-5" />
                  Schedule
                </div>
                <div className="text-gray-500">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map((day) => (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-2 text-sm hover:bg-blue-50 cursor-pointer ${
                      day === selectedDate.getDate() ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => setSelectedDate(new Date(selectedDate.setDate(day)))}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-6">
            {/* Add Task Card */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <Plus className="w-5 h-5" />
                  Add New Task
                </div>
              </div>
              <div className="p-6">
                <form className="space-y-4" onSubmit={handleAddTask}>
                  <div>
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Duration (mins)"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-md"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Today's Tasks Card */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <ListTodo className="w-5 h-5" />
                  Today's Tasks
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center text-gray-500">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                  <div className="text-center text-gray-500">No tasks for today</div>
                ) : (
                  <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task._id, task.completed)}
                          className="w-4 h-4"
                        />
                        <span className={task.completed ? 'line-through text-gray-500' : ''}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.duration && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{task.duration}m</span>
                          </div>
                        )}
                        {!task.completed && (
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reminders Card */}
            <ReminderComponent/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyPlannerPage;