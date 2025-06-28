
import { Client, Environment } from '@paypal/paypal-server-sdk';

const environment = process.env.NODE_ENV === 'production' 
  ? Environment.Production 
  : Environment.Sandbox;

const paypal = new Client({
  environment,
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
});

export default paypal;
