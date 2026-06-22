import { NextRequest, NextResponse } from 'next/server';

const PRODUCTION_BLOCKED_ROUTES = ['/api/auth/login'];
const PRODUCTION_BLOCKED_PREFIXES = ['/api/debug/', '/api/test/'];

const LEGACY_JWT_EXACT_ROUTES = ['/api/auth/profile'];
const LEGACY_JWT_PREFIXES = [
  '/api/analytics/',
  '/api/budget-requests/',
  '/api/communities/',
  '/api/contracts/',
  '/api/invoices/',
  '/api/notifications/',
  '/api/properties/',
  '/api/quotes/',
  '/api/subscriptions/',
  '/api/payments/',
];

const LEGACY_JWT_PUBLIC_ROUTES = ['/api/payments/plans'];
const INSECURE_JWT_SECRET = 'your-secret-key';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function isLegacyJwtRoute(pathname: string) {
  if (LEGACY_JWT_PUBLIC_ROUTES.includes(pathname)) {
    return false;
  }

  return (
    LEGACY_JWT_EXACT_ROUTES.includes(pathname) ||
    LEGACY_JWT_PREFIXES.some(prefix => pathname.startsWith(prefix))
  );
}

function hasStrongJwtSecret() {
  const secret = process.env.JWT_SECRET;
  return !!secret && secret !== INSECURE_JWT_SECRET;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProduction()) {
    return NextResponse.next();
  }

  if (
    PRODUCTION_BLOCKED_ROUTES.includes(pathname) ||
    PRODUCTION_BLOCKED_PREFIXES.some(prefix => pathname.startsWith(prefix))
  ) {
    return new NextResponse('Not Found', { status: 404 });
  }

  if (isLegacyJwtRoute(pathname) && !hasStrongJwtSecret()) {
    return NextResponse.json(
      { message: 'JWT authentication is not configured' },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
