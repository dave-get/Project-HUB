dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/auth.route.js';
import proposalRoutes from './routes/proposalRoutes.js';
import { connectDB } from './lib/db.js';
import teacherProfileRoutes from './routes/teacherProfileRoutes.js';
import studentProfileRoutes from './routes/studentProfileRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/teacher-profiles', teacherProfileRoutes);
app.use('/api/student-profiles', studentProfileRoutes);
app.use('/api/feedback', feedbackRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project-HUB')
  .then(() => console.log('✅ MongoDB connected: localhost'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  connectDB()
});