import express from 'express';
import {
    updateStudentProfile,
    getAllStudentProfiles,
    getStudentById
} from '../controllers/studentProfileController.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import checkRole from '../middleware/roleCheck.js';

const router = express.Router();

// Protect all routes
router.use(protectRoute);

// Update student's own profile
router.put('/me', checkRole(['student']), updateStudentProfile);

// Get all student profiles (for teachers/advisors)
router.get('/', checkRole(['teacher', 'advisor']), getAllStudentProfiles);

// Get student profile by ID (for teachers/advisors)
router.get('/:id', getStudentById);

export default router; 