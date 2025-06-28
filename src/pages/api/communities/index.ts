
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

const mockCommunities: any[] = [
  {
    id: 'comm-1',
    name: 'Urbanización Las Flores',
    description: 'Comunidad residencial con jardines y piscina',
    address: {
      street: 'Avenida de las Flores 1-50',
      city: 'Sevilla',
      postalCode: '41013',
      country: 'España',
      coordinates: { lat: 37.3891, lng: -5.9845 }
    },
    administratorId: '1',
    totalUnits: 50,
    occupiedUnits: 45,
    monthlyFee: 75.00,
    currency: 'EUR',
    amenities: [
      'Piscina comunitaria',
      'Jardines',
      'Parking',
      'Portero automático',
      'Ascensor'
    ],
    rules: [
      'No se permiten mascotas grandes',
      'Horario de piscina: 9:00-22:00',
      'Silencio a partir de las 22:00'
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Estatutos de la comunidad',
        type: 'statutes',
        url: '/documents/estatutos.pdf',
        uploadedAt: new Date('2024-01-01')
      }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: 'comm-2',
    name: 'Residencial El Parque',
    description: 'Moderna comunidad con servicios premium',
    address: {
      street: 'Calle del Parque 10-30',
      city: 'Madrid',
      postalCode: '28001',
      country: 'España',
      coordinates: { lat: 40.4168, lng: -3.7038 }
    },
    administratorId: '1',
    totalUnits: 80,
    occupiedUnits: 72,
    monthlyFee: 120.00,
    currency: 'EUR',
    amenities: [
      'Gimnasio',
      'Piscina climatizada',
      'Sala de reuniones',
      'Parking subterráneo',
      'Conserjería 24h'
    ],
    rules: [
      'Acceso con tarjeta magnética',
      'Reserva previa para sala de reuniones',
      'Normas de convivencia estrictas'
    ],
    documents: [],
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-01'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const { city, minFee, maxFee } = req.query;
        let filteredCommunities = [...mockCommunities];

        if (city) {
          filteredCommunities = filteredCommunities.filter(community =>
            community.address.city.toLowerCase().includes((city as string).toLowerCase())
          );
        }

        if (minFee) {
          filteredCommunities = filteredCommunities.filter(community =>
            community.monthlyFee >= parseFloat(minFee as string)
          );
        }

        if (maxFee) {
          filteredCommunities = filteredCommunities.filter(community =>
            community.monthlyFee <= parseFloat(maxFee as string)
          );
        }

        res.status(200).json(filteredCommunities);
      } catch (error) {
        console.error('Get communities error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const communityData = req.body;
        const administratorId = req.user?.userId;

        const newCommunity = {
          id: uuidv4(),
          administratorId,
          ...communityData,
          occupiedUnits: 0,
          documents: [],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockCommunities.push(newCommunity);

        res.status(201).json({
          message: 'Community created successfully',
          community: newCommunity,
        });
      } catch (error) {
        console.error('Create community error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
