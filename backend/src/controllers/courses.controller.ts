import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getCourses = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { category, level, search, page = '1', limit = '12' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const where: any = { status: 'published' };
    if (category) where.categoryId = category;
    if (level) where.level = level;
    if (search) where.title = { contains: search as string };

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, fullName: true, profilePhoto: true } },
        category: true,
        _count: { select: { modules: true, enrollments: true } }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { totalStudents: 'desc' }
    });
    const total = await prisma.course.count({ where });
    return res.json({ courses, total });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getCourse = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { include: { profile: true } },
        category: true,
        modules: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } },
        reviews: { include: { reviewer: { select: { fullName: true, profilePhoto: true } } }, take: 5 }
      }
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check enrollment
    let enrollment = null;
    if (req.user) {
      enrollment = await prisma.enrollment.findFirst({
        where: { courseId: id, studentId: req.user.userId }
      });
    }

    return res.json({ course, enrollment });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, description, categoryId, level, price, isFree, tags, hasCertificate } = req.body;

    const course = await prisma.course.create({
      data: {
        instructorId: req.user!.userId,
        title,
        description,
        categoryId,
        level: level || 'beginner',
        price: price ? parseFloat(price) : 0,
        isFree: Boolean(isFree),
        tags: tags ? JSON.stringify(tags) : null,
        hasCertificate: Boolean(hasCertificate)
      }
    });

    return res.status(201).json({ message: 'Course created', course });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existing = await prisma.enrollment.findFirst({
      where: { courseId: id, studentId: req.user!.userId }
    });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: id,
        studentId: req.user!.userId,
        paidPrice: course.isFree ? 0 : course.price
      }
    });

    await prisma.course.update({ where: { id }, data: { totalStudents: { increment: 1 } } });

    return res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const { progress } = req.body;

    const enrollment = await prisma.enrollment.findFirst({
      where: { courseId: id, studentId: req.user!.userId }
    });
    if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });

    const updated = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: Math.min(100, parseInt(progress)),
        completedAt: progress >= 100 ? new Date() : null
      }
    });

    // Issue certificate if completed
    if (progress >= 100) {
      const existing = await prisma.certificate.findUnique({ where: { enrollmentId: enrollment.id } });
      if (!existing) {
        const certNo = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        await prisma.certificate.create({
          data: { enrollmentId: enrollment.id, certificateNo: certNo }
        });
      }
    }

    return res.json({ enrollment: updated });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyCourses = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const taught = await prisma.course.findMany({
      where: { instructorId: req.user!.userId },
      include: { _count: { select: { enrollments: true } } }
    });

    const enrolled = await prisma.enrollment.findMany({
      where: { studentId: req.user!.userId },
      include: { course: { include: { instructor: { select: { fullName: true } } } }, certificate: true }
    });

    return res.json({ taught, enrolled });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
