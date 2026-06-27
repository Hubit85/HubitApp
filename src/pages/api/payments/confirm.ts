
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { stripeService } from '@/services/StripeService';

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
        const { paymentIntentId, provider } = req.body;
        const userId = req.user?.userId;

        if (!paymentIntentId) {
          return res.status(400).json({ message: 'Payment intent ID is required' });
        }

        if (provider && provider !== 'stripe') {
          return res.status(400).json({ message: 'Invalid payment provider' });
        }

        const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
          return res.status(402).json({
            message: 'Payment has not succeeded',
            payment: paymentIntent,
          });
        }

        const confirmedPayment = {
          id: paymentIntent.id,
          userId,
          paymentIntentId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency.toUpperCase(),
          status: 'completed',
          type: 'service_payment',
          description: 'Pago confirmado exitosamente',
          processingFee: 0,
          netAmount: paymentIntent.amount,
          paidAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Payment confirmed successfully',
          payment: confirmedPayment,
        });
      } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
