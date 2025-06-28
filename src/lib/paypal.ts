
import { PayPalApi, Environment } from '@paypal/paypal-server-sdk';

const environment = process.env.NODE_ENV === 'production' 
  ? Environment.Live 
  : Environment.Sandbox;

const paypal = new PayPalApi({
  environment,
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
});

export default paypal;
