
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { stripeService } from '@/services/StripeService';
import { paypalService } from '@/services/PayPalService';

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
  authenticateToken(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { id } = req.query;
        const { immediately, provider } = req.body;
        const userId = req.user?.userId;

        if (provider === 'stripe') {
          await stripeService.cancelSubscription(id as string, immediately);
        } else if (provider === 'paypal') {
          await paypalService.cancelSubscription(id as string, 'User requested cancellation');
        }

        const cancelledSubscription = {
          id,
          userId,
          planId: 'plan-premium',
          status: immediately ? 'cancelled' : 'active',
          amount: 29.99,
          currency: 'EUR',
          interval: 'monthly',
          cancelAtPeriodEnd: !immediately,
          cancelledAt: immediately ? new Date() : undefined,
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Subscription cancelled successfully',
          subscription: cancelledSubscription,
        });
      } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ 
          message: 'Failed to cancel subscription',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
