import express from 'express';
import {
  getAllComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  addComment,
  voteComplaint,
  assignComplaint,
  updateComplaintStatus
} from '../controllers/complaintController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllComplaints);
router.get('/:id', getComplaint);

// Protect all routes after this middleware
router.use(protect);

// User routes
router.post('/', createComplaint);
router.patch('/:id', updateComplaint);
router.delete('/:id', deleteComplaint);
router.post('/:id/comments', addComment);
router.patch('/:id/vote', voteComplaint);

// Admin only routes
router.use(restrictTo('admin'));
router.patch('/:id/assign', assignComplaint);
router.patch('/:id/status', updateComplaintStatus);

export default router; 