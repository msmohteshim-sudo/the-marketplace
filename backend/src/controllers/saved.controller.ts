import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getSavedItems = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const saved = await prisma.savedItem.findMany({
      where: { userId: req.user!.userId },
      include: {
        service: { include: { seller: { select: { fullName: true } }, packages: { take: 1 } } },
        job: { include: { client: { select: { fullName: true } } } },
        idea: { include: { creator: { select: { fullName: true } } } },
        course: { include: { instructor: { select: { fullName: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ saved });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const saveItem = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { entityType, entityId } = req.body;
    const data: any = {
      userId: req.user!.userId,
      entityType,
      entityId
    };
    if (entityType === 'service') data.serviceId = entityId;
    if (entityType === 'job') data.jobId = entityId;
    if (entityType === 'idea') data.ideaId = entityId;
    if (entityType === 'course') data.courseId = entityId;

    const saved = await prisma.savedItem.create({ data });
    return res.status(201).json({ saved });
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(400).json({ message: 'Already saved' });
    return res.status(500).json({ message: 'Server error' });
  }
};

export const unsaveItem = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { entityType, entityId } = req.params;
    await prisma.savedItem.deleteMany({
      where: { userId: req.user!.userId, entityType: entityType as string, entityId: entityId as string }
    });
    return res.json({ message: 'Removed from saved' });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
