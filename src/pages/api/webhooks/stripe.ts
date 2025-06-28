
import { NextApiRequest, NextApiResponse } from 'next';
import { stripeService } from '@/services/StripeService';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const buf = await buffer(req);
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        return res.status(400).json({ message: 'Missing Stripe signature' });
      }

      const event = await stripeService.constructWebhookEvent(buf, signature);

      console.log('Stripe webhook received:', event.type);

      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('Payment succeeded:', event.data.object.id);
          break;

        case 'payment_intent.payment_failed':
          console.log('Payment failed:', event.data.object.id);
          break;

        case 'customer.subscription.created':
          console.log('Subscription created:', event.data.object.id);
          break;

        case 'customer.subscription.deleted':
          console.log('Subscription cancelled:', event.data.object.id);
          break;

        case 'invoice.payment_succeeded':
          console.log('Invoice payment succeeded:', event.data.object.id);
          break;

        case 'invoice.payment_failed':
          console.log('Invoice payment failed:', event.data.object.id);
          break;

        default:
          console.log('Unhandled Stripe event type:', event.type);
      }

      res.status(200).json({ 
        message: 'Stripe webhook processed successfully',
        eventId: event.id,
        processed: true 
      });
    } catch (error) {
      console.error('Stripe webhook processing error:', error);
      res.status(400).json({ 
        message: 'Stripe webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
