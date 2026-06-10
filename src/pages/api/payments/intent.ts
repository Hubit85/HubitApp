
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken, type AuthenticatedRequest } from '@/lib/jwtAuth';
import { v4 as uuidv4 } from 'uuid';


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
