import { NextRequest, NextResponse } from 'next/server';

const blockedProductionPaths = [
  '/api/auth/login',
  '/api/debug',
  '/api/test',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    process.env.NODE_ENV === 'production' &&
    blockedProductionPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))
  ) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/login', '/api/debug/:path*', '/api/test/:path*'],
};
