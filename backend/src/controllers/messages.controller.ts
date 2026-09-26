import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getMessages = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const myId = req.user!.userId;
    // Get distinct conversations
    const sent = await prisma.message.findMany({
      where: { senderId: myId },
      select: { receiverId: true },
      distinct: ['receiverId']
    });
    const recv = await prisma.message.findMany({
      where: { receiverId: myId },
      select: { senderId: true },
      distinct: ['senderId']
    });

    const partnerIds = [...new Set([...sent.map(m => m.receiverId), ...recv.map(m => m.senderId)])];

    const conversations = await Promise.all(partnerIds.map(async (partnerId) => {
      const partner = await prisma.user.findUnique({
        where: { id: partnerId },
        select: { id: true, fullName: true, profilePhoto: true }
      });
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: myId, receiverId: partnerId },
            { senderId: partnerId, receiverId: myId }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
      const unread = await prisma.message.count({
        where: { senderId: partnerId, receiverId: myId, isRead: false }
      });
      return { partner, lastMessage, unread };
    }));

    return res.json({ conversations });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const partnerId = req.params.partnerId as string;
    const myId = req.user!.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: partnerId },
          { senderId: partnerId, receiverId: myId }
        ]
      },
      include: {
        sender: { select: { id: true, fullName: true, profilePhoto: true } }
      },
      orderBy: { createdAt: 'asc' },
      take: 100
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: { senderId: partnerId, receiverId: myId, isRead: false },
      data: { isRead: true }
    });

    return res.json({ messages });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { receiverId, content, type, contextType, contextId } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.user!.userId,
        receiverId,
        content,
        type: type || 'text',
        contextType,
        contextId
      },
      include: {
        sender: { select: { id: true, fullName: true, profilePhoto: true } }
      }
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        body: `You have a new message`,
        link: `/messages`
      }
    });

    return res.status(201).json({ message: message });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
