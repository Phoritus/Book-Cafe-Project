import express from 'express';
import { register, login } from '../controllers/authController.js';
import { requestChangeEmail, verifyChangeEmail } from '../controllers/changeEmailController.js';
const router = express.Router();

router.route('/login')
  .post(login);

router.route('/register')
  .post(register);

// Change email flow
router.post('/change-email/request', requestChangeEmail);
router.post('/change-email/verify', verifyChangeEmail);

export default router;