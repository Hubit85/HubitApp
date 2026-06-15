
import { NextApiRequest, NextApiResponse } from 'next';

import { authenticateToken } from '@/lib/jwtAuth';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const { id } = req.query;

        const pdfContent = Buffer.from(`
          FACTURA ${id}
          ================
          
          Fecha: ${new Date().toLocaleDateString()}
          Cliente: Usuario HuBiT
          
          Descripción: Servicios profesionales
          Importe: 250.00 EUR
          IVA (21%): 52.50 EUR
          Total: 302.50 EUR
          
          Gracias por confiar en HuBiT
        `);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
        res.status(200).send(pdfContent);
      } catch (error) {
        console.error('Download invoice error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
