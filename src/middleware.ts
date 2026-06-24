import { NextRequest, NextResponse } from 'next/server';

const INSECURE_JWT_SECRET = 'your-secret-key';

const BLOCKED_PRODUCTION_PREFIXES = [
  '/api/debug',
  '/api/test',
];

const BLOCKED_PRODUCTION_PATHS = new Set([
  '/api/auth/login',
]);

const PUBLIC_API_PREFIXES = [
  '/api/webhooks',
];

const PUBLIC_API_PATHS = new Set([
  '/api/hello',
  '/api/payments/plans',
  '/api/service-categories',
]);

function isPublicApiPath(pathname: string) {
  return PUBLIC_API_PATHS.has(pathname) || PUBLIC_API_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function isJwtSecretUnsafe() {
  return !process.env.JWT_SECRET || process.env.JWT_SECRET === INSECURE_JWT_SECRET;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (process.env.NODE_ENV !== 'production' || !pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (
    BLOCKED_PRODUCTION_PATHS.has(pathname) ||
    BLOCKED_PRODUCTION_PREFIXES.some(prefix => pathname.startsWith(prefix))
  ) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  if (!isPublicApiPath(pathname) && isJwtSecretUnsafe()) {
    return NextResponse.json(
      { message: 'Authentication is not configured' },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
