import type { NextApiResponse } from 'next';

export function isProductionRuntime() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

export function blockProductionDiagnostics(res: NextApiResponse) {
  if (!isProductionRuntime()) {
    return false;
  }

  res.status(404).json({ message: 'Not found' });
  return true;
}
