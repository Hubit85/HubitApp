
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJwtToken, type JwtAuthenticatedRequest } from '@/lib/jwtAuth';

type AuthenticatedRequest = NextApiRequest & JwtAuthenticatedRequest;

const authenticateToken = authenticateJwtToken;

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'POST') {
      try {
        const { id } = req.query;
        const { reason } = req.body;
        const userId = req.user?.userId;

        const rejectedQuote = {
          id,
          budgetRequestId: 'req-1',
          providerId: '3',
          providerName: 'Servicios Profesionales S.L.',
          providerRating: 4.8,
          amount: 250,
          currency: 'EUR',
          status: 'rejected',
          rejectedAt: new Date(),
          rejectedBy: userId,
          rejectionReason: reason || 'No reason provided',
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Quote rejected successfully',
          quote: rejectedQuote,
        });
      } catch (error) {
        console.error('Reject quote error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
