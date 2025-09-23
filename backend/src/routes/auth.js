import express from 'express';
import { register, login, sendRegisterCode } from '../controllers/authController.js';
import { requestChangeEmail, verifyChangeEmail } from '../controllers/changeEmailController.js';
import { changePassword } from '../controllers/changePasswordController.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();


router.route('/login')
  .post(login);

router.post('/register/send-code', sendRegisterCode);
router.route('/register')
  .post(register);

// Change email flow
router.post('/change-email/request', requestChangeEmail);
router.post('/change-email/verify', verifyChangeEmail);

// Change password flow
router.post('/change-password', auth, changePassword);

export default router;