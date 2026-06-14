import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRODUCTION_BLOCKED_API_PATHS = new Set(['/api/auth/login']);
const PRODUCTION_BLOCKED_API_PREFIXES = ['/api/debug', '/api/test'];

function isBlockedProductionPath(pathname: string): boolean {
  return (
    PRODUCTION_BLOCKED_API_PATHS.has(pathname) ||
    PRODUCTION_BLOCKED_API_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
}

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' && isBlockedProductionPath(request.nextUrl.pathname)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/login', '/api/debug/:path*', '/api/test/:path*'],
};
