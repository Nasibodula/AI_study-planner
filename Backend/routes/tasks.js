const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  duration: { type: Number, required: true }, // Make duration required
  status: { type: String, default: 'pending' },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const selectedDate = req.query.date ? new Date(req.query.date) : new Date();
    
    // Set time to start of day
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Set time to end of day
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: req.userId,
      dueDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ createdAt: 'asc' });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create new task
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.userId
    });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update task (mark as complete/incomplete)
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        completed: req.body.completed,
        status: req.body.completed ? 'completed' : 'pending'
      },
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
      completed: false 
    });
    
    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found or already completed' 
      });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;