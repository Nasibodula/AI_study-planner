const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  duration: Number,
  status: { type: String, default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user?.id });
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
      userId: req.user?.id
    });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;