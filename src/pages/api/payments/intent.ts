
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

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'POST') {
      try {
        const { amount, currency, type, description, paymentMethodId } = req.body;

        if (!amount || !currency || !type || !description || !paymentMethodId) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const paymentIntent = {
          id: `pi_${uuidv4()}`,
          clientSecret: `pi_${uuidv4()}_secret_${Math.random().toString(36).substr(2, 9)}`,
          amount,
          currency,
          status: 'requires_payment_method',
          metadata: {
            type,
            description,
            paymentMethodId,
            userId: req.user?.userId,
          },
        };

        res.status(200).json(paymentIntent);
      } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
