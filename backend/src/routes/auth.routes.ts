import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  switchMode,
  updatePreferences,
  updateProfileDetails,
  handleSendRegistrationOTP,
  handleVerifyRegistrationOTP
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-registration-otp', handleSendRegistrationOTP);
router.post('/verify-registration-otp', handleVerifyRegistrationOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);
router.post('/switch-mode', authenticate, switchMode);
router.post('/preferences', authenticate, updatePreferences);
router.post('/profile-details', authenticate, updateProfileDetails);

export default router;
