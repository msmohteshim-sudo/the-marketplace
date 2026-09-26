import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getPublicProfile,
  handleSendPhoneOTP,
  handleVerifyPhoneOTP,
  handlePincodeLookup,
  handleUploadResume,
  handleDeleteResume,
  handleParseResume
} from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);

// Phone OTP endpoints
router.post('/phone/send-otp', authenticate, handleSendPhoneOTP);
router.post('/phone/verify-otp', authenticate, handleVerifyPhoneOTP);

// Smart PIN Code Lookup
router.get('/pincode-lookup', authenticate, handlePincodeLookup);

// Resume management & AI parsing
router.post('/resume', authenticate, handleUploadResume);
router.delete('/resume', authenticate, handleDeleteResume);
router.post('/resume/parse', authenticate, handleParseResume);

// Public profile view
router.get('/:id', authenticate, getPublicProfile);

export default router;
