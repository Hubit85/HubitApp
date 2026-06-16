import { NextRequest, NextResponse } from 'next/server';

const DIAGNOSTIC_API_PREFIXES = ['/api/debug/', '/api/test/'];
const PRODUCTION_BLOCKED_API_PATHS = new Set(['/api/auth/login']);
const PUBLIC_API_PATHS = new Set(['/api/payments/plans']);

const LEGACY_JWT_API_PREFIXES = [
  '/api/auth/profile',
  '/api/analytics',
  '/api/budget-requests',
  '/api/communities',
  '/api/contracts',
  '/api/invoices',
  '/api/notifications',
  '/api/payments',
  '/api/properties',
  '/api/quotes',
  '/api/service-categories',
  '/api/subscriptions',
];

function matchesApiPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function usesLegacyJwt(pathname: string) {
  if (PUBLIC_API_PATHS.has(pathname)) {
    return false;
  }

  return LEGACY_JWT_API_PREFIXES.some((prefix) => matchesApiPrefix(pathname, prefix));
}

function hasSafeJwtSecret() {
  const secret = process.env.JWT_SECRET;
  return Boolean(secret && secret !== 'your-secret-key');
}

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    DIAGNOSTIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PRODUCTION_BLOCKED_API_PATHS.has(pathname)
  ) {
    return new NextResponse(null, { status: 404 });
  }

  if (usesLegacyJwt(pathname) && !hasSafeJwtSecret()) {
    return NextResponse.json(
      { message: 'Authentication service is not configured' },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
