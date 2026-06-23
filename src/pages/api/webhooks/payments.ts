
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

function verifyWebhookSecret(req: NextApiRequest, res: NextApiResponse): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  const expectedSecret = process.env.PAYMENTS_WEBHOOK_SECRET;
  if (!expectedSecret) {
    res.status(503).json({ message: 'Payment webhook is not configured' });
    return false;
  }

  const providedSecret = req.headers['x-hubit-webhook-secret'];
  if (providedSecret !== expectedSecret) {
    res.status(401).json({ message: 'Invalid webhook secret' });
    return false;
  }

  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (!verifyWebhookSecret(req, res)) {
      return;
    }

    try {
      const { type, data } = req.body;

      console.log('Payment webhook received:', { type, data });

      switch (type) {
        case 'payment.succeeded':
          console.log('Payment succeeded:', data.paymentId);
          break;

        case 'payment.failed':
          console.log('Payment failed:', data.paymentId, data.error);
          break;

        case 'subscription.created':
          console.log('Subscription created:', data.subscriptionId);
          break;

        case 'subscription.cancelled':
          console.log('Subscription cancelled:', data.subscriptionId);
          break;

        case 'invoice.payment_succeeded':
          console.log('Invoice payment succeeded:', data.invoiceId);
          break;

        case 'invoice.payment_failed':
          console.log('Invoice payment failed:', data.invoiceId);
          break;

        default:
          console.log('Unknown webhook type:', type);
      }

      res.status(200).json({ 
        message: 'Webhook processed successfully',
        eventId: uuidv4(),
        processed: true 
      });
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ message: 'Webhook processing failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
