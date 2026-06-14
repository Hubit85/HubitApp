
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
        const { amount, currency, description, returnUrl, cancelUrl } = req.body;

        if (!amount || !currency) {
          return res.status(400).json({ message: 'Amount and currency are required' });
        }

        const order = await paypalService.createOrder({
          amount,
          currency,
          description,
          returnUrl,
          cancelUrl,
        });

        const approvalUrl = paypalService.getApprovalUrl(order);

        res.status(201).json({
          message: 'PayPal order created successfully',
          order,
          approvalUrl,
        });
      } catch (error) {
        console.error('Create PayPal order error:', error);
        res.status(500).json({ 
          message: 'Failed to create PayPal order',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else if (req.method === 'GET') {
      try {
        const { orderId } = req.query;

        if (!orderId) {
          return res.status(400).json({ message: 'Order ID is required' });
        }

        const order = await paypalService.getOrder(orderId as string);

        res.status(200).json({
          message: 'PayPal order retrieved successfully',
          order,
        });
      } catch (error) {
        console.error('Get PayPal order error:', error);
        res.status(500).json({ 
          message: 'Failed to retrieve PayPal order',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
