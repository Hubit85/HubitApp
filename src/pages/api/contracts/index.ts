
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

const mockContracts: any[] = [
  {
    id: 'contract-1',
    budgetRequestId: 'req-1',
    quoteId: 'quote-1',
    clientId: '2',
    providerId: '3',
    title: 'Contrato de Reparación Fontanería',
    description: 'Reparación completa de fuga en tubería principal',
    amount: 250,
    currency: 'EUR',
    status: 'active',
    terms: {
      workDescription: 'Reparación completa de la fuga con garantía de 2 años',
      deliverables: ['Reparación de tubería', 'Limpieza del área', 'Informe final'],
      paymentTerms: 'Pago al completar el trabajo',
      cancellationPolicy: 'Cancelación gratuita hasta 24h antes del inicio',
      warranty: {
        duration: 24,
        description: 'Garantía completa de 2 años en materiales y mano de obra'
      },
      liability: 'Seguro de responsabilidad civil incluido',
      additionalTerms: ['Horario de trabajo: 9:00-17:00', 'Acceso necesario al inmueble']
    },
    timeline: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      milestones: [
        {
          id: 'milestone-1',
          title: 'Diagnóstico inicial',
          description: 'Evaluación completa del problema',
          amount: 0,
          dueDate: new Date(),
          status: 'completed',
          completedAt: new Date()
        },
        {
          id: 'milestone-2',
          title: 'Reparación',
          description: 'Ejecución de la reparación',
          amount: 250,
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          status: 'in_progress'
        }
      ]
    },
    payments: [
      {
        id: 'payment-1',
        milestoneId: 'milestone-2',
        amount: 250,
        type: 'final',
        status: 'pending',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    ],
    documents: [],
    signatures: [
      {
        id: 'sig-1',
        userId: '2',
        userRole: 'client',
        signedAt: new Date(),
        ipAddress: '192.168.1.1',
        signatureData: 'client_signature_data'
      },
      {
        id: 'sig-2',
        userId: '3',
        userRole: 'provider',
        signedAt: new Date(),
        ipAddress: '192.168.1.2',
        signatureData: 'provider_signature_data'
      }
    ],
    createdAt: new Date('2024-06-21'),
    updatedAt: new Date('2024-06-25'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const { status, role, startDate, endDate } = req.query;

        let filteredContracts = mockContracts.filter(contract => 
          contract.clientId === userId || contract.providerId === userId
        );

        if (status) {
          filteredContracts = filteredContracts.filter(contract => contract.status === status);
        }

        if (role) {
          if (role === 'client') {
            filteredContracts = filteredContracts.filter(contract => contract.clientId === userId);
          } else if (role === 'provider') {
            filteredContracts = filteredContracts.filter(contract => contract.providerId === userId);
          }
        }

        if (startDate) {
          filteredContracts = filteredContracts.filter(contract => 
            new Date(contract.createdAt) >= new Date(startDate as string)
          );
        }

        if (endDate) {
          filteredContracts = filteredContracts.filter(contract => 
            new Date(contract.createdAt) <= new Date(endDate as string)
          );
        }

        res.status(200).json(filteredContracts);
      } catch (error) {
        console.error('Get contracts error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const userId = req.user?.userId;
        const contractData = req.body;

        const newContract = {
          id: uuidv4(),
          clientId: userId,
          ...contractData,
          status: 'draft',
          documents: [],
          signatures: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockContracts.push(newContract);

        res.status(201).json({
          message: 'Contract created successfully',
          contract: newContract,
        });
      } catch (error) {
        console.error('Create contract error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
