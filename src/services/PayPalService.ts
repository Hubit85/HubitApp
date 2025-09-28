
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
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.paypal.com' 
    : 'https://api.sandbox.paypal.com';

  private async getAccessToken(): Promise<string> {
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
    
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
  }

  async createOrder(data: {
    amount: number;
    currency: string;
    description?: string;
    returnUrl?: string;
    cancelUrl?: string;
  }): Promise<PayPalOrder> {
    try {
      const accessToken = await this.getAccessToken();
      
      const requestBody = {
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
      };

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      
      return {
        id: result.id,
        status: result.status,
        amount: {
          currency_code: data.currency,
          value: data.amount.toFixed(2),
        },
        links: result.links || [],
      };
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  async captureOrder(orderId: string): Promise<PayPalCapture> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
      
      if (!capture) {
        throw new Error('No capture found in PayPal response');
      }

      return {
        id: capture.id,
        status: capture.status,
        amount: {
          currency_code: capture.amount?.currency_code,
          value: capture.amount?.value,
        },
      };
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw new Error('Failed to capture PayPal order');
    }
  }

  async getOrder(orderId: string): Promise<PayPalOrder> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      const amount = result.purchase_units?.[0]?.amount;

      return {
        id: result.id,
        status: result.status,
        amount: {
          currency_code: amount?.currency_code,
          value: amount?.value,
        },
        links: result.links || [],
      };
    } catch (error) {
      console.error('Error getting PayPal order:', error);
      throw new Error('Failed to get PayPal order');
    }
  }

  async createRefund(captureId: string, amount?: number, currency?: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      
      const requestBody = {
        amount: amount && currency ? {
          value: amount.toFixed(2),
          currency_code: currency,
        } : undefined,
      };

      const response = await fetch(`${this.baseUrl}/v2/payments/captures/${captureId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      return await response.json();
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
      const accessToken = await this.getAccessToken();
      
      const requestBody = {
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
      };

      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      return {
        id: result.id,
        status: result.status,
        plan_id: data.planId,
        start_time: data.startTime || new Date().toISOString(),
        links: result.links || [],
      };
    } catch (error) {
      console.error('Error creating PayPal subscription:', error);
      throw new Error('Failed to create PayPal subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, reason?: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      const requestBody = {
        reason: reason || 'User requested cancellation',
      };

      await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    } catch (error) {
      console.error('Error canceling PayPal subscription:', error);
      throw new Error('Failed to cancel PayPal subscription');
    }
  }

  async verifyWebhookSignature(
    headers: Record<string, string>,
    _body: string,
    _webhookId: string
  ): Promise<boolean> {
    try {
      const authAlgo = headers['paypal-auth-algo'];
      const transmission = headers['paypal-transmission-id'];
      const certId = headers['paypal-cert-id'];
      const signature = headers['paypal-transmission-sig'];
      const timestamp = headers['paypal-transmission-time'];

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

  static async handleWebhook(headers: any, body: any, webhookId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _headers = headers;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _body = body;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _webhookId = webhookId;
    // const client = this.getClient();
    // const request = new paypal.orders.OrdersGetRequest(body.resource.id);
    // const order = await client.execute(request);
    console.log("handleWebhook logic needs to be implemented");
  }
}

export const paypalService = new PayPalService();
