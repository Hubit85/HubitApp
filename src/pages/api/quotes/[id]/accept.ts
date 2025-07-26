
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
    if (req.method === 'POST') {
      try {
        const { id } = req.query;
        const userId = req.user?.userId;

        const acceptedQuote = {
          id,
          budgetRequestId: 'req-1',
          providerId: '3',
          providerName: 'Servicios Profesionales S.L.',
          providerRating: 4.8,
          amount: 250,
          currency: 'EUR',
          status: 'accepted',
          acceptedAt: new Date(),
          acceptedBy: userId,
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Quote accepted successfully',
          quote: acceptedQuote,
        });
      } catch (error) {
        console.error('Accept quote error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
