
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
        const { amount, currency, description, customerId, paymentMethodId } = req.body;
        const userId = req.user?.userId;

        if (!amount || !currency) {
          return res.status(400).json({ message: 'Amount and currency are required' });
        }

        const paymentIntent = await stripeService.createPaymentIntent({
          amount,
          currency,
          description,
          customerId,
          paymentMethodId,
          metadata: {
            userId: userId!,
            description: description || 'HuBiT Payment',
          },
          automaticPaymentMethods: !paymentMethodId,
        });

        res.status(200).json({
          message: 'Stripe payment intent created successfully',
          paymentIntent,
        });
      } catch (error) {
        console.error('Create Stripe payment intent error:', error);
        res.status(500).json({ 
          message: 'Failed to create payment intent',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
