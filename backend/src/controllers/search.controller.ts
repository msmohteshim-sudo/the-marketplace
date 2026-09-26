import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const globalSearch = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { q, type } = req.query;
    if (!q) return res.json({ results: {} });

    const query = q as string;

    const [services, jobs, ideas, courses] = await Promise.all([
      type === 'services' ? prisma.service.findMany({
        where: {
          status: 'active',
          type: 'digital',
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ]
        },
        include: { seller: { select: { fullName: true, profilePhoto: true } }, packages: { take: 1 } },
        take: 5
      }) : [],

      (!type || type === 'jobs') ? prisma.job.findMany({
        where: {
          status: 'open',
          type: 'digital',
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ]
        },
        include: { client: { select: { fullName: true } } },
        take: 5
      }) : [],

      (!type || type === 'ideas') ? prisma.idea.findMany({
        where: {
          status: 'active',
          OR: [
            { title: { contains: query } },
            { summary: { contains: query } }
          ]
        },
        include: { creator: { select: { fullName: true } } },
        take: 5
      }) : [],

      (!type || type === 'courses') ? prisma.course.findMany({
        where: {
          status: 'published',
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ]
        },
        include: { instructor: { select: { fullName: true } } },
        take: 5
      }) : []
    ]);

    return res.json({
      results: { services, jobs, ideas, courses },
      query
    });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
