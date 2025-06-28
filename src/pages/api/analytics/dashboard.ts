
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { period = 'month' } = req.query;

        let dashboardData;

        switch (userRole) {
          case 'administrator':
            dashboardData = {
              overview: {
                totalCommunities: 15,
                totalUnits: 1250,
                totalRevenue: 125000.00,
                activeContracts: 45,
              },
              revenue: {
                thisMonth: 12500.00,
                lastMonth: 11800.00,
                growth: 5.9,
                trend: [
                  { month: 'Ene', amount: 10500 },
                  { month: 'Feb', amount: 11200 },
                  { month: 'Mar', amount: 11800 },
                  { month: 'Abr', amount: 12500 },
                ]
              },
              communities: {
                mostActive: [
                  { name: 'Urbanización Las Flores', units: 50, revenue: 3750 },
                  { name: 'Residencial El Parque', units: 80, revenue: 9600 },
                ]
              },
              payments: {
                pending: 8,
                overdue: 2,
                completed: 156,
              }
            };
            break;

          case 'service_provider':
            dashboardData = {
              overview: {
                totalJobs: 156,
                activeQuotes: 12,
                totalEarnings: 45600.00,
                rating: 4.8,
              },
              earnings: {
                thisMonth: 4200.00,
                lastMonth: 3800.00,
                growth: 10.5,
                trend: [
                  { month: 'Ene', amount: 3200 },
                  { month: 'Feb', amount: 3500 },
                  { month: 'Mar', amount: 3800 },
                  { month: 'Abr', amount: 4200 },
                ]
              },
              jobs: {
                completed: 156,
                inProgress: 8,
                pending: 12,
              },
              categories: [
                { name: 'Fontanería', jobs: 45, earnings: 15600 },
                { name: 'Electricidad', jobs: 38, earnings: 12800 },
                { name: 'Mantenimiento', jobs: 73, earnings: 17200 },
              ]
            };
            break;

          case 'particular':
            dashboardData = {
              overview: {
                totalProperties: 2,
                activeRequests: 3,
                totalSpent: 2450.00,
                savedProviders: 8,
              },
              spending: {
                thisMonth: 450.00,
                lastMonth: 320.00,
                growth: 40.6,
                trend: [
                  { month: 'Ene', amount: 280 },
                  { month: 'Feb', amount: 320 },
                  { month: 'Mar', amount: 380 },
                  { month: 'Abr', amount: 450 },
                ]
              },
              requests: {
                completed: 12,
                inProgress: 2,
                pending: 1,
              },
              categories: [
                { name: 'Fontanería', requests: 4, spent: 850 },
                { name: 'Electricidad', requests: 3, spent: 650 },
                { name: 'Limpieza', requests: 5, spent: 950 },
              ]
            };
            break;

          case 'community_member':
            dashboardData = {
              overview: {
                communityFees: 75.00,
                pendingPayments: 1,
                activeIncidents: 2,
                nextMeeting: new Date('2024-07-15'),
              },
              payments: {
                thisMonth: 75.00,
                nextDue: new Date('2024-07-01'),
                status: 'paid',
                history: [
                  { month: 'Ene', amount: 75, status: 'paid' },
                  { month: 'Feb', amount: 75, status: 'paid' },
                  { month: 'Mar', amount: 75, status: 'paid' },
                  { month: 'Abr', amount: 75, status: 'pending' },
                ]
              },
              community: {
                name: 'Urbanización Las Flores',
                unit: 'Piso 3A',
                announcements: 3,
                documents: 8,
              }
            };
            break;

          default:
            dashboardData = {
              overview: {
                message: 'Bienvenido a HuBiT',
                features: 4,
                tutorials: 6,
              }
            };
        }

        res.status(200).json(dashboardData);
      } catch (error) {
        console.error('Get dashboard analytics error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
