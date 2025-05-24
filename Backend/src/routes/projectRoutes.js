import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  incrementViews,
  addLike,
  addComment,
  uploadProjectFiles,
  updateProjectStatus
} from '../controllers/projectController.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute);
// Project routes
router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/create', uploadProjectFiles, createProject);
router.put('/:id', uploadProjectFiles, updateProject);
router.delete('/:id', deleteProject);

// Route to update project status
router.put('/:id/status', updateProjectStatus);

// Additional functionality routes
router.post('/:id/view', incrementViews);
router.post('/:id/like', addLike);
router.post('/:id/comment', addComment);

export default router; 