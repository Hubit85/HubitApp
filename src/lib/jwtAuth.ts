import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { isProductionRuntime } from '@/lib/apiSecurity';

const developmentJwtSecret = randomBytes(64).toString('hex');

export interface JwtAuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export interface JwtAuthenticatedRequest {
  user?: JwtAuthenticatedUser;
}

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  return isProductionRuntime() ? null : developmentJwtSecret;
}

export function signJwtToken(payload: JwtAuthenticatedUser, options?: SignOptions) {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error('JWT authentication is not configured');
  }

  return jwt.sign(payload, secret, options);
}

export function authenticateJwtToken(
  req: NextApiRequest & JwtAuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) {
  const secret = getJwtSecret();
  if (!secret) {
    return res.status(503).json({ message: 'JWT authentication is not configured' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user as JwtAuthenticatedUser;
    next();
  });
}
