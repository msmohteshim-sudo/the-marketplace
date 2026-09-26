import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendPhoneOTP, verifyPhoneOTP } from '../services/otp.service';
import { lookupIndianPincode } from '../services/pincode.service';
import { parseResumeText } from '../services/resumeParser.service';

const safeJsonArr = (val: any) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return [val];
  }
};

// Helper function to calculate dynamic completion percentage and checklist
export const calculateProfileCompletion = (user: any, profile: any) => {
  const caps = safeJsonArr(user.capabilities);
  const isFreelancer = caps.includes('freelancer') || user.activeMode === 'freelancer';
  const isClient = caps.includes('client') || user.activeMode === 'client';

  const checklist: { id: string; label: string; completed: boolean; required: boolean }[] = [
    { id: 'username', label: 'Username', completed: Boolean(user.email || user.fullName), required: true },
    { id: 'email', label: 'Email Verification', completed: Boolean(user.emailVerified), required: true },
    { id: 'basic', label: 'Basic Profile (Name & Photo)', completed: Boolean(user.fullName && user.profilePhoto), required: true },
    { id: 'phone', label: 'Phone Verification', completed: Boolean(user.phoneVerified && user.phone), required: true },
    { id: 'location', label: 'Location & PIN Code', completed: Boolean(user.location || user.pincode), required: true }
  ];

  if (isFreelancer) {
    checklist.push(
      { id: 'title', label: 'Professional Title', completed: Boolean(profile?.professionalTitle), required: true },
      { id: 'bio', label: 'Professional Summary', completed: Boolean(user.bio), required: true },
      { id: 'skills', label: 'Skills Showcase', completed: Boolean(profile?.skills && safeJsonArr(profile.skills).length > 0), required: true },
      { id: 'resume', label: 'Professional Resume', completed: Boolean(profile?.resumeUrl || profile?.resumeName), required: false },
      { id: 'portfolio', label: 'Portfolio Projects', completed: Boolean(profile?.portfolio && safeJsonArr(profile.portfolio).length > 0), required: false },
      { id: 'availability', label: 'Availability Status', completed: Boolean(profile?.availability), required: false }
    );
  }

  if (isClient) {
    checklist.push(
      { id: 'clientType', label: 'Client / Organization Type', completed: Boolean(profile?.clientType), required: false }
    );
  }

  const completedCount = checklist.filter(c => c.completed).length;
  const percentage = Math.min(100, Math.round((completedCount / checklist.length) * 100));

  return { percentage, checklist };
};

// GET /api/profiles/me
export const getProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    let user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { profile: true }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Auto-create profile record if missing
    if (!user.profile) {
      const newProfile = await prisma.profile.create({
        data: { userId: user.id, availability: 'available', clientType: 'Individual' }
      });
      user = { ...user, profile: newProfile };
    }

    const { percentage, checklist } = calculateProfileCompletion(user, user.profile);

    // Update DB if completion percentage changed
    if (user.profileComplete !== percentage) {
      await prisma.user.update({
        where: { id: user.id },
        data: { profileComplete: percentage }
      });
      user.profileComplete = percentage;
    }

    return res.json({ user, completion: { percentage, checklist } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profiles/me
export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      fullName, bio, location, country, state, district, city, area, locality, pincode,
      latitude, longitude, serviceRadius, profilePhoto, phoneVisibility, profileVisibility, resumeVisibility,
      profile
    } = req.body;

    const userUpdateData: any = {};
    if (fullName !== undefined) userUpdateData.fullName = fullName;
    if (bio !== undefined) userUpdateData.bio = bio;
    if (location !== undefined) userUpdateData.location = location;
    if (country !== undefined) userUpdateData.country = country;
    if (state !== undefined) userUpdateData.state = state;
    if (district !== undefined) userUpdateData.district = district;
    if (city !== undefined) userUpdateData.city = city;
    if (area !== undefined) userUpdateData.area = area;
    if (locality !== undefined) userUpdateData.locality = locality;
    if (pincode !== undefined) userUpdateData.pincode = pincode;
    if (latitude !== undefined) userUpdateData.latitude = latitude;
    if (longitude !== undefined) userUpdateData.longitude = longitude;
    if (serviceRadius !== undefined) userUpdateData.serviceRadius = serviceRadius;
    if (profilePhoto !== undefined) userUpdateData.profilePhoto = profilePhoto;
    if (phoneVisibility !== undefined) userUpdateData.phoneVisibility = phoneVisibility;
    if (profileVisibility !== undefined) userUpdateData.profileVisibility = profileVisibility;
    if (resumeVisibility !== undefined) userUpdateData.resumeVisibility = resumeVisibility;

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: userUpdateData,
      include: { profile: true }
    });

    if (profile) {
      const profileUpdateData: any = {};
      if (profile.professionalTitle !== undefined) profileUpdateData.professionalTitle = profile.professionalTitle;
      if (profile.clientType !== undefined) profileUpdateData.clientType = profile.clientType;
      if (profile.companyName !== undefined) profileUpdateData.companyName = profile.companyName;
      if (profile.industry !== undefined) profileUpdateData.industry = profile.industry;
      if (profile.hourlyRate !== undefined) profileUpdateData.hourlyRate = profile.hourlyRate;
      if (profile.projectRate !== undefined) profileUpdateData.projectRate = profile.projectRate;
      if (profile.availability !== undefined) profileUpdateData.availability = profile.availability;
      if (profile.serviceRadius !== undefined) profileUpdateData.serviceRadius = profile.serviceRadius;

      if (profile.skills !== undefined) profileUpdateData.skills = typeof profile.skills === 'string' ? profile.skills : JSON.stringify(profile.skills);
      if (profile.primarySkills !== undefined) profileUpdateData.primarySkills = typeof profile.primarySkills === 'string' ? profile.primarySkills : JSON.stringify(profile.primarySkills);
      if (profile.secondarySkills !== undefined) profileUpdateData.secondarySkills = typeof profile.secondarySkills === 'string' ? profile.secondarySkills : JSON.stringify(profile.secondarySkills);
      if (profile.experience !== undefined) profileUpdateData.experience = typeof profile.experience === 'string' ? profile.experience : JSON.stringify(profile.experience);
      if (profile.education !== undefined) profileUpdateData.education = typeof profile.education === 'string' ? profile.education : JSON.stringify(profile.education);
      if (profile.languages !== undefined) profileUpdateData.languages = typeof profile.languages === 'string' ? profile.languages : JSON.stringify(profile.languages);
      if (profile.portfolio !== undefined) profileUpdateData.portfolio = typeof profile.portfolio === 'string' ? profile.portfolio : JSON.stringify(profile.portfolio);
      if (profile.certifications !== undefined) profileUpdateData.certifications = typeof profile.certifications === 'string' ? profile.certifications : JSON.stringify(profile.certifications);

      await prisma.profile.upsert({
        where: { userId: req.user!.userId },
        update: profileUpdateData,
        create: { userId: req.user!.userId, ...profileUpdateData }
      });
    }

    // Refresh updated user & profile
    const refreshed = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { profile: true }
    });

    const { percentage, checklist } = calculateProfileCompletion(refreshed, refreshed?.profile);

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { profileComplete: percentage }
    });

    return res.json({
      message: 'Profile updated successfully',
      user: { ...refreshed, profileComplete: percentage },
      completion: { percentage, checklist }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/profiles/phone/send-otp
export const handleSendPhoneOTP = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { phone, countryCode } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const result = sendPhoneOTP(req.user!.userId, phone, countryCode || '+91');
    if (!result.success) return res.status(400).json(result);

    // Store phone number on user (unverified until OTP)
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { phone, phoneCountryCode: countryCode || '+91', phoneVerified: false }
    });

    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: 'Server error sending OTP' });
  }
};

// POST /api/profiles/phone/verify-otp
export const handleVerifyPhoneOTP = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'Phone number and 6-digit OTP code are required' });

    const result = verifyPhoneOTP(req.user!.userId, phone, otp);
    if (!result.success) return res.status(400).json(result);

    const now = new Date();
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { phoneVerified: true, phoneVerifiedAt: now },
      include: { profile: true }
    });

    const { percentage, checklist } = calculateProfileCompletion(updatedUser, updatedUser.profile);
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { profileComplete: percentage }
    });

    return res.json({
      message: 'Phone number verified successfully!',
      phoneVerified: true,
      phoneVerifiedAt: now,
      completion: { percentage, checklist }
    });
  } catch (e) {
    return res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// GET /api/profiles/pincode-lookup?pincode=413512
export const handlePincodeLookup = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const pincode = req.query.pincode as string;
    const result = await lookupIndianPincode(pincode);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: 'Error querying PIN code' });
  }
};

// POST /api/profiles/resume
export const handleUploadResume = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { resumeUrl, resumeName, rawText } = req.body;
    if (!resumeName) return res.status(400).json({ message: 'Resume filename is required' });

    const fileName = resumeName;
    const fileUrl = resumeUrl || `https://themarketplace.storage/resumes/${req.user!.userId}_${fileName}`;
    const uploadedAt = new Date();

    // Auto-parse text details if provided
    let parsedData = null;
    if (rawText) {
      parsedData = parseResumeText(rawText, fileName);
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: req.user!.userId },
      update: {
        resumeUrl: fileUrl,
        resumeName: fileName,
        resumeUploadedAt: uploadedAt,
        resumeParsedData: parsedData ? JSON.stringify(parsedData) : undefined
      },
      create: {
        userId: req.user!.userId,
        resumeUrl: fileUrl,
        resumeName: fileName,
        resumeUploadedAt: uploadedAt,
        resumeParsedData: parsedData ? JSON.stringify(parsedData) : undefined
      }
    });

    return res.json({
      message: 'Resume uploaded successfully',
      profile: updatedProfile,
      parsedData
    });
  } catch (e) {
    return res.status(500).json({ message: 'Server error uploading resume' });
  }
};

// DELETE /api/profiles/resume
export const handleDeleteResume = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    await prisma.profile.update({
      where: { userId: req.user!.userId },
      data: {
        resumeUrl: null,
        resumeName: null,
        resumeUploadedAt: null,
        resumeParsedData: null
      }
    });
    return res.json({ message: 'Resume deleted successfully' });
  } catch (e) {
    return res.status(500).json({ message: 'Server error deleting resume' });
  }
};

// POST /api/profiles/resume/parse
export const handleParseResume = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { text, fileName } = req.body;
    const parsed = parseResumeText(text || '', fileName || 'Resume.pdf');
    return res.json({ parsed });
  } catch (e) {
    return res.status(500).json({ message: 'Server error parsing resume' });
  }
};

// GET /api/profiles/:id (Public Profile View)
export const getPublicProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        services: { where: { status: 'active' }, take: 6 },
        ideas: { where: { status: 'active' }, take: 4 },
        courses_taught: { where: { status: 'published' }, take: 4 }
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Enforce strict privacy checks
    if (user.profileVisibility === 'private' && req.user?.userId !== id) {
      return res.status(403).json({ message: 'This user profile is private.' });
    }

    // Omit sensitive private credentials & private files
    const { passwordHash, resetToken, resetTokenExpiry, ...publicUser } = user as any;

    if (publicUser.phoneVisibility === 'private' && req.user?.userId !== id) {
      publicUser.phone = null;
      publicUser.secondaryPhone = null;
    }

    if (publicUser.resumeVisibility === 'private' && req.user?.userId !== id && publicUser.profile) {
      publicUser.profile.resumeUrl = null;
    }

    return res.json({ user: publicUser });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
