
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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

const mockBudgetRequests: any[] = [
  {
    id: 'req-1',
    userId: '2',
    title: 'Reparación fontanería urgente',
    description: 'Fuga en tubería principal del baño',
    category: 'plumbing',
    urgency: 'urgent',
    budget: {
      min: 100,
      max: 300,
      currency: 'EUR'
    },
    requirements: ['Disponibilidad inmediata', 'Garantía de 1 año'],
    attachments: [],
    location: {
      address: 'Calle Mayor 123, Madrid',
      coordinates: { lat: 40.4168, lng: -3.7038 }
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      flexible: false
    },
    status: 'published',
    quotesCount: 3,
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: 'req-2',
    userId: '4',
    title: 'Mantenimiento jardín comunitario',
    description: 'Poda y mantenimiento del jardín de la comunidad',
    category: 'gardening',
    communityId: 'comm-1',
    urgency: 'medium',
    budget: {
      min: 200,
      max: 500,
      currency: 'EUR'
    },
    requirements: ['Experiencia en jardinería', 'Herramientas propias'],
    attachments: [],
    location: {
      address: 'Urbanización Las Flores, Sevilla'
    },
    timeline: {
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      flexible: true
    },
    status: 'quotes_received',
    quotesCount: 2,
    createdAt: new Date('2024-06-22'),
    updatedAt: new Date('2024-06-25'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const { status, category, urgency, location } = req.query;
        let filteredRequests = [...mockBudgetRequests];

        if (status) {
          filteredRequests = filteredRequests.filter(req => req.status === status);
        }

        if (category) {
          filteredRequests = filteredRequests.filter(req => req.category === category);
        }

        if (urgency) {
          filteredRequests = filteredRequests.filter(req => req.urgency === urgency);
        }

        if (location) {
          filteredRequests = filteredRequests.filter(req => 
            req.location.address.toLowerCase().includes((location as string).toLowerCase())
          );
        }

        res.status(200).json(filteredRequests);
      } catch (error) {
        console.error('Get budget requests error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const userId = req.user?.userId;
        const requestData = req.body;

        const newRequest = {
          id: uuidv4(),
          userId,
          ...requestData,
          status: 'draft',
          quotesCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockBudgetRequests.push(newRequest);

        res.status(201).json({
          message: 'Budget request created successfully',
          budgetRequest: newRequest,
        });
      } catch (error) {
        console.error('Create budget request error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
