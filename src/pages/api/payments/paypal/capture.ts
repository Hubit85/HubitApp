
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJwtToken, type JwtAuthenticatedRequest } from '@/lib/jwtAuth';
import { paypalService } from '@/services/PayPalService';

type AuthenticatedRequest = NextApiRequest & JwtAuthenticatedRequest;

const authenticateToken = authenticateJwtToken;

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
