import { NextRequest, NextResponse } from 'next/server';

const DIAGNOSTIC_API_PREFIXES = ['/api/debug', '/api/test'];

function isProductionDeployment(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

function isDiagnosticApiPath(pathname: string): boolean {
  return DIAGNOSTIC_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  if (isProductionDeployment() && isDiagnosticApiPath(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/debug/:path*', '/api/test/:path*'],
};
