import type { NextApiRequest, NextApiResponse } from "next";

export function requireDiagnosticsAccess(req: NextApiRequest, res: NextApiResponse): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const expectedToken = process.env.HUBIT_DIAGNOSTICS_TOKEN;
  const providedToken = req.headers["x-hubit-diagnostics-token"];

  if (expectedToken && providedToken === expectedToken) {
    return true;
  }

  res.status(404).json({ error: "Not found" });
  return false;
}
