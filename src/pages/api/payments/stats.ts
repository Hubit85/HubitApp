import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

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

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const stats = {
          totalRevenue: 2450.00,
          totalPayments: 12,
          averagePayment: 204.17,
          refundRate: 0.08,
          topCategories: [
            { category: 'service_payment', amount: 1800.00, count: 8 },
            { category: 'community_fee', amount: 450.00, count: 3 },
            { category: 'subscription', amount: 200.00, count: 1 },
          ],
          monthlyTrend: [
            { month: 'Jan', revenue: 800.00, payments: 4 },
            { month: 'Feb', revenue: 650.00, payments: 3 },
            { month: 'Mar', revenue: 1000.00, payments: 5 },
          ],
          paymentMethods: [
            { method: 'stripe', percentage: 60, amount: 1470.00 },
            { method: 'paypal', percentage: 30, amount: 735.00 },
            { method: 'bank_transfer', percentage: 10, amount: 245.00 },
          ],
        };

        res.status(200).json(stats);
      } catch (error) {
        console.error('Get payment stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
