
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

        const publishedRequest = {
          id,
          userId,
          title: 'Reparación fontanería urgente',
          description: 'Fuga en tubería principal del baño',
          category: 'plumbing',
          urgency: 'urgent',
          status: 'published',
          publishedAt: new Date(),
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Budget request published successfully',
          budgetRequest: publishedRequest,
        });
      } catch (error) {
        console.error('Publish budget request error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
