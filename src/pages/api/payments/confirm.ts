
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJwtToken, type JwtAuthenticatedRequest } from '@/lib/jwtAuth';
import { v4 as uuidv4 } from 'uuid';

type AuthenticatedRequest = NextApiRequest & JwtAuthenticatedRequest;

const authenticateToken = authenticateJwtToken;

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'POST') {
      try {
        const { paymentIntentId } = req.body;
        const userId = req.user?.userId;

        if (!paymentIntentId) {
          return res.status(400).json({ message: 'Payment intent ID is required' });
        }

        const confirmedPayment = {
          id: uuidv4(),
          userId,
          paymentIntentId,
          amount: 250.00,
          currency: 'EUR',
          status: 'completed',
          type: 'service_payment',
          description: 'Pago confirmado exitosamente',
          processingFee: 7.50,
          netAmount: 242.50,
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
