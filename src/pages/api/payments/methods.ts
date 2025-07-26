
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

const mockPaymentMethods: any[] = [
  {
    id: 'pm-1',
    userId: '2',
    type: 'card',
    provider: 'stripe',
    isDefault: true,
    cardLast4: '4242',
    cardBrand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'pm-2',
    userId: '4',
    type: 'bank_account',
    provider: 'redsys',
    isDefault: true,
    bankName: 'Banco Santander',
    accountLast4: '1234',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const userPaymentMethods = mockPaymentMethods.filter(pm => pm.userId === userId);

        res.status(200).json(userPaymentMethods);
      } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const userId = req.user?.userId;
        const { type, provider, token, isDefault } = req.body;

        if (!type || !provider || !token) {
          return res.status(400).json({ message: 'Type, provider, and token are required' });
        }

        if (isDefault) {
          mockPaymentMethods.forEach(pm => {
            if (pm.userId === userId) {
              pm.isDefault = false;
            }
          });
        }

        const newPaymentMethod = {
          id: uuidv4(),
          userId,
          type,
          provider,
          isDefault: isDefault || false,
          cardLast4: type === 'card' ? '4242' : undefined,
          cardBrand: type === 'card' ? 'visa' : undefined,
          expiryMonth: type === 'card' ? 12 : undefined,
          expiryYear: type === 'card' ? 2025 : undefined,
          bankName: type === 'bank_account' ? 'Banco Ejemplo' : undefined,
          accountLast4: type === 'bank_account' ? '1234' : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPaymentMethods.push(newPaymentMethod);

        res.status(201).json({
          message: 'Payment method added successfully',
          paymentMethod: newPaymentMethod,
        });
      } catch (error) {
        console.error('Add payment method error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
