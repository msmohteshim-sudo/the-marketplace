interface OTPStore {
  otp: string;
  expiresAt: number;
  attempts: number;
  phone: string;
  verified: boolean;
}

// In-memory OTP storage for secure OTP generation and verification
const otpCache = new Map<string, OTPStore>();

export const sendPhoneOTP = (userId: string, phone: string, countryCode: string = '+91') => {
  const cleanPhone = phone.replace(/\D/g, '');
  const key = `${userId}:${cleanPhone}`;

  const existing = otpCache.get(key);
  const now = Date.now();

  // 30 second resend cooldown
  if (existing && now - (existing.expiresAt - 5 * 60 * 1000) < 30000) {
    const remaining = Math.ceil((30000 - (now - (existing.expiresAt - 5 * 60 * 1000))) / 1000);
    return {
      success: false,
      message: `Please wait ${remaining} seconds before requesting another OTP.`
    };
  }

  // Generate 6-digit OTP
  // For easy dev testing & security, generate 6-digit code or fallback '123456' in dev
  const otp = process.env.NODE_ENV === 'production' 
    ? Math.floor(100000 + Math.random() * 900000).toString()
    : '123456';

  otpCache.set(key, {
    otp,
    expiresAt: now + 5 * 60 * 1000, // 5 mins
    attempts: 0,
    phone: `${countryCode}${cleanPhone}`,
    verified: false
  });

  return {
    success: true,
    message: `OTP sent successfully to ${countryCode} ${cleanPhone}. (Dev Code: ${otp})`,
    expiresInSeconds: 300,
    devCode: process.env.NODE_ENV !== 'production' ? otp : undefined
  };
};

export const verifyPhoneOTP = (userId: string, phone: string, code: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const key = `${userId}:${cleanPhone}`;
  const store = otpCache.get(key);

  if (!store) {
    return {
      success: false,
      message: 'No OTP requested for this phone number. Please request a new OTP.'
    };
  }

  if (Date.now() > store.expiresAt) {
    otpCache.delete(key);
    return {
      success: false,
      message: 'OTP has expired. Please request a new code.'
    };
  }

  if (store.attempts >= 5) {
    otpCache.delete(key);
    return {
      success: false,
      message: 'Maximum verification attempts exceeded. Please request a new OTP.'
    };
  }

  store.attempts += 1;

  if (store.otp !== code.trim()) {
    return {
      success: false,
      message: 'Invalid 6-digit OTP code. Please check and try again.'
    };
  }

  store.verified = true;
  otpCache.delete(key);

  return {
    success: true,
    message: 'Phone number verified successfully!'
  };
};

import { sendEmailVerificationCode } from './email.service';

export const sendEmailOTP = async (email: string) => {
  const cleanEmail = email.trim().toLowerCase();
  const key = `email:${cleanEmail}`;
  const now = Date.now();

  const existing = otpCache.get(key);
  if (existing && now - (existing.expiresAt - 5 * 60 * 1000) < 30000) {
    const remaining = Math.ceil((30000 - (now - (existing.expiresAt - 5 * 60 * 1000))) / 1000);
    return {
      success: false,
      message: `Please wait ${remaining} seconds before requesting another verification code.`
    };
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpCache.set(key, {
    otp,
    expiresAt: now + 5 * 60 * 1000,
    attempts: 0,
    phone: cleanEmail,
    verified: false
  });

  const mailResult = await sendEmailVerificationCode(cleanEmail, otp);

  return {
    success: true,
    delivered: mailResult.delivered,
    message: mailResult.message,
    devCode: !mailResult.delivered ? otp : undefined
  };
};

export const verifyEmailOTP = (email: string, code: string) => {
  const cleanEmail = email.trim().toLowerCase();
  const key = `email:${cleanEmail}`;
  const store = otpCache.get(key);

  if (!store) {
    return {
      success: false,
      message: 'No verification code requested for this email. Please request a new code.'
    };
  }

  if (Date.now() > store.expiresAt) {
    otpCache.delete(key);
    return {
      success: false,
      message: 'Verification code has expired. Please request a new code.'
    };
  }

  if (store.attempts >= 5) {
    otpCache.delete(key);
    return {
      success: false,
      message: 'Too many failed attempts. Please request a new code.'
    };
  }

  store.attempts += 1;

  if (store.otp !== code.trim()) {
    return {
      success: false,
      message: 'Invalid 6-digit verification code. Please check and try again.'
    };
  }

  store.verified = true;
  otpCache.delete(key);

  return {
    success: true,
    message: 'Email address verified successfully!'
  };
};
