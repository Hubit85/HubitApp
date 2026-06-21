import { NextRequest, NextResponse } from "next/server";

const PRODUCTION_ONLY_BLOCKED_ROUTES = [
  "/api/debug",
  "/api/test",
  "/api/auth/login",
];

const LEGACY_JWT_ROUTES = [
  "/api/analytics",
  "/api/auth/profile",
  "/api/budget-requests",
  "/api/communities",
  "/api/contracts",
  "/api/invoices",
  "/api/notifications",
  "/api/properties",
  "/api/quotes",
  "/api/subscriptions",
];

const LEGACY_JWT_PAYMENT_ROUTES = [
  "/api/payments",
];

const PUBLIC_PAYMENT_ROUTES = [
  "/api/payments/plans",
];

function matchesPath(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isBlockedDiagnosticOrMockRoute(pathname: string) {
  return PRODUCTION_ONLY_BLOCKED_ROUTES.some((route) => matchesPath(pathname, route));
}

function isLegacyJwtRoute(pathname: string) {
  if (LEGACY_JWT_ROUTES.some((route) => matchesPath(pathname, route))) {
    return true;
  }

  if (PUBLIC_PAYMENT_ROUTES.some((route) => matchesPath(pathname, route))) {
    return false;
  }

  return LEGACY_JWT_PAYMENT_ROUTES.some((route) => matchesPath(pathname, route));
}

function hasSecureJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  return !!secret && secret !== "your-secret-key";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  if (isBlockedDiagnosticOrMockRoute(pathname)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (isLegacyJwtRoute(pathname) && !hasSecureJwtSecret()) {
    return NextResponse.json(
      { message: "Authentication service is not configured" },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
