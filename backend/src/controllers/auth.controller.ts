import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { config } from '../config/env';
import dns from 'dns';

const TYPO_DOMAINS: Record<string, string> = {
  'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com'
};

export const validateEmailExistence = async (email: string): Promise<{ valid: boolean; message?: string }> => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid working email address (e.g. name@domain.com)' };
  }

  const parts = email.trim().toLowerCase().split('@');
  const userPrefix = parts[0];
  const domain = parts[1];

  if (TYPO_DOMAINS[domain]) {
    return {
      valid: false,
      message: `Did you mean '${userPrefix}@${TYPO_DOMAINS[domain]}'? Please check your email spelling.`
    };
  }

  if (domain === 'localhost' || domain.endsWith('.local') || domain === 'example.com') {
    return { valid: true };
  }

  try {
    const mxRecords = await dns.promises.resolveMx(domain).catch(() => null);
    if (mxRecords && mxRecords.length > 0) {
      return { valid: true };
    }

    const aRecords = await dns.promises.resolve(domain).catch(() => null);
    if (aRecords && aRecords.length > 0) {
      return { valid: true };
    }

    return { valid: false, message: `The email domain '@${domain}' does not exist or cannot receive emails.` };
  } catch (e) {
    return { valid: false, message: `The email domain '@${domain}' could not be verified.` };
  }
};

export const validatePhoneNumber = (phone?: string, countryCode: string = '+91'): { valid: boolean; message?: string } => {
  if (!phone || !phone.trim()) return { valid: true };

  const raw = phone.trim();
  if (raw.includes('@') || /[a-zA-Z]/.test(raw)) {
    return { valid: false, message: 'Phone field cannot contain letters or email addresses.' };
  }

  const clean = raw.replace(/\D/g, '');

  if (clean.length !== 10 && (clean.length < 7 || clean.length > 15)) {
    return { valid: false, message: 'Invalid mobile number. Please enter a valid 10-digit mobile number.' };
  }

  return { valid: true };
};

export const validatePasswordComplexity = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 8 || password.length > 16) {
    return { valid: false, message: 'Password must be between 8 and 16 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase capital letter (A-Z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (e.g. @, #, $, %, !).' };
  }
  return { valid: true };
};

const parseCapabilities = (cap: any): string[] => {
  if (Array.isArray(cap)) return cap;
  if (typeof cap === 'string') {
    if (cap === 'both') return ['client', 'freelancer'];
    if (cap === 'client') return ['client'];
    if (cap === 'freelancer') return ['freelancer'];
    try {
      const parsed = JSON.parse(cap);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
  }
  return ['client'];
};

const generateToken = (user: any) => {
  const caps = parseCapabilities(user.capabilities);
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      activeMode: user.activeMode,
      activeWorkType: user.activeWorkType || 'both',
      capabilities: caps,
      isAdmin: user.isAdmin
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const safeUser = (user: any) => {
  const caps = parseCapabilities(user.capabilities);
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    profilePhoto: user.profilePhoto,
    bio: user.bio,
    location: user.location,
    country: user.country,
    state: user.state,
    city: user.city,
    area: user.area,
    latitude: user.latitude,
    longitude: user.longitude,
    serviceRadius: user.serviceRadius,
    activeMode: user.activeMode,
    capabilities: caps,
    clientWorkPreference: user.clientWorkPreference || 'both',
    freelancerWorkPreference: user.freelancerWorkPreference || 'both',
    activeWorkType: user.activeWorkType || 'both',
    emailVerified: user.emailVerified ?? true,
    phoneVerified: user.phoneVerified ?? false,
    identityVerified: user.identityVerified ?? false,
    skillVerified: user.skillVerified ?? false,
    localWorkerVerified: user.localWorkerVerified ?? false,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    profileComplete: user.profileComplete || 0,
    createdAt: user.createdAt,
    profile: user.profile || null
  };
};

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      roleSelection, // 'client' | 'freelancer' | 'both'
      clientWorkPreference = 'both',
      freelancerWorkPreference = 'both',
      profilePhoto,
      // Optional profile setup fields
      skills,
      hourlyRate,
      projectRate,
      portfolio,
      serviceCategory,
      city,
      state,
      country,
      area,
      serviceRadius,
      preferredCategories,
      hiringFrequency,
      preferredBudget,
      workingHours,
      deliveryCapacity,
      languages
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Clean phone number if email was accidentally autofilled into phone
    let cleanedPhone = phone ? String(phone).trim() : '';
    if (cleanedPhone.includes('@')) {
      return res.status(400).json({ message: 'Phone field contains an email address. Please place your email address in the Email field.' });
    }

    // Strict Email Format & DNS Domain Existence Check
    const emailCheck = await validateEmailExistence(email.trim());
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    // Strict Phone Number Check (Indian 10-digit mobile check / International format)
    const phoneCheck = validatePhoneNumber(phone);
    if (!phoneCheck.valid) {
      return res.status(400).json({ message: phoneCheck.message });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const passCheck = validatePasswordComplexity(password);
    if (!passCheck.valid) {
      return res.status(400).json({ message: passCheck.message });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const caps = roleSelection === 'both'
      ? ['client', 'freelancer']
      : roleSelection === 'freelancer'
      ? ['freelancer']
      : ['client'];

    const initialMode = caps.includes('client') ? 'client' : 'freelancer';
    const activeWork = roleSelection === 'freelancer' ? freelancerWorkPreference : clientWorkPreference;

    let locationStr = city ? `${city}${state ? ', ' + state : ''}` : null;

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        fullName,
        profilePhoto,
        passwordHash,
        activeMode: initialMode,
        capabilities: JSON.stringify(caps),
        clientWorkPreference,
        freelancerWorkPreference,
        activeWorkType: activeWork,
        city,
        state,
        country,
        area,
        location: locationStr,
        serviceRadius: serviceRadius ? parseFloat(serviceRadius) : 10,
        profileComplete: fullName ? 35 : 20,
        profile: {
          create: {
            skills: skills ? JSON.stringify(Array.isArray(skills) ? skills : [skills]) : null,
            languages: languages ? JSON.stringify(Array.isArray(languages) ? languages : [languages]) : null,
            portfolio: portfolio ? (typeof portfolio === 'string' ? portfolio : JSON.stringify(portfolio)) : null,
            hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
            projectRate: projectRate ? parseFloat(projectRate) : null,
            serviceCategory,
            workingHours,
            deliveryCapacity,
            hiringFrequency,
            preferredBudget,
            preferredCategories: preferredCategories ? JSON.stringify(Array.isArray(preferredCategories) ? preferredCategories : [preferredCategories]) : null,
            serviceRadius: serviceRadius ? parseFloat(serviceRadius) : 10
          }
        }
      },
      include: { profile: true }
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: safeUser(user)
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: safeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(200).json({ message: 'If an account exists, a reset link was sent' });
    }

    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    const { sendPasswordResetEmail } = require('../config/mailer');
    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({ message: 'If an account exists, a reset link was sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null }
    });

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMe = async (req: any, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { profile: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: safeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const switchMode = async (req: any, res: Response): Promise<any> => {
  try {
    const { mode, workType } = req.body;
    const updateData: any = {};

    if (mode) updateData.activeMode = mode;
    if (workType) updateData.activeWorkType = workType;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      include: { profile: true }
    });

    const token = generateToken(user);

    return res.json({ message: 'Mode updated successfully', token, user: safeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePreferences = async (req: any, res: Response): Promise<any> => {
  try {
    const { capabilities, clientWorkPreference, freelancerWorkPreference, activeWorkType } = req.body;
    const updateData: any = {};

    if (capabilities) {
      const caps = Array.isArray(capabilities) ? capabilities : [capabilities];
      updateData.capabilities = JSON.stringify(caps);
    }
    if (clientWorkPreference) updateData.clientWorkPreference = clientWorkPreference;
    if (freelancerWorkPreference) updateData.freelancerWorkPreference = freelancerWorkPreference;
    if (activeWorkType) updateData.activeWorkType = activeWorkType;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      include: { profile: true }
    });

    const token = generateToken(user);

    return res.json({ message: 'Account preferences updated', token, user: safeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfileDetails = async (req: any, res: Response): Promise<any> => {
  try {
    const {
      fullName, bio, phone, city, state, country, area, serviceRadius,
      skills, experience, portfolio, hourlyRate, projectRate, serviceCategory,
      workingHours, deliveryCapacity, hiringFrequency, preferredBudget, preferredCategories
    } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        fullName,
        bio,
        phone,
        city,
        state,
        country,
        area,
        serviceRadius: serviceRadius ? parseFloat(serviceRadius) : undefined,
        location: city ? `${city}${state ? ', ' + state : ''}` : undefined,
        profileComplete: 85,
        profile: {
          upsert: {
            create: {
              skills: skills ? JSON.stringify(Array.isArray(skills) ? skills : [skills]) : undefined,
              hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
              projectRate: projectRate ? parseFloat(projectRate) : undefined,
              serviceCategory,
              workingHours,
              deliveryCapacity,
              hiringFrequency,
              preferredBudget,
              preferredCategories: preferredCategories ? JSON.stringify(Array.isArray(preferredCategories) ? preferredCategories : [preferredCategories]) : undefined
            },
            update: {
              skills: skills ? JSON.stringify(Array.isArray(skills) ? skills : [skills]) : undefined,
              hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
              projectRate: projectRate ? parseFloat(projectRate) : undefined,
              serviceCategory,
              workingHours,
              deliveryCapacity,
              hiringFrequency,
              preferredBudget,
              preferredCategories: preferredCategories ? JSON.stringify(Array.isArray(preferredCategories) ? preferredCategories : [preferredCategories]) : undefined
            }
          }
        }
      },
      include: { profile: true }
    });

    return res.json({ message: 'Profile updated successfully', user: safeUser(user) });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

import { sendEmailOTP, verifyEmailOTP } from '../services/otp.service';

export const handleSendRegistrationOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, phone, countryCode } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address is required' });

    // 1. Email format & domain check
    const emailCheck = await validateEmailExistence(email.trim());
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    // 2. Check if account already exists
    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email address already exists. Please login instead.' });
    }

    // 3. Phone validation if provided
    if (phone) {
      const phoneCheck = validatePhoneNumber(phone, countryCode || '+91');
      if (!phoneCheck.valid) {
        return res.status(400).json({ message: phoneCheck.message });
      }
    }

    // 4. Send Email OTP
    const result = await sendEmailOTP(email.trim());
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: 'Error sending verification code' });
  }
};

export const handleVerifyRegistrationOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and 6-digit verification code are required' });

    const result = verifyEmailOTP(email.trim(), code.trim());
    if (!result.success) return res.status(400).json(result);

    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: 'Error verifying code' });
  }
};
