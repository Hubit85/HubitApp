
import { NextApiRequest, NextApiResponse } from 'next';
import { paypalService } from '@/services/PayPalService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const headers = req.headers as Record<string, string>;
      const body = JSON.stringify(req.body);
      const webhookId = process.env.PAYPAL_WEBHOOK_ID || '';

      const isValid = await paypalService.verifyWebhookSignature(headers, body, webhookId);

      if (!isValid) {
        return res.status(400).json({ message: 'Invalid PayPal webhook signature' });
      }

      const { event_type, resource } = req.body;

      console.log('PayPal webhook received:', event_type);

      switch (event_type) {
        case 'PAYMENT.CAPTURE.COMPLETED':
          console.log('Payment capture completed:', resource.id);
          break;

        case 'PAYMENT.CAPTURE.DENIED':
          console.log('Payment capture denied:', resource.id);
          break;

        case 'BILLING.SUBSCRIPTION.CREATED':
          console.log('Subscription created:', resource.id);
          break;

        case 'BILLING.SUBSCRIPTION.CANCELLED':
          console.log('Subscription cancelled:', resource.id);
          break;

        case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
          console.log('Subscription payment failed:', resource.id);
          break;

        default:
          console.log('Unhandled PayPal event type:', event_type);
      }

      res.status(200).json({ 
        message: 'PayPal webhook processed successfully',
        eventType: event_type,
        processed: true 
      });
    } catch (error) {
      console.error('PayPal webhook processing error:', error);
      res.status(400).json({ 
        message: 'PayPal webhook processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
