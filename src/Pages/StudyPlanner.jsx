// import React, { useState } from 'react';
// import { Calendar, Clock, Plus, ListTodo, Bell } from 'lucide-react';

// const StudyPlannerPage = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [tasks, setTasks] = useState([
//     { id: 1, title: 'Review Math Chapter 3', duration: 60, completed: false },
//     { id: 2, title: 'Physics Practice Problems', duration: 45, completed: true },
//   ]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <h1 className="text-2xl font-bold text-gray-800">Study Planner</h1>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Calendar Section */}
//           <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
//             <div className="p-6 border-b">
//               <div className="flex items-center gap-2 text-xl font-semibold">
//                 <Calendar className="w-5 h-5" />
//                 Schedule
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-7 gap-2">
//                 {Array.from({ length: 35 }).map((_, index) => (
//                   <div
//                     key={index}
//                     className="aspect-square border rounded-lg p-2 text-sm hover:bg-blue-50 cursor-pointer"
//                   >
//                     {index + 1}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Tasks Section */}
//           <div className="space-y-6">
//             {/* Add Task Card */}
//             <div className="bg-white rounded-lg border shadow-sm">
//               <div className="p-6 border-b">
//                 <div className="flex items-center gap-2 text-xl font-semibold">
//                   <Plus className="w-5 h-5" />
//                   Add New Task
//                 </div>
//               </div>
//               <div className="p-6">
//                 <form className="space-y-4">
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Task title"
//                       className="w-full px-3 py-2 border rounded-md"
//                     />
//                   </div>
//                   <div className="flex gap-4">
//                     <input
//                       type="number"
//                       placeholder="Duration (mins)"
//                       className="flex-1 px-3 py-2 border rounded-md"
//                     />
//                     <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//                       Add
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             {/* Today's Tasks Card */}
//             <div className="bg-white rounded-lg border shadow-sm">
//               <div className="p-6 border-b">
//                 <div className="flex items-center gap-2 text-xl font-semibold">
//                   <ListTodo className="w-5 h-5" />
//                   Today's Tasks
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-4">
//                   {tasks.map((task) => (
//                     <div
//                       key={task.id}
//                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                     >
//                       <div className="flex items-center gap-3">
//                         <input
//                           type="checkbox"
//                           checked={task.completed}
//                           className="w-4 h-4"
//                         />
//                         <span className={task.completed ? 'line-through text-gray-500' : ''}>
//                           {task.title}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2 text-gray-500">
//                         <Clock className="w-4 h-4" />
//                         <span>{task.duration}m</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Reminders Card */}
//             <div className="bg-white rounded-lg border shadow-sm">
//               <div className="p-6 border-b">
//                 <div className="flex items-center gap-2 text-xl font-semibold">
//                   <Bell className="w-5 h-5" />
//                   Study Reminders
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
//                     <span>Daily Review</span>
//                     <span className="text-gray-500">7:00 PM</span>
//                   </div>
//                   <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
//                     <span>Weekend Planning</span>
//                     <span className="text-gray-500">Sat 10:00 AM</span>
//                   </div>
//                   <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
//                     Add Reminder
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default StudyPlannerPage;


// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Plus, ListTodo, Bell } from 'lucide-react';
// import axios from 'axios';



// const api = axios.create({
//   baseURL: 'http://localhost:5000',
// });

// const StudyPlannerPage = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [tasks, setTasks] = useState([]);
//   const [reminders, setReminders] = useState([]);
//   const [newTask, setNewTask] = useState({ title: '', duration: '' });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   // Fetch tasks for selected date
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try { 
//         setLoading(true);
//         const response = await api.get('/api/tasks', {
//           params: { date: selectedDate.toISOString() }
//         });
//         setTasks(response.data);
//         setError(null);
//       } catch (err) {
//         setError('Failed to fetch tasks');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [selectedDate]);

//   // Fetch reminders
//   useEffect(() => {
//     const fetchReminders = async () => {
//       try {
//         const response = await api.get('/api/reminders');
//         setReminders(response.data);
//       } catch (err) {
//         console.error('Failed to fetch reminders:', err);
//       }
//     };

//     fetchReminders();
//   }, []);

//   // Add new task
//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('/api/tasks', {
//         ...newTask,
//         date: selectedDate
//       });
//       setTasks([...tasks, response.data]);
//       setNewTask({ title: '', duration: '' });
//     } catch (err) {
//       setError('Failed to add task');
//       console.error(err);
//     }
//   };

//   // Toggle task completion
//   const handleToggleTask = async (taskId, completed) => {
//     try {
//       const response = await api.patch(`/api/tasks/${taskId}`, {
//         completed: !completed
//       });
//       setTasks(tasks.map(task => 
//         task._id === taskId ? response.data : task
//       ));
//     } catch (err) {
//       setError('Failed to update task');
//       console.error(err);
//     }
//   };

//   // Add reminder
//   const handleAddReminder = async () => {
//     try {
//       const response = await api.post('/api/reminders', {
//         title: 'New Reminder',
//         time: '09:00'
//       });
//       setReminders([...reminders, response.data]);
//     } catch (err) {
//       console.error('Failed to add reminder:', err);
//     }
//   };

//   // Generate calendar days
//   const generateCalendarDays = () => {
//     const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
//     const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
//     return Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <h1 className="text-2xl font-bold text-gray-800">Study Planner</h1>
//           {error && <div className="text-red-500 mt-2">{error}</div>}
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Calendar Section */}
//           <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
//             <div className="p-6 border-b">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-xl font-semibold">
//                   <Calendar className="w-5 h-5" />
//                   Schedule
//                 </div>
//                 <div className="text-gray-500">
//                   {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                 </div>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-7 gap-2">
//                 {generateCalendarDays().map((day) => (
//                   <div
//                     key={day}
//                     className={`aspect-square border rounded-lg p-2 text-sm hover:bg-blue-50 cursor-pointer ${
//                       day === selectedDate.getDate() ? 'bg-blue-100' : ''
//                     }`}
//                     onClick={() => setSelectedDate(new Date(selectedDate.setDate(day)))}
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Tasks Section */}
//           <div className="space-y-6">
//             {/* Add Task Card */}
//             <div className="bg-white rounded-lg border shadow-sm">
//               <div className="p-6 border-b">
//                 <div className="flex items-center gap-2 text-xl font-semibold">
//                   <Plus className="w-5 h-5" />
//                   Add New Task
//                 </div>
//               </div>
//               <div className="p-6">
//                 <form className="space-y-4" onSubmit={handleAddTask}>
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Task title"
//                       value={newTask.title}
//                       onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//                       className="w-full px-3 py-2 border rounded-md"
//                       required
//                     />
//                   </div>
//                   <div className="flex gap-4">
//                     <input
//                       type="number"
//                       placeholder="Duration (mins)"
//                       value={newTask.duration}
//                       onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
//                       className="flex-1 px-3 py-2 border rounded-md"
//                       required
//                     />
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                     >
//                       Add
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             {/* Today's Tasks Card */}
//             <div className="bg-white rounded-lg border shadow-sm">
//               <div className="p-6 border-b">
//                 <div className="flex items-center gap-2 text-xl font-semibold">
//                   <ListTodo className="w-5 h-5" />
//                   Today's Tasks
//                 </div>
//               </div>
//               <div className="p-6">
//                 {loading ? (
//                   <div className="text-center text-gray-500">Loading tasks...</div>
//                 ) : (
//                   <div className="space-y-4">
//                     {tasks.map((task) => (
//                       <div
//                         key={task._id}
//                         className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                       >
//                         <div className="flex items-center gap-3">
//                           <input
//                             type="checkbox"
//                             checked={task.completed}
//                             onChange={() => handleToggleTask(task._id, task.completed)}
//                             className="w-4 h-4"
//                           />
//                           <span className={task.completed ? 'line-through text-gray-500' : ''}>
//                             {task.title}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 text-gray-500">
//                           <Clock className="w-4 h-4" />
//                           <span>{task.duration}m</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Reminders Card */}
//             <div className="bg-white rounded-lg border shadow-sm">
//               <div className="p-6 border-b">
//                 <div className="flex items-center gap-2 text-xl font-semibold">
//                   <Bell className="w-5 h-5" />
//                   Study Reminders
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="space-y-3">
//                   {reminders.map((reminder) => (
//                     <div
//                       key={reminder._id}
//                       className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
//                     >
//                       <span>{reminder.title}</span>
//                       <span className="text-gray-500">{reminder.time}</span>
//                     </div>
//                   ))}
//                   <button
//                     onClick={handleAddReminder}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//                   >
//                     Add Reminder
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default StudyPlannerPage;




import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, ListTodo, Bell } from 'lucide-react';
import axios from 'axios';
// import { api } from '../context/AuthContext';

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
        const response = await api.get('/api/tasks', {
          params: { date: selectedDate.toISOString() }
        });
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tasks: ' + (err.response?.data?.error || err.message));
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

  // Add new task
  // const handleAddTask = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await api.post('/api/tasks', {
  //       ...newTask,
  //       date: selectedDate.toISOString()
  //     });
  //     setTasks([...tasks, response.data]);
  //     setNewTask({ title: '', duration: '' });
  //   } catch (err) {
  //     setError('Failed to add task: ' + (err.response?.data?.error || err.message));
  //     console.error(err);
  //   }
  // };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare task data according to your Task model structure
      const taskData = {
        title: newTask.title,
        // Match these fields to your Task model requirements
        description: newTask.title, // Or provide a description field in your form
        dueDate: selectedDate,
        status: "pending"
      };
      
      console.log('Sending task data:', taskData);
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
      setError('Failed to update task: ' + (err.response?.data?.error || err.message));
      console.error(err);
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



  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token);
      
      // Try to make a request to an endpoint that requires authentication
      const response = await api.get('/api/auth/user');
      console.log('Authentication check successful:', response.data);
      return true;
    } catch (err) {
      console.error('Authentication check failed:', err.response?.data || err.message);
      return false;
    }
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
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{task.duration}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reminders Card */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2 text-xl font-semibold">
                  <Bell className="w-5 h-5" />
                  Study Reminders
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {reminders.length === 0 ? (
                    <div className="text-center text-gray-500">No reminders set</div>
                  ) : (
                    reminders.map((reminder) => (
                      <div
                        key={reminder._id}
                        className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                      >
                        <span>{reminder.title}</span>
                        <span className="text-gray-500">{reminder.time}</span>
                      </div>
                    ))
                  )}
                  <button
                    onClick={handleAddReminder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Add Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button 
  onClick={checkAuth}
  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 mt-2 ml-2"
>
  Check Authentication
</button>
      </main>
    </div>
  );
};

export default StudyPlannerPage;