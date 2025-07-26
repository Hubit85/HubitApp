
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

const mockUserProfiles: Record<string, any> = {
  '1': {
    id: '1',
    email: 'admin@hubit.com',
    name: 'Administrador',
    role: 'administrator',
    phone: '+34 600 000 001',
    address: 'Madrid, España',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  '2': {
    id: '2',
    email: 'particular@hubit.com',
    name: 'Usuario Particular',
    role: 'particular',
    phone: '+34 600 000 002',
    address: 'Barcelona, España',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    properties: ['prop-1', 'prop-2'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  '3': {
    id: '3',
    email: 'proveedor@hubit.com',
    name: 'Proveedor de Servicios',
    role: 'service_provider',
    phone: '+34 600 000 003',
    address: 'Valencia, España',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    company: 'Servicios Profesionales S.L.',
    services: ['plumbing', 'electrical', 'maintenance'],
    rating: 4.8,
    completedJobs: 156,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  '4': {
    id: '4',
    email: 'comunidad@hubit.com',
    name: 'Miembro Comunidad',
    role: 'community_member',
    phone: '+34 600 000 004',
    address: 'Sevilla, España',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    communityId: 'comm-1',
    propertyUnit: 'Piso 3A',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(),
  },
};

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const userProfile = mockUserProfiles[userId!];

        if (!userProfile) {
          return res.status(404).json({ message: 'User profile not found' });
        }

        res.status(200).json(userProfile);
      } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'PUT') {
      try {
        const userId = req.user?.userId;
        const updates = req.body;

        if (!mockUserProfiles[userId!]) {
          return res.status(404).json({ message: 'User profile not found' });
        }

        mockUserProfiles[userId!] = {
          ...mockUserProfiles[userId!],
          ...updates,
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Profile updated successfully',
          user: mockUserProfiles[userId!],
        });
      } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
