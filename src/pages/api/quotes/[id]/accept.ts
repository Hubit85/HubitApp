
import { NextApiRequest, NextApiResponse } from 'next';

import { authenticateToken } from '@/lib/jwtAuth';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
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
