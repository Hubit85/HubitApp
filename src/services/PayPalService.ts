
import paypal from '@/lib/paypal';
import { 
  OrdersCreateRequest, 
  OrdersCaptureRequest,
  OrdersGetRequest,
  PaymentsRefundsPostRequest,
  BillingSubscriptionsCreateRequest,
  BillingSubscriptionsCancelRequest
} from '@paypal/paypal-server-sdk';

export interface PayPalOrder {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalCapture {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
}

export interface PayPalSubscription {
  id: string;
  status: string;
  plan_id: string;
  start_time: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

class PayPalService {
  async createOrder(data: {
    amount: number;
    currency: string;
    description?: string;
    returnUrl?: string;
    cancelUrl?: string;
  }): Promise<PayPalOrder> {
    try {
      const request = new OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: data.currency,
            value: data.amount.toFixed(2),
          },
          description: data.description,
        }],
        application_context: {
          return_url: data.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          cancel_url: data.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
          brand_name: 'HuBiT',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
        },
      });

      const response = await paypal.orders.ordersCreate(request);
      
      return {
        id: response.result.id!,
        status: response.result.status!,
        amount: {
          currency_code: data.currency,
          value: data.amount.toFixed(2),
        },
        links: response.result.links?.map(link => ({
          href: link.href!,
          rel: link.rel!,
          method: link.method!,
        })) || [],
      };
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  async captureOrder(orderId: string): Promise<PayPalCapture> {
    try {
      const request = new OrdersCaptureRequest(orderId);
      const response = await paypal.orders.ordersCapture(request);

      const capture = response.result.purchase_units?.[0]?.payments?.captures?.[0];
      
      if (!capture) {
        throw new Error('No capture found in PayPal response');
      }

      return {
        id: capture.id!,
        status: capture.status!,
        amount: {
          currency_code: capture.amount?.currency_code!,
          value: capture.amount?.value!,
        },
      };
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw new Error('Failed to capture PayPal order');
    }
  }

  async getOrder(orderId: string): Promise<PayPalOrder> {
    try {
      const request = new OrdersGetRequest(orderId);
      const response = await paypal.orders.ordersGet(request);

      const amount = response.result.purchase_units?.[0]?.amount;

      return {
        id: response.result.id!,
        status: response.result.status!,
        amount: {
          currency_code: amount?.currency_code!,
          value: amount?.value!,
        },
        links: response.result.links?.map(link => ({
          href: link.href!,
          rel: link.rel!,
          method: link.method!,
        })) || [],
      };
    } catch (error) {
      console.error('Error getting PayPal order:', error);
      throw new Error('Failed to get PayPal order');
    }
  }

  async createRefund(captureId: string, amount?: number, currency?: string): Promise<any> {
    try {
      const request = new PaymentsRefundsPostRequest();
      request.requestBody({
        amount: amount && currency ? {
          value: amount.toFixed(2),
          currency_code: currency,
        } : undefined,
      });

      const response = await paypal.payments.refundsPost(request);
      return response.result;
    } catch (error) {
      console.error('Error creating PayPal refund:', error);
      throw new Error('Failed to create PayPal refund');
    }
  }

  async createSubscription(data: {
    planId: string;
    startTime?: string;
    subscriberEmail?: string;
    subscriberName?: string;
  }): Promise<PayPalSubscription> {
    try {
      const request = new BillingSubscriptionsCreateRequest();
      request.requestBody({
        plan_id: data.planId,
        start_time: data.startTime || new Date().toISOString(),
        subscriber: data.subscriberEmail ? {
          email_address: data.subscriberEmail,
          name: data.subscriberName ? {
            given_name: data.subscriberName.split(' ')[0],
            surname: data.subscriberName.split(' ').slice(1).join(' '),
          } : undefined,
        } : undefined,
        application_context: {
          brand_name: 'HuBiT',
          locale: 'es-ES',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,
        },
      });

      const response = await paypal.billingSubscriptions.subscriptionsPost(request);

      return {
        id: response.result.id!,
        status: response.result.status!,
        plan_id: data.planId,
        start_time: data.startTime || new Date().toISOString(),
        links: response.result.links?.map(link => ({
          href: link.href!,
          rel: link.rel!,
          method: link.method!,
        })) || [],
      };
    } catch (error) {
      console.error('Error creating PayPal subscription:', error);
      throw new Error('Failed to create PayPal subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, reason?: string): Promise<void> {
    try {
      const request = new BillingSubscriptionsCancelRequest(subscriptionId);
      request.requestBody({
        reason: reason || 'User requested cancellation',
      });

      await paypal.billingSubscriptions.subscriptionsCancel(request);
    } catch (error) {
      console.error('Error canceling PayPal subscription:', error);
      throw new Error('Failed to cancel PayPal subscription');
    }
  }

  async verifyWebhookSignature(
    headers: Record<string, string>,
    body: string,
    webhookId: string
  ): Promise<boolean> {
    try {
      // PayPal webhook verification logic would go here
      // This is a simplified version - in production, you'd verify the signature
      const authAlgo = headers['paypal-auth-algo'];
      const transmission = headers['paypal-transmission-id'];
      const certId = headers['paypal-cert-id'];
      const signature = headers['paypal-transmission-sig'];
      const timestamp = headers['paypal-transmission-time'];

      // In a real implementation, you would verify these headers
      // against PayPal's webhook verification API
      return !!(authAlgo && transmission && certId && signature && timestamp);
    } catch (error) {
      console.error('Error verifying PayPal webhook:', error);
      return false;
    }
  }

  getApprovalUrl(order: PayPalOrder): string | null {
    const approvalLink = order.links.find(link => link.rel === 'approve');
    return approvalLink?.href || null;
  }

  getSubscriptionApprovalUrl(subscription: PayPalSubscription): string | null {
    const approvalLink = subscription.links.find(link => link.rel === 'approve');
    return approvalLink?.href || null;
  }
}

export const paypalService = new PayPalService();
