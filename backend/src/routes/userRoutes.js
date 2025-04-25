import express from 'express';
import {
  getAllUsers,
  getUser,
  updateProfile,
  makeAdmin,
  deleteUser
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Current user routes
router.patch('/update-profile', updateProfile);

// Admin only routes
router.use(restrictTo('admin'));
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id/make-admin', makeAdmin);
router.delete('/:id', deleteUser);

export default router; 