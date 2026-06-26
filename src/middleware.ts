import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_IN_PRODUCTION_PREFIXES = ['/api/debug', '/api/test'];
const BLOCKED_IN_PRODUCTION_EXACT = new Set(['/api/auth/login']);

const LEGACY_JWT_PREFIXES = [
  '/api/budget-requests',
  '/api/communities',
  '/api/contracts',
  '/api/invoices',
  '/api/notifications',
  '/api/payments/paypal',
  '/api/payments/stripe',
  '/api/properties',
  '/api/quotes',
  '/api/subscriptions'
];

const LEGACY_JWT_EXACT = new Set([
  '/api/analytics/dashboard',
  '/api/auth/profile',
  '/api/payments',
  '/api/payments/confirm',
  '/api/payments/intent',
  '/api/payments/methods',
  '/api/payments/stats'
]);

const LEGACY_JWT_PATTERNS = [
  /^\/api\/payments\/[^/]+\/refund$/,
  /^\/api\/payments\/methods\/[^/]+$/
];

function isBlockedInProduction(pathname: string): boolean {
  return (
    BLOCKED_IN_PRODUCTION_EXACT.has(pathname) ||
    BLOCKED_IN_PRODUCTION_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
}

function isLegacyJwtApi(pathname: string): boolean {
  return (
    LEGACY_JWT_EXACT.has(pathname) ||
    LEGACY_JWT_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    LEGACY_JWT_PATTERNS.some(pattern => pattern.test(pathname))
  );
}

function hasSecureJwtSecret(): boolean {
  const secret = process.env.JWT_SECRET;
  return !!secret && secret !== 'your-secret-key';
}

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (isBlockedInProduction(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  if (isLegacyJwtApi(pathname) && !hasSecureJwtSecret()) {
    return NextResponse.json(
      { message: 'Authentication service is not configured' },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};
