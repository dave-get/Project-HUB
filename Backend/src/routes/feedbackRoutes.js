import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import checkRole from '../middleware/roleCheck.js';
import {
  addFeedback,
  getProposalFeedback,
  updateFeedback,
  deleteFeedback
} from '../controllers/feedbackController.js';

const router = express.Router();

// All routes are protected and require teacher role
router.use(protectRoute);
router.use(checkRole('teacher'));

// Add feedback to a proposal
router.post('/proposal/:proposalId', addFeedback);

// Get all feedback for a proposal
router.get('/proposal/:proposalId', getProposalFeedback);

// Update specific feedback in a proposal
router.put('/proposal/:proposalId/feedback/:feedbackIndex', updateFeedback);

// Delete specific feedback from a proposal
router.delete('/proposal/:proposalId/feedback/:feedbackIndex', deleteFeedback);

export default router; 