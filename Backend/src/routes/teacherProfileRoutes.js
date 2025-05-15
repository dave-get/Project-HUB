import express from 'express';
import {
  getTeacherProfile,
  updateTeacherProfile,
  getAllTeacherProfiles,
} from '../controllers/teacherProfileController.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes
router.use(protectRoute);

// Get all teacher profiles
router.get('/', getAllTeacherProfiles);

// Get single teacher profile
router.get('/:id', getTeacherProfile);


// Update teacher profile
router.put('/:id', updateTeacherProfile);

export default router; 