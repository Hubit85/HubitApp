
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwtToken } from '@/lib/jwtAuth';
import { paypalService } from '@/services/PayPalService';


interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  verifyJwtToken(token, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
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
