
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
    const { id } = req.query;
    const userId = req.user?.userId;

    if (req.method === 'PUT') {
      try {
        const { isDefault } = req.body;

        const updatedPaymentMethod = {
          id,
          userId,
          type: 'card',
          provider: 'stripe',
          isDefault: isDefault || false,
          cardLast4: '4242',
          cardBrand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Payment method updated successfully',
          paymentMethod: updatedPaymentMethod,
        });
      } catch (error) {
        console.error('Update payment method error:', error);
        res.status(500).json({ 
          message: 'Failed to update payment method',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else if (req.method === 'DELETE') {
      try {
        await stripeService.detachPaymentMethod(id as string);

        res.status(200).json({
          message: 'Payment method deleted successfully',
        });
      } catch (error) {
        console.error('Delete payment method error:', error);
        res.status(500).json({ 
          message: 'Failed to delete payment method',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
