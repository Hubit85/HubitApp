
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJwtToken, type JwtAuthenticatedRequest } from '@/lib/jwtAuth';
import { stripeService } from '@/services/StripeService';

type AuthenticatedRequest = NextApiRequest & JwtAuthenticatedRequest;

const authenticateToken = authenticateJwtToken;

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { customerId, priceId, paymentMethodId } = req.body;
        const userId = req.user?.userId;

        if (!customerId || !priceId) {
          return res.status(400).json({ message: 'Customer ID and price ID are required' });
        }

        const subscription = await stripeService.createSubscription({
          customerId,
          priceId,
          paymentMethodId,
          metadata: {
            userId: userId!,
          },
        });

        res.status(201).json({
          message: 'Stripe subscription created successfully',
          subscription,
        });
      } catch (error) {
        console.error('Create Stripe subscription error:', error);
        res.status(500).json({ 
          message: 'Failed to create subscription',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
