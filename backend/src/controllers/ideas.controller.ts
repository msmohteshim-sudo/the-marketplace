import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getIdeas = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { category, stage, search, page = '1', limit = '12' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const where: any = { status: 'active' };
    if (category) where.categoryId = category;
    if (stage) where.stage = stage;
    if (search) where.title = { contains: search as string };

    const ideas = await prisma.idea.findMany({
      where,
      include: {
        creator: { select: { id: true, fullName: true, profilePhoto: true } },
        category: true
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.idea.count({ where });
    return res.json({ ideas, total });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getIdea = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const idea = await prisma.idea.findUnique({
      where: { id },
      include: { creator: { include: { profile: true } }, category: true }
    });
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Increment views
    await prisma.idea.update({ where: { id }, data: { views: { increment: 1 } } });

    // Hide sensitive info unless purchased
    const hasLicense = req.user ? await prisma.ideaLicense.findFirst({
      where: { ideaId: id, buyerId: req.user.userId }
    }) : null;
    const isOwner = req.user?.userId === idea.creatorId;

    if (!hasLicense && !isOwner) {
      return res.json({
        idea: {
          ...idea,
          problem: null,
          solution: null,
          businessModel: null,
          targetUsers: idea.targetUsers
        }
      });
    }

    return res.json({ idea });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createIdea = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, summary, problem, solution, targetUsers, businessModel, requiredSkills, stage, tags, categoryId, price, licenseTypes, isNDARequired } = req.body;

    const idea = await prisma.idea.create({
      data: {
        creatorId: req.user!.userId,
        title,
        summary,
        problem,
        solution,
        targetUsers,
        businessModel,
        requiredSkills: requiredSkills ? JSON.stringify(requiredSkills) : null,
        stage,
        tags: tags ? JSON.stringify(tags) : null,
        categoryId,
        price: price ? parseFloat(price) : null,
        licenseTypes: licenseTypes ? JSON.stringify(licenseTypes) : null,
        isNDARequired: Boolean(isNDARequired)
      }
    });

    return res.status(201).json({ message: 'Idea published', idea });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateIdea = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea || idea.creatorId !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await prisma.idea.update({ where: { id }, data: req.body });
    return res.json({ idea: updated });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const purchaseIdeaLicense = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const { licenseType, isExclusive, duration } = req.body;

    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (idea.creatorId === req.user!.userId) return res.status(400).json({ message: 'Cannot buy your own idea' });

    // PAYMENT PROTOTYPE - No real payment processed
    const license = await prisma.ideaLicense.create({
      data: {
        ideaId: id,
        buyerId: req.user!.userId,
        licenseType,
        price: idea.price || 0,
        isExclusive: Boolean(isExclusive),
        duration
      }
    });

    return res.status(201).json({
      message: 'License acquired (PAYMENT PROTOTYPE - No real payment processed)',
      license
    });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyIdeas = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { creatorId: req.user!.userId },
      include: { _count: { select: { licenses: true } } }
    });
    return res.json({ ideas });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
