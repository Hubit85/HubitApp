
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
        const { amount, reason, provider } = req.body;
        const userId = req.user?.userId;

        let refund;

        if (provider === 'stripe') {
          refund = await stripeService.createRefund(id as string, amount, reason);
        } else if (provider === 'paypal') {
          refund = await paypalService.createRefund(id as string, amount, 'EUR');
        } else {
          return res.status(400).json({ message: 'Invalid payment provider' });
        }

        const refundedPayment = {
          id,
          userId,
          amount: amount || 250.00,
          currency: 'EUR',
          status: 'refunded',
          type: 'service_payment',
          description: 'Payment refunded',
          refundAmount: amount || 250.00,
          refundReason: reason || 'Customer request',
          refundedAt: new Date(),
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Payment refunded successfully',
          payment: refundedPayment,
          refund,
        });
      } catch (error) {
        console.error('Refund payment error:', error);
        res.status(500).json({ 
          message: 'Failed to refund payment',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
