
import { NextApiRequest, NextApiResponse } from 'next';
import { paypalService } from '@/services/PayPalService';

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
        const { planId, subscriberEmail, subscriberName } = req.body;

        if (!planId) {
          return res.status(400).json({ message: 'Plan ID is required' });
        }

        const subscription = await paypalService.createSubscription({
          planId,
          subscriberEmail,
          subscriberName,
        });

        const approvalUrl = paypalService.getSubscriptionApprovalUrl(subscription);

        res.status(201).json({
          message: 'PayPal subscription created successfully',
          subscription,
          approvalUrl,
        });
      } catch (error) {
        console.error('Create PayPal subscription error:', error);
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
