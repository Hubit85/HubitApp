import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DIAGNOSTIC_API_PATTERNS = [/^\/api\/debug(?:\/|$)/, /^\/api\/test(?:\/|$)/];

export function middleware(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    DIAGNOSTIC_API_PATTERNS.some(pattern => pattern.test(request.nextUrl.pathname))
  ) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/debug/:path*", "/api/test/:path*"],
};
