import { NextRequest, NextResponse } from 'next/server';

const PROD_BLOCKED_PREFIXES = ['/api/debug', '/api/test'];
const PROD_BLOCKED_PATHS = new Set(['/api/auth/login']);
const PUBLIC_API_PATHS = new Set([
  '/api/hello',
  '/api/payments/plans',
  '/api/service-categories',
]);

function hasUnsafeJwtSecret(): boolean {
  const secret = process.env.JWT_SECRET;
  return !secret || secret === 'your-secret-key';
}

function isLegacyJwtApi(pathname: string): boolean {
  if (!pathname.startsWith('/api/')) {
    return false;
  }

  if (pathname.startsWith('/api/webhooks/')) {
    return false;
  }

  return !PUBLIC_API_PATHS.has(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'production') {
    if (
      PROD_BLOCKED_PATHS.has(pathname) ||
      PROD_BLOCKED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
    ) {
      return new NextResponse(null, { status: 404 });
    }

    if (isLegacyJwtApi(pathname) && hasUnsafeJwtSecret()) {
      return NextResponse.json(
        { message: 'Authentication is not configured' },
        { status: 503 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
