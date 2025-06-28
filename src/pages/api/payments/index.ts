
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

const mockPayments: any[] = [
  {
    id: 'pay-1',
    userId: '2',
    amount: 150.00,
    currency: 'EUR',
    status: 'completed',
    type: 'service_payment',
    description: 'Reparación fontanería',
    serviceRequestId: 'req-1',
    paymentMethodId: 'pm-1',
    providerId: '3',
    processingFee: 4.50,
    netAmount: 145.50,
    paidAt: new Date('2024-06-20'),
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: 'pay-2',
    userId: '4',
    amount: 75.00,
    currency: 'EUR',
    status: 'pending',
    type: 'community_fee',
    description: 'Cuota mensual comunidad',
    communityId: 'comm-1',
    paymentMethodId: 'pm-2',
    processingFee: 2.25,
    netAmount: 72.75,
    createdAt: new Date('2024-06-25'),
    updatedAt: new Date('2024-06-25'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const { status, type, startDate, endDate } = req.query;

        let filteredPayments = mockPayments.filter(payment => 
          payment.userId === userId || payment.providerId === userId
        );

        if (status) {
          filteredPayments = filteredPayments.filter(payment => payment.status === status);
        }

        if (type) {
          filteredPayments = filteredPayments.filter(payment => payment.type === type);
        }

        if (startDate) {
          filteredPayments = filteredPayments.filter(payment => 
            new Date(payment.createdAt) >= new Date(startDate as string)
          );
        }

        if (endDate) {
          filteredPayments = filteredPayments.filter(payment => 
            new Date(payment.createdAt) <= new Date(endDate as string)
          );
        }

        res.status(200).json(filteredPayments);
      } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const userId = req.user?.userId;
        const paymentData = req.body;

        const newPayment = {
          id: uuidv4(),
          userId,
          ...paymentData,
          status: 'pending',
          processingFee: paymentData.amount * 0.03,
          netAmount: paymentData.amount * 0.97,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPayments.push(newPayment);

        res.status(201).json({
          message: 'Payment created successfully',
          payment: newPayment,
        });
      } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
