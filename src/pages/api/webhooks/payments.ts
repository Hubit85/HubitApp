
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

function isValidWebhookSignature(payload: Buffer, signatureHeader: string | string[] | undefined): boolean {
  const secret = process.env.PAYMENTS_WEBHOOK_SECRET;
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

  if (!secret || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  const receivedSignature = signature.startsWith('sha256=') ? signature.slice('sha256='.length) : signature;

  const expected = Buffer.from(expectedSignature, 'hex');
  const received = Buffer.from(receivedSignature, 'hex');

  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const rawBody = await buffer(req);

      if (!process.env.PAYMENTS_WEBHOOK_SECRET) {
        return res.status(503).json({ message: 'Payment webhook is not configured' });
      }

      if (!isValidWebhookSignature(rawBody, req.headers['x-payments-signature'])) {
        return res.status(401).json({ message: 'Invalid payment webhook signature' });
      }

      const { type, data } = JSON.parse(rawBody.toString('utf8'));

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
