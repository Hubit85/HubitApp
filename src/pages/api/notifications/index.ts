
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

const mockNotifications: any[] = [
  {
    id: 'notif-1',
    userId: '2',
    type: 'quote_received',
    title: 'Nueva cotización recibida',
    message: 'Has recibido una nueva cotización para tu solicitud de reparación de fontanería',
    data: {
      budgetRequestId: 'req-1',
      quoteId: 'quote-1',
      amount: 250
    },
    isRead: false,
    priority: 'medium',
    createdAt: new Date('2024-06-21'),
    readAt: null,
  },
  {
    id: 'notif-2',
    userId: '3',
    type: 'payment_received',
    title: 'Pago recibido',
    message: 'Has recibido un pago de 250€ por el servicio completado',
    data: {
      paymentId: 'pay-1',
      amount: 250,
      currency: 'EUR'
    },
    isRead: true,
    priority: 'high',
    createdAt: new Date('2024-06-20'),
    readAt: new Date('2024-06-20'),
  },
  {
    id: 'notif-3',
    userId: '4',
    type: 'community_announcement',
    title: 'Anuncio de la comunidad',
    message: 'Reunión de propietarios programada para el próximo viernes',
    data: {
      communityId: 'comm-1',
      meetingDate: new Date('2024-07-05')
    },
    isRead: false,
    priority: 'low',
    createdAt: new Date('2024-06-25'),
    readAt: null,
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const { isRead, type, priority } = req.query;

        let filteredNotifications = mockNotifications.filter(notification =>
          notification.userId === userId
        );

        if (isRead !== undefined) {
          filteredNotifications = filteredNotifications.filter(notification =>
            notification.isRead === (isRead === 'true')
          );
        }

        if (type) {
          filteredNotifications = filteredNotifications.filter(notification =>
            notification.type === type
          );
        }

        if (priority) {
          filteredNotifications = filteredNotifications.filter(notification =>
            notification.priority === priority
          );
        }

        filteredNotifications.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        res.status(200).json(filteredNotifications);
      } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const notificationData = req.body;

        const newNotification = {
          id: uuidv4(),
          ...notificationData,
          isRead: false,
          createdAt: new Date(),
          readAt: null,
        };

        mockNotifications.push(newNotification);

        res.status(201).json({
          message: 'Notification created successfully',
          notification: newNotification,
        });
      } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
