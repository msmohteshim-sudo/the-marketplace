import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const [users, services, jobs, ideas, courses, enrollments] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.job.count(),
      prisma.idea.count(),
      prisma.course.count(),
      prisma.enrollment.count()
    ]);

    return res.json({ stats: { users, services, jobs, ideas, courses, enrollments } });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, fullName: true, email: true, activeMode: true, isAdmin: true, isVerified: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ users });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { isVerified, isAdmin } = req.body;
    const user = await prisma.user.update({
      where: { id: id as string },
      data: { isVerified, isAdmin }
    });
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getReports = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const reports = await prisma.report.findMany({
      include: { reporter: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ reports });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
