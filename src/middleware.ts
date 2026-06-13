import { NextRequest, NextResponse } from 'next/server';

const PRODUCTION_BLOCKED_API_PREFIXES = [
  '/api/debug',
  '/api/test',
];

const PRODUCTION_BLOCKED_API_PATHS = new Set([
  '/api/auth/login',
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'production') {
    const blocked =
      PRODUCTION_BLOCKED_API_PATHS.has(pathname) ||
      PRODUCTION_BLOCKED_API_PREFIXES.some((prefix) => pathname.startsWith(`${prefix}/`) || pathname === prefix);

    if (blocked) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
