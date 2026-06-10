
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken, type AuthenticatedRequest } from '@/lib/jwtAuth';
import { stripeService } from '@/services/StripeService';


export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { name } = req.body;
        const userEmail = req.user?.email;
        const userId = req.user?.userId;

        if (!userEmail) {
          return res.status(400).json({ message: 'User email is required' });
        }

        const customer = await stripeService.createCustomer({
          email: userEmail,
          name,
          metadata: {
            userId: userId!,
          },
        });

        res.status(201).json({
          message: 'Stripe customer created successfully',
          customer,
        });
      } catch (error) {
        console.error('Create Stripe customer error:', error);
        res.status(500).json({ 
          message: 'Failed to create customer',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else if (req.method === 'GET') {
      try {
        const { customerId } = req.query;

        if (!customerId) {
          return res.status(400).json({ message: 'Customer ID is required' });
        }

        const customer = await stripeService.getCustomer(customerId as string);

        res.status(200).json({
          message: 'Stripe customer retrieved successfully',
          customer,
        });
      } catch (error) {
        console.error('Get Stripe customer error:', error);
        res.status(500).json({ 
          message: 'Failed to retrieve customer',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
