import React, { useState, useEffect } from 'react';
import { Bell, Plus, X, Volume2 } from 'lucide-react';
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

const ReminderComponent = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    sound: true
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReminders();
    setupNotificationCheck();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await api.get('/api/reminders');
      setReminders(response.data);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    }
  };

  const setupNotificationCheck = () => {
    // Check for reminders every minute
    const interval = setInterval(() => {
      checkReminders();
    }, 60000);

    return () => clearInterval(interval);
  };

  const checkReminders = () => {
    const now = new Date();
    reminders.forEach(reminder => {
      const reminderTime = new Date(reminder.date + 'T' + reminder.time);
      if (Math.abs(now - reminderTime) < 60000 && !reminder.notified) {
        triggerNotification(reminder);
      }
    });
  };

  const triggerNotification = (reminder) => {
    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("Study Reminder", {
        body: reminder.title,
        icon: "/favicon.ico"
      });
    }

    // Sound notification
    if (reminder.sound) {
      const audio = new Audio('/notification-sound.mp3');
      audio.play();
    }

    // Mark reminder as notified
    updateReminderNotification(reminder._id);
  };

  const updateReminderNotification = async (reminderId) => {
    try {
      await api.patch(`/api/reminders/${reminderId}`, { notified: true });
      fetchReminders();
    } catch (err) {
      console.error('Failed to update reminder:', err);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/reminders', newReminder);
      setReminders([...reminders, response.data]);
      setNewReminder({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        sound: true
      });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add reminder:', err);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      await api.delete(`/api/reminders/${reminderId}`);
      setReminders(reminders.filter(reminder => reminder._id !== reminderId));
    } catch (err) {
      console.error('Failed to delete reminder:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Bell className="w-5 h-5" />
            Study Reminders
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {showForm ? <X /> : <Plus />}
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {showForm && (
          <form onSubmit={handleAddReminder} className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Reminder title"
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={newReminder.date}
                onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-md"
                required
              />
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newReminder.sound}
                onChange={(e) => setNewReminder({ ...newReminder, sound: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Enable sound notification
              </label>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Reminder
            </button>
          </form>
        )}

        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="text-center text-gray-500">No reminders set</div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder._id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{reminder.title}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(reminder.date).toLocaleDateString()} at {reminder.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {reminder.sound && <Volume2 className="w-4 h-4 text-gray-500" />}
                  <button
                    onClick={() => handleDeleteReminder(reminder._id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderComponent;

