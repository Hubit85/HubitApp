
import { NextApiRequest, NextApiResponse } from 'next';
import { stripeService } from '@/services/StripeService';
import { v4 as uuidv4 } from 'uuid';

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
        const { id } = req.query;
        const { paymentMethodId, provider } = req.body;
        const userId = req.user?.userId;

        if (!paymentMethodId) {
          return res.status(400).json({ message: 'Payment method ID is required' });
        }

        let paymentIntent;

        if (provider === 'stripe') {
          paymentIntent = await stripeService.createPaymentIntent({
            amount: 302.50,
            currency: 'EUR',
            paymentMethodId,
            description: `Payment for invoice ${id}`,
            metadata: {
              invoiceId: id as string,
              userId: userId!,
            },
          });
        }

        const payment = {
          id: uuidv4(),
          userId,
          amount: 302.50,
          currency: 'EUR',
          status: 'completed',
          type: 'invoice_payment',
          description: `Payment for invoice ${id}`,
          invoiceId: id,
          paymentMethodId,
          processingFee: 9.08,
          netAmount: 293.42,
          paidAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Invoice paid successfully',
          payment,
          paymentIntent,
        });
      } catch (error) {
        console.error('Pay invoice error:', error);
        res.status(500).json({ 
          message: 'Failed to pay invoice',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
