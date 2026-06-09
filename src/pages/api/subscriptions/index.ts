
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJwtToken, type JwtAuthenticatedRequest } from '@/lib/jwtAuth';
import { v4 as uuidv4 } from 'uuid';

type AuthenticatedRequest = NextApiRequest & JwtAuthenticatedRequest;

const authenticateToken = authenticateJwtToken;

const mockSubscriptions: any[] = [
  {
    id: 'sub-1',
    userId: '3',
    planId: 'plan-premium',
    status: 'active',
    amount: 29.99,
    currency: 'EUR',
    interval: 'monthly',
    currentPeriodStart: new Date('2024-06-01'),
    currentPeriodEnd: new Date('2024-07-01'),
    cancelAtPeriodEnd: false,
    paymentMethodId: 'pm-1',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: 'sub-2',
    userId: '1',
    communityId: 'comm-1',
    planId: 'plan-community',
    status: 'active',
    amount: 99.99,
    currency: 'EUR',
    interval: 'monthly',
    currentPeriodStart: new Date('2024-06-01'),
    currentPeriodEnd: new Date('2024-07-01'),
    cancelAtPeriodEnd: false,
    paymentMethodId: 'pm-2',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const userSubscriptions = mockSubscriptions.filter(sub => sub.userId === userId);

        res.status(200).json(userSubscriptions);
      } catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const userId = req.user?.userId;
        const { planId, paymentMethodId, providerId, communityId } = req.body;

        if (!planId || !paymentMethodId) {
          return res.status(400).json({ message: 'Plan ID and payment method ID are required' });
        }

        const newSubscription = {
          id: uuidv4(),
          userId,
          providerId,
          communityId,
          planId,
          status: 'active',
          amount: planId === 'plan-premium' ? 29.99 : 99.99,
          currency: 'EUR',
          interval: 'monthly',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
          paymentMethodId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockSubscriptions.push(newSubscription);

        res.status(201).json({
          message: 'Subscription created successfully',
          subscription: newSubscription,
        });
      } catch (error) {
        console.error('Create subscription error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
