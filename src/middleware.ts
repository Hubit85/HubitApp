import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_PRODUCTION_API_PREFIXES = [
  "/api/debug",
  "/api/test",
];

const BLOCKED_PRODUCTION_API_PATHS = new Set([
  "/api/auth/login",
]);

const LEGACY_JWT_API_PREFIXES = [
  "/api/auth/profile",
  "/api/analytics",
  "/api/subscriptions",
  "/api/quotes",
  "/api/properties",
  "/api/payments",
  "/api/notifications",
  "/api/contracts",
  "/api/invoices",
  "/api/communities",
  "/api/budget-requests",
];

const PUBLIC_API_PATHS = new Set([
  "/api/payments/plans",
]);

function isLegacyJwtApi(pathname: string) {
  if (PUBLIC_API_PATHS.has(pathname)) {
    return false;
  }

  return LEGACY_JWT_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasSafeJwtSecret() {
  const secret = process.env.JWT_SECRET;
  return Boolean(secret && secret !== "your-secret-key");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  if (
    BLOCKED_PRODUCTION_API_PATHS.has(pathname) ||
    BLOCKED_PRODUCTION_API_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return new NextResponse(null, { status: 404 });
  }

  if (isLegacyJwtApi(pathname) && !hasSafeJwtSecret()) {
    return NextResponse.json(
      { message: "Authentication service is not configured" },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
