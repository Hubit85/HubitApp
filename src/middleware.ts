import { NextRequest, NextResponse } from "next/server";

const PRODUCTION_ONLY_BLOCKED_PREFIXES = ["/api/debug", "/api/test"];
const PRODUCTION_ONLY_BLOCKED_PATHS = new Set(["/api/auth/login"]);

const LEGACY_JWT_PREFIXES = [
  "/api/analytics/dashboard",
  "/api/auth/profile",
  "/api/budget-requests",
  "/api/communities",
  "/api/contracts",
  "/api/invoices",
  "/api/notifications",
  "/api/payments/confirm",
  "/api/payments/intent",
  "/api/payments/methods",
  "/api/payments/paypal",
  "/api/payments/stats",
  "/api/payments/stripe",
  "/api/properties",
  "/api/quotes",
  "/api/subscriptions",
];

function matchesPathPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function hasSafeJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  return Boolean(secret && secret !== "your-secret-key");
}

function isLegacyJwtRoute(pathname: string) {
  if (pathname === "/api/payments") {
    return true;
  }

  if (/^\/api\/payments\/[^/]+\/refund$/.test(pathname)) {
    return true;
  }

  return LEGACY_JWT_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix));
}

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    PRODUCTION_ONLY_BLOCKED_PATHS.has(pathname) ||
    PRODUCTION_ONLY_BLOCKED_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix))
  ) {
    return new NextResponse(null, { status: 404 });
  }

  if (isLegacyJwtRoute(pathname) && !hasSafeJwtSecret()) {
    return NextResponse.json(
      { message: "Authentication is not configured" },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
