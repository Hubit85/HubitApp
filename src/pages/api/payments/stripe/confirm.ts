
import { NextApiRequest, NextApiResponse } from 'next';
import { stripeService } from '@/services/StripeService';

import { authenticateToken } from '@/lib/jwtAuth';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { paymentIntentId, paymentMethodId } = req.body;

        if (!paymentIntentId) {
          return res.status(400).json({ message: 'Payment intent ID is required' });
        }

        const confirmedPayment = await stripeService.confirmPaymentIntent(
          paymentIntentId,
          paymentMethodId
        );

        res.status(200).json({
          message: 'Stripe payment confirmed successfully',
          payment: confirmedPayment,
        });
      } catch (error) {
        console.error('Confirm Stripe payment error:', error);
        res.status(500).json({ 
          message: 'Failed to confirm payment',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
