
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken, type AuthenticatedRequest } from '@/lib/jwtAuth';
import { stripeService } from '@/services/StripeService';
import { paypalService } from '@/services/PayPalService';


export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { id } = req.query;
        const { amount, reason, provider } = req.body;
        const userId = req.user?.userId;

        let refund;

        if (provider === 'stripe') {
          refund = await stripeService.createRefund(id as string, amount, reason);
        } else if (provider === 'paypal') {
          refund = await paypalService.createRefund(id as string, amount, 'EUR');
        } else {
          return res.status(400).json({ message: 'Invalid payment provider' });
        }

        const refundedPayment = {
          id,
          userId,
          amount: amount || 250.00,
          currency: 'EUR',
          status: 'refunded',
          type: 'service_payment',
          description: 'Payment refunded',
          refundAmount: amount || 250.00,
          refundReason: reason || 'Customer request',
          refundedAt: new Date(),
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Payment refunded successfully',
          payment: refundedPayment,
          refund,
        });
      } catch (error) {
        console.error('Refund payment error:', error);
        res.status(500).json({ 
          message: 'Failed to refund payment',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
