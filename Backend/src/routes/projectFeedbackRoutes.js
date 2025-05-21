import express from 'express';
import {
  createProjectFeedback,
  getProjectFeedback,
  uploadFeedbackAttachments
} from '../controllers/projectFeedbackController.js';

const router = express.Router();

// Route to create new project feedback (requires file upload middleware)
router.post('/feedback', uploadFeedbackAttachments, createProjectFeedback);

// Route to get all feedback for a specific project
router.get('/projects/:projectId/feedback', getProjectFeedback);

export default router; 