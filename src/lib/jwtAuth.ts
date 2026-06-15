import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: AuthenticatedUser;
}

export function getJwtSecret(res?: NextApiResponse): string | null {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-only-jwt-secret';
  }

  console.error('JWT_SECRET is not configured in production.');
  if (res && !res.headersSent) {
    res.status(503).json({ message: 'Authentication is not configured' });
  }
  return null;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const secret = getJwtSecret(res);
  if (!secret) {
    return;
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user as AuthenticatedUser;
    next();
  });
}

export function signAuthToken(payload: AuthenticatedUser, options?: jwt.SignOptions): string {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(payload, secret, options);
}
