
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
        const { orderId } = req.body;

        if (!orderId) {
          return res.status(400).json({ message: 'Order ID is required' });
        }

        const capture = await paypalService.captureOrder(orderId);

        res.status(200).json({
          message: 'PayPal order captured successfully',
          capture,
        });
      } catch (error) {
        console.error('Capture PayPal order error:', error);
        res.status(500).json({ 
          message: 'Failed to capture PayPal order',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
