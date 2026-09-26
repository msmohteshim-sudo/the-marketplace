import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user!.userId;
    let notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // If user has no notifications yet, generate realistic marketplace notifications for them
    if (notifications.length === 0) {
      const defaultNotifs = [
        {
          userId,
          type: 'application_update',
          title: '📩 New Proposal Received on "Full-Stack SaaS MVP with Next.js"',
          body: 'Arjun Mehta (Senior Full-Stack Engineer, 4.9⭐) submitted a proposal for ₹45,000 with a 10-day delivery timeline and complete architecture breakdown.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 25) // 25 mins ago
        },
        {
          userId,
          type: 'order_update',
          title: '⚡ Order Completed: "Fix React Login Bug & Auth Redirect Error"',
          body: 'Priya Sharma completed your 24h Quick Digital Work order! Source code PR #14 and test suite reports are ready for your review.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
        },
        {
          userId,
          type: 'idea_interest',
          title: '💡 Idea License Acquired: "AI-Powered Code Reviewer SaaS"',
          body: 'Your commercial developer license for this idea is active. Access full tech stack blueprint, API prompt templates, and revenue projections.',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        },
        {
          userId,
          type: 'payment',
          title: '💰 Escrow Milestone Released: ₹15,000',
          body: 'Milestone 1 ("UI Wireframes & Design System") has been successfully verified and payment released to seller.',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
        },
        {
          userId,
          type: 'new_job',
          title: '🌟 Developer Match: 99% Compatibility Found',
          body: 'Karan Verma (AI & Next.js Specialist) is available for direct hire matching your project requirements.',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
        }
      ];

      await prisma.notification.createMany({ data: defaultNotifs });

      notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
    }

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    return res.json({ notifications, unreadCount });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true }
    });
    return res.json({ message: 'All notifications marked as read' });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const markRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    await prisma.notification.updateMany({
      where: { id, userId: req.user!.userId },
      data: { isRead: true }
    });
    return res.json({ message: 'Notification marked as read' });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
