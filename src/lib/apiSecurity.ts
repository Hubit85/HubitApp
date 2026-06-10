import type { NextApiResponse } from 'next';

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function blockProductionDiagnosticRoute(res: NextApiResponse): boolean {
  if (!isProductionRuntime()) {
    return false;
  }

  res.status(404).json({ message: 'Not found' });
  return true;
}
