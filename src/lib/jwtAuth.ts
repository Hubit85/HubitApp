import jwt, { JsonWebTokenError, SignOptions, VerifyCallback } from 'jsonwebtoken';

const DEVELOPMENT_JWT_SECRET = 'development-only-jwt-secret';

class JwtConfigurationError extends JsonWebTokenError {
  constructor() {
    super('JWT_SECRET must be configured in production');
    this.name = 'JwtConfigurationError';
  }
}

function resolveJwtSecret(): string {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new JwtConfigurationError();
  }

  return DEVELOPMENT_JWT_SECRET;
}

export function verifyJwtToken(token: string, callback: VerifyCallback): void {
  let secret: string;

  try {
    secret = resolveJwtSecret();
  } catch {
    callback(new JwtConfigurationError(), undefined);
    return;
  }

  jwt.verify(token, secret, callback);
}

export function signJwtToken(payload: string | Buffer | object, options?: SignOptions): string {
  return jwt.sign(payload, resolveJwtSecret(), options);
}
