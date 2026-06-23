import { NextRequest, NextResponse } from 'next/server';

const PRODUCTION_ONLY_BLOCKED_ROUTES = [
  /^\/api\/debug(?:\/|$)/,
  /^\/api\/test(?:\/|$)/,
  /^\/api\/auth\/login\/?$/,
];

const LEGACY_JWT_API_PREFIXES = [
  '/api/analytics',
  '/api/auth/profile',
  '/api/budget-requests',
  '/api/communities',
  '/api/contracts',
  '/api/invoices',
  '/api/notifications',
  '/api/payments',
  '/api/properties',
  '/api/quotes',
  '/api/subscriptions',
];

const PUBLIC_PAYMENT_ROUTES = new Set(['/api/payments/plans']);

function isLegacyJwtApi(pathname: string) {
  if (PUBLIC_PAYMENT_ROUTES.has(pathname)) {
    return false;
  }

  return LEGACY_JWT_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasSafeJwtSecret() {
  const secret = process.env.JWT_SECRET;
  return !!secret && secret !== 'your-secret-key';
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  if (PRODUCTION_ONLY_BLOCKED_ROUTES.some((route) => route.test(pathname))) {
    return new NextResponse(null, { status: 404 });
  }

  if (isLegacyJwtApi(pathname) && !hasSafeJwtSecret()) {
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
