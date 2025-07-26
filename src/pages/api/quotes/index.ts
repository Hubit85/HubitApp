
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

const mockQuotes: any[] = [
  {
    id: 'quote-1',
    budgetRequestId: 'req-1',
    providerId: '3',
    providerName: 'Servicios Profesionales S.L.',
    providerRating: 4.8,
    amount: 250,
    currency: 'EUR',
    breakdown: [
      {
        id: 'item-1',
        description: 'Reparación tubería',
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
        category: 'labor'
      },
      {
        id: 'item-2',
        description: 'Materiales',
        quantity: 1,
        unitPrice: 100,
        totalPrice: 100,
        category: 'materials'
      }
    ],
    description: 'Reparación completa de la fuga con garantía de 2 años',
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      estimatedDuration: '2 días'
    },
    terms: 'Pago al completar el trabajo. Garantía de 2 años.',
    warranty: {
      duration: 24,
      description: 'Garantía completa de 2 años en materiales y mano de obra'
    },
    status: 'pending',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    attachments: [],
    createdAt: new Date('2024-06-21'),
    updatedAt: new Date('2024-06-21'),
  },
  {
    id: 'quote-2',
    budgetRequestId: 'req-2',
    providerId: '3',
    providerName: 'Servicios Profesionales S.L.',
    providerRating: 4.8,
    amount: 350,
    currency: 'EUR',
    breakdown: [
      {
        id: 'item-3',
        description: 'Poda de árboles',
        quantity: 5,
        unitPrice: 40,
        totalPrice: 200,
        category: 'labor'
      },
      {
        id: 'item-4',
        description: 'Mantenimiento césped',
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
        category: 'labor'
      }
    ],
    description: 'Mantenimiento completo del jardín comunitario',
    timeline: {
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      estimatedDuration: '2 días'
    },
    terms: 'Pago 50% al inicio, 50% al finalizar',
    warranty: {
      duration: 6,
      description: 'Garantía de 6 meses en el trabajo realizado'
    },
    status: 'pending',
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    attachments: [],
    createdAt: new Date('2024-06-23'),
    updatedAt: new Date('2024-06-23'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const { budgetRequestId } = req.query;
        let filteredQuotes = [...mockQuotes];

        if (budgetRequestId) {
          filteredQuotes = filteredQuotes.filter(quote => quote.budgetRequestId === budgetRequestId);
        }

        res.status(200).json(filteredQuotes);
      } catch (error) {
        console.error('Get quotes error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const providerId = req.user?.userId;
        const quoteData = req.body;

        const newQuote = {
          id: uuidv4(),
          providerId,
          providerName: 'Proveedor de Servicios',
          providerRating: 4.5,
          ...quoteData,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockQuotes.push(newQuote);

        res.status(201).json({
          message: 'Quote created successfully',
          quote: newQuote,
        });
      } catch (error) {
        console.error('Create quote error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
