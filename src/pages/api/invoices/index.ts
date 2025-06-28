
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

const mockInvoices: any[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    userId: '2',
    providerId: '3',
    amount: 250.00,
    currency: 'EUR',
    taxAmount: 52.50,
    totalAmount: 302.50,
    status: 'paid',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    items: [
      {
        id: 'item-1',
        description: 'Reparación fontanería',
        quantity: 1,
        unitPrice: 250.00,
        totalPrice: 250.00,
        taxRate: 0.21
      }
    ],
    paymentId: 'pay-1',
    notes: 'Reparación urgente completada satisfactoriamente',
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-002',
    userId: '4',
    communityId: 'comm-1',
    amount: 75.00,
    currency: 'EUR',
    taxAmount: 15.75,
    totalAmount: 90.75,
    status: 'sent',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    items: [
      {
        id: 'item-2',
        description: 'Cuota mensual comunidad',
        quantity: 1,
        unitPrice: 75.00,
        totalPrice: 75.00,
        taxRate: 0.21
      }
    ],
    notes: 'Cuota correspondiente al mes de junio 2024',
    createdAt: new Date('2024-06-25'),
    updatedAt: new Date('2024-06-25'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const { status, startDate, endDate } = req.query;

        let filteredInvoices = mockInvoices.filter(invoice => 
          invoice.userId === userId || invoice.providerId === userId
        );

        if (status) {
          filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status);
        }

        if (startDate) {
          filteredInvoices = filteredInvoices.filter(invoice => 
            new Date(invoice.createdAt) >= new Date(startDate as string)
          );
        }

        if (endDate) {
          filteredInvoices = filteredInvoices.filter(invoice => 
            new Date(invoice.createdAt) <= new Date(endDate as string)
          );
        }

        res.status(200).json(filteredInvoices);
      } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const invoiceData = req.body;
        const userId = req.user?.userId;

        const newInvoice = {
          id: uuidv4(),
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(mockInvoices.length + 1).padStart(3, '0')}`,
          userId,
          ...invoiceData,
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockInvoices.push(newInvoice);

        res.status(201).json({
          message: 'Invoice created successfully',
          invoice: newInvoice,
        });
      } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
