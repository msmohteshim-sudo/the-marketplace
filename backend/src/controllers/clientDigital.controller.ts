import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Get Client Digital Dashboard summary metrics for logged in client
 */
export const getClientDigitalSummary = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;

    const [activeProjects, openProposals, savedItems, purchasedIdeas] = await Promise.all([
      // Active orders or active jobs as client
      prisma.order.count({
        where: {
          buyerId: userId,
          status: { in: ['pending', 'accepted', 'in_progress', 'revision'] }
        }
      }),
      // Proposals received on jobs posted by this client
      prisma.application.count({
        where: {
          job: { clientId: userId },
          status: 'pending'
        }
      }),
      // Total saved items by client
      prisma.savedItem.count({
        where: { userId }
      }),
      // Total ideas purchased by client
      prisma.ideaLicense.count({
        where: { buyerId: userId }
      })
    ]);

    return res.json({
      summary: {
        activeProjects,
        openProposals,
        savedItems,
        purchasedIdeas
      }
    });
  } catch (error) {
    console.error('Error fetching client digital summary:', error);
    return res.status(500).json({ message: 'Server error fetching summary' });
  }
};

/**
 * Get Quick Digital Work (Services with delivery time <= 24 hours or quick digital tags)
 */
export const getQuickServices = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      search,
      category,
      deliveryTime, // 'under_2h', 'under_6h', 'under_12h', 'under_24h'
      minPrice,
      maxPrice,
      rating,
      availability, // 'available_now', 'available_today'
      sort = 'recommended',
      page = '1',
      limit = '12'
    } = req.query;

    const where: any = {
      status: 'active',
      type: 'digital'
    };

    // Filter by delivery time (quick work <= 24 hours)
    if (deliveryTime === 'under_2h') {
      where.deliveryTime = { lte: 1 }; // <= 1 day or express
    } else if (deliveryTime === 'under_6h') {
      where.deliveryTime = { lte: 1 };
    } else if (deliveryTime === 'under_12h') {
      where.deliveryTime = { lte: 1 };
    } else {
      where.deliveryTime = { lte: 1 }; // Default quick work <= 1 day
    }

    if (category) {
      where.categoryId = category as string;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
        { tags: { contains: search as string } }
      ];
    }

    if (rating) {
      where.totalRating = { gte: parseFloat(rating as string) };
    }

    // Query services with packages & seller details
    let services = await prisma.service.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            profilePhoto: true,
            location: true,
            isVerified: true,
            profile: {
              select: {
                totalRating: true,
                ratingCount: true,
                availability: true
              }
            }
          }
        },
        packages: { orderBy: { price: 'asc' } },
        category: true
      },
      orderBy:
        sort === 'newest'
          ? { createdAt: 'desc' }
          : sort === 'top_rated'
          ? { totalRating: 'desc' }
          : sort === 'fastest'
          ? { deliveryTime: 'asc' }
          : { totalOrders: 'desc' }
    });

    // Post-filter by price range if packages exist
    if (minPrice || maxPrice) {
      const minP = minPrice ? parseFloat(minPrice as string) : 0;
      const maxP = maxPrice ? parseFloat(maxPrice as string) : Infinity;

      services = services.filter(service => {
        const lowestPkgPrice = service.packages[0]?.price || 0;
        return lowestPkgPrice >= minP && lowestPkgPrice <= maxP;
      });
    }

    if (sort === 'lowest_price') {
      services.sort((a, b) => (a.packages[0]?.price || 0) - (b.packages[0]?.price || 0));
    }

    const total = services.length;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const paginatedServices = services.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      services: paginatedServices,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Error fetching quick services:', error);
    return res.status(500).json({ message: 'Server error fetching quick services' });
  }
};

/**
 * Get Digital Projects & Tasks (>24h digital jobs)
 */
export const getDigitalProjects = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      search,
      category,
      minBudget,
      maxBudget,
      duration, // '1-3_days', '3-7_days', '1-2_weeks', '2-4_weeks', '1_month'
      experience,
      projectType, // 'fixed', 'milestone', 'hourly'
      postedDate, // 'today', '3_days', '7_days', '30_days'
      sort = 'newest',
      page = '1',
      limit = '10'
    } = req.query;

    const where: any = {
      status: 'open',
      type: 'digital'
    };

    if (category) {
      where.categoryId = category as string;
    }

    if (duration) {
      where.duration = duration as string;
    }

    if (projectType) {
      where.paymentType = projectType as string;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
        { skills: { contains: search as string } }
      ];
    }

    if (minBudget || maxBudget) {
      if (minBudget) where.budgetMin = { gte: parseFloat(minBudget as string) };
      if (maxBudget) where.budgetMax = { lte: parseFloat(maxBudget as string) };
    }

    if (postedDate) {
      const now = new Date();
      let days = 30;
      if (postedDate === 'today') days = 1;
      else if (postedDate === '3_days') days = 3;
      else if (postedDate === '7_days') days = 7;

      const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: pastDate };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const projects = await prisma.job.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            profilePhoto: true,
            isVerified: true
          }
        },
        category: true,
        _count: {
          select: { applications: true }
        }
      },
      skip,
      take: limitNum,
      orderBy:
        sort === 'budget_high'
          ? { budgetMax: 'desc' }
          : sort === 'budget_low'
          ? { budgetMin: 'asc' }
          : { createdAt: 'desc' }
    });

    const total = await prisma.job.count({ where });

    return res.json({
      projects,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Error fetching digital projects:', error);
    return res.status(500).json({ message: 'Server error fetching digital projects' });
  }
};

/**
 * Get Ideas Marketplace with comprehensive digital business model / dev cost / industry filters
 */
export const getDigitalIdeas = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      businessModel,
      devCost,
      ideaType,
      verified,
      sort = 'newest',
      page = '1',
      limit = '12'
    } = req.query;

    const where: any = {
      status: 'active'
    };

    if (category) {
      where.categoryId = category as string;
    }

    if (businessModel) {
      where.businessModel = { contains: businessModel as string };
    }

    if (verified === 'true') {
      where.isVerified = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { summary: { contains: search as string } },
        { tags: { contains: search as string } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const ideas = await prisma.idea.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            profilePhoto: true,
            isVerified: true
          }
        },
        category: true,
        _count: {
          select: { licenses: true }
        }
      },
      skip,
      take: limitNum,
      orderBy:
        sort === 'lowest_price'
          ? { price: 'asc' }
          : sort === 'most_popular'
          ? { views: 'desc' }
          : { createdAt: 'desc' }
    });

    const total = await prisma.idea.count({ where });

    return res.json({
      ideas,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Error fetching digital ideas:', error);
    return res.status(500).json({ message: 'Server error fetching digital ideas' });
  }
};

/**
 * Get Ideas Purchased by Logged In Client
 */
export const getPurchasedIdeas = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;

    const licenses = await prisma.ideaLicense.findMany({
      where: { buyerId: userId },
      include: {
        idea: {
          include: {
            creator: {
              select: { id: true, fullName: true, profilePhoto: true }
            },
            category: true
          }
        }
      },
      orderBy: { purchasedAt: 'desc' }
    });

    return res.json({ licenses });
  } catch (error) {
    console.error('Error fetching purchased ideas:', error);
    return res.status(500).json({ message: 'Server error fetching purchased ideas' });
  }
};

/**
 * Get Recommendations for Logged In Client
 */
export const getClientRecommendations = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    // Recommend top rated digital services & featured ideas
    const [recommendedServices, recommendedIdeas] = await Promise.all([
      prisma.service.findMany({
        where: { status: 'active', type: 'digital', isFeatured: true },
        take: 3,
        include: {
          seller: { select: { fullName: true, profilePhoto: true } },
          packages: { take: 1, orderBy: { price: 'asc' } }
        }
      }),
      prisma.idea.findMany({
        where: { status: 'active', isFeatured: true },
        take: 3,
        include: {
          creator: { select: { fullName: true, profilePhoto: true } }
        }
      })
    ]);

    // Fallback if no featured items
    let finalServices = recommendedServices;
    if (finalServices.length === 0) {
      finalServices = await prisma.service.findMany({
        where: { status: 'active', type: 'digital' },
        take: 3,
        orderBy: { totalRating: 'desc' },
        include: {
          seller: { select: { fullName: true, profilePhoto: true } },
          packages: { take: 1, orderBy: { price: 'asc' } }
        }
      });
    }

    return res.json({
      services: finalServices,
      ideas: recommendedIdeas
    });
  } catch (error) {
    console.error('Error fetching client recommendations:', error);
    return res.status(500).json({ message: 'Server error fetching recommendations' });
  }
};

/**
 * Post a new Digital Job as Client
 */
export const postDigitalJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    const {
      title,
      description,
      categoryId,
      skills,
      budgetMin,
      budgetMax,
      paymentType,
      duration,
      experience,
      scheduledDate
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const job = await prisma.job.create({
      data: {
        clientId: userId,
        title,
        description,
        type: 'digital',
        categoryId: categoryId || null,
        skills: skills ? (Array.isArray(skills) ? JSON.stringify(skills) : skills) : null,
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
        paymentType: paymentType || 'fixed',
        duration: duration || '1_week',
        urgency: experience || 'normal',
        scheduledDate: scheduledDate || null,
        status: 'open'
      },
      include: {
        category: true,
        client: { select: { fullName: true } }
      }
    });

    return res.status(201).json({
      message: 'Digital job posted successfully',
      job
    });
  } catch (error) {
    console.error('Error posting digital job:', error);
    return res.status(500).json({ message: 'Server error posting digital job' });
  }
};
