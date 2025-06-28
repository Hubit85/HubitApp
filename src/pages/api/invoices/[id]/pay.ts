
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { stripeService } from '@/services/StripeService';
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

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { id } = req.query;
        const { paymentMethodId, provider } = req.body;
        const userId = req.user?.userId;

        if (!paymentMethodId) {
          return res.status(400).json({ message: 'Payment method ID is required' });
        }

        let paymentIntent;

        if (provider === 'stripe') {
          paymentIntent = await stripeService.createPaymentIntent({
            amount: 302.50,
            currency: 'EUR',
            paymentMethodId,
            description: `Payment for invoice ${id}`,
            metadata: {
              invoiceId: id as string,
              userId: userId!,
            },
          });
        }

        const payment = {
          id: uuidv4(),
          userId,
          amount: 302.50,
          currency: 'EUR',
          status: 'completed',
          type: 'invoice_payment',
          description: `Payment for invoice ${id}`,
          invoiceId: id,
          paymentMethodId,
          processingFee: 9.08,
          netAmount: 293.42,
          paidAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Invoice paid successfully',
          payment,
          paymentIntent,
        });
      } catch (error) {
        console.error('Pay invoice error:', error);
        res.status(500).json({ 
          message: 'Failed to pay invoice',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
