import React, { useState } from 'react';
import { Calendar, Clock, Plus, ListTodo, Bell } from 'lucide-react';

const StudyPlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Math Chapter 3', duration: 60, completed: false },
    { id: 2, title: 'Physics Practice Problems', duration: 45, completed: true },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Study Planner</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Calendar className="w-5 h-5" />
                Schedule
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square border rounded-lg p-2 text-sm hover:bg-blue-50 cursor-pointer"
                  >
                    {index + 1}
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
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Task title"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Duration (mins)"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
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
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span>Daily Review</span>
                    <span className="text-gray-500">7:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span>Weekend Planning</span>
                    <span className="text-gray-500">Sat 10:00 AM</span>
                  </div>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Add Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyPlannerPage;