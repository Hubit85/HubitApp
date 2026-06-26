
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

function isAuthorizedPaymentWebhook(req: NextApiRequest): boolean {
  const secret = process.env.PAYMENTS_WEBHOOK_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== 'production';
  }

  const headerSecret = req.headers['x-webhook-secret'];
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice('Bearer '.length)
    : undefined;

  return headerSecret === secret || bearerToken === secret;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      if (!process.env.PAYMENTS_WEBHOOK_SECRET && process.env.NODE_ENV === 'production') {
        return res.status(503).json({ message: 'Payment webhook secret is not configured' });
      }

      if (!isAuthorizedPaymentWebhook(req)) {
        return res.status(401).json({ message: 'Invalid payment webhook credentials' });
      }

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
