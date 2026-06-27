
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

function getSignature(req: NextApiRequest): string | undefined {
  const signature = req.headers['x-hubit-signature'] || req.headers['x-webhook-signature'];
  return Array.isArray(signature) ? signature[0] : signature;
}

function isValidWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const received = signature.startsWith('sha256=') ? signature.slice('sha256='.length) : signature;

  const expectedBuffer = Buffer.from(expected, 'hex');
  const receivedBuffer = Buffer.from(received, 'hex');

  return expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const webhookSecret = process.env.PAYMENTS_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return res.status(process.env.NODE_ENV === 'production' ? 503 : 401).json({
          message: 'Payment webhook verification is not configured',
        });
      }

      const payload = JSON.stringify(req.body);
      const signature = getSignature(req);
      if (!signature || !isValidWebhookSignature(payload, signature, webhookSecret)) {
        return res.status(401).json({ message: 'Invalid payment webhook signature' });
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
