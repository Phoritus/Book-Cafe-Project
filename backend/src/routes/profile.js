import express from 'express';
import { auth } from '../middleware/auth.js';
import { validateUpdateProfile } from '../middleware/validate.js';
import { updateProfile, getProfile } from '../controllers/profileController.js';

const router = express.Router();

// GET /profile - current user profile
router.get('/', auth, getProfile);

// PUT /profile - update current user profile fields
router.put('/', auth, validateUpdateProfile, updateProfile);

export default router;