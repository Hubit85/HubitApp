import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCTION_BLOCKED_API_PREFIXES = [
  "/api/debug",
  "/api/test",
];

const PRODUCTION_BLOCKED_API_ROUTES = new Set([
  "/api/auth/login",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === "production") {
    const isBlockedDiagnosticRoute = PRODUCTION_BLOCKED_API_PREFIXES.some((prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    if (isBlockedDiagnosticRoute || PRODUCTION_BLOCKED_API_ROUTES.has(pathname)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
