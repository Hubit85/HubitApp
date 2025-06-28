
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

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'POST') {
      try {
        const { id } = req.query;
        const { signatureData } = req.body;
        const userId = req.user?.userId;

        if (!signatureData) {
          return res.status(400).json({ message: 'Signature data is required' });
        }

        const signature = {
          id: uuidv4(),
          userId,
          userRole: 'client',
          signedAt: new Date(),
          ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1',
          signatureData,
        };

        const signedContract = {
          id,
          title: 'Contrato de Reparación Fontanería',
          status: 'pending_signature',
          signatures: [signature],
          updatedAt: new Date(),
        };

        res.status(200).json({
          message: 'Contract signed successfully',
          contract: signedContract,
        });
      } catch (error) {
        console.error('Sign contract error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
