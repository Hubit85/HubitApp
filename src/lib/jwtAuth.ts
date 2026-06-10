import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { isProductionRuntime } from '@/lib/apiSecurity';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function getLegacyJwtSecret(): string | null {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  return isProductionRuntime() ? null : 'your-secret-key';
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) {
  const jwtSecret = getLegacyJwtSecret();

  if (!jwtSecret) {
    return res.status(503).json({ message: 'Authentication is not configured' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, jwtSecret, (err: jwt.VerifyErrors | null, user: unknown) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user as AuthenticatedRequest['user'];
    next();
  });
}
