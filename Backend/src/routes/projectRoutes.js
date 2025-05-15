import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  incrementViews,
  addLike,
  addComment
} from '../controllers/projectController.js';

const router = express.Router();

// Project routes
router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Additional functionality routes
router.post('/:id/view', incrementViews);
router.post('/:id/like', addLike);
router.post('/:id/comment', addComment);

export default router; 