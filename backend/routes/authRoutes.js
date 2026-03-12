import express from 'express';
import { registerUser, authUser, getUserProfile, getUsers } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, adminOnly, getUsers);

export default router;
