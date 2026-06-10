
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken, type AuthenticatedRequest } from '@/lib/jwtAuth';
import { paypalService } from '@/services/PayPalService';


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
