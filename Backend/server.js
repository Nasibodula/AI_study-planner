const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Import the ArangoDB module
const { testConnection, setupCollections } = require('./arango');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/authDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));


// Test and setup ArangoDB
testConnection()
  .then(() => setupCollections())
  .then(success => {
    if (success) {
      console.log('ArangoDB collections setup complete');
    } else {
      console.warn('ArangoDB collections setup failed');
    }
  })
  .catch(err => console.error('ArangoDB setup error:', err));

// ArangoDB Recommendations API
app.get('/api/edges', async (req, res) => {
  try {
    const recommendations = await getRecommendations();
    res.json(recommendations);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Import routes
const authRoutes = require('./middleware/auth');
const taskRoutes = require('./routes/tasks');
const reminderRoutes = require('./routes/reminders');
const focusRoutes = require('./routes/focus');

// Use routes
app.use('/api/auth', authRoutes(User));
// Apply auth middleware to protected routes
app.use('/api/tasks', authMiddleware, taskRoutes);
// Use graph routes
app.use('/api/graph', authMiddleware, require('./routes/graph'));
app.use('/api/focus-data', authMiddleware, focusRoutes);


// Root route
app.get('/', (req, res) => {
  res.send('Auth API Running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});