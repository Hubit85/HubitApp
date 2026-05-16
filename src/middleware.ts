import { NextResponse, type NextRequest } from 'next/server';

const DIAGNOSTIC_API_PREFIXES = ['/api/debug', '/api/test'];
const INSECURE_JWT_SECRET = 'your-secret-key';

function isDiagnosticApi(pathname: string): boolean {
  return DIAGNOSTIC_API_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function hasSecureJwtSecret(): boolean {
  const secret = process.env.JWT_SECRET;
  return !!secret && secret !== INSECURE_JWT_SECRET;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'production' && isDiagnosticApi(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  if (process.env.NODE_ENV === 'production' && !hasSecureJwtSecret()) {
    return NextResponse.json(
      { message: 'Server authentication is not configured' },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
