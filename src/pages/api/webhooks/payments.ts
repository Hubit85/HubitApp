
import { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

function isValidWebhookSecret(receivedSecret: string | string[] | undefined): boolean {
  const expectedSecret = process.env.PAYMENTS_WEBHOOK_SECRET;

  if (process.env.NODE_ENV === 'production' && !expectedSecret) {
    return false;
  }

  if (!expectedSecret) {
    return true;
  }

  if (typeof receivedSecret !== 'string') {
    return false;
  }

  const received = Buffer.from(receivedSecret);
  const expected = Buffer.from(expectedSecret);

  return received.length === expected.length && timingSafeEqual(received, expected);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (!isValidWebhookSecret(req.headers['x-hubit-webhook-secret'])) {
      const status = process.env.PAYMENTS_WEBHOOK_SECRET ? 401 : 503;
      return res.status(status).json({ message: 'Webhook verification failed' });
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
