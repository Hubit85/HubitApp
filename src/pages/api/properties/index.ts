
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

const mockProperties: any[] = [
  {
    id: 'prop-1',
    ownerId: '2',
    title: 'Piso en Centro Madrid',
    description: 'Apartamento de 3 habitaciones en el centro de Madrid',
    type: 'apartment',
    address: {
      street: 'Calle Mayor 123',
      city: 'Madrid',
      postalCode: '28013',
      country: 'España',
      coordinates: { lat: 40.4168, lng: -3.7038 }
    },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      floor: 3,
      elevator: true,
      parking: false,
      terrace: true,
      furnished: false
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    communityId: null,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'prop-2',
    ownerId: '2',
    title: 'Casa Unifamiliar Barcelona',
    description: 'Casa independiente con jardín en Barcelona',
    type: 'house',
    address: {
      street: 'Carrer de Balmes 456',
      city: 'Barcelona',
      postalCode: '08006',
      country: 'España',
      coordinates: { lat: 41.3851, lng: 2.1734 }
    },
    details: {
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      floor: 0,
      elevator: false,
      parking: true,
      terrace: false,
      garden: true,
      furnished: true
    },
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    ],
    communityId: null,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  authenticateToken(req, res, () => {
    if (req.method === 'GET') {
      try {
        const userId = req.user?.userId;
        const { type, city, minArea, maxArea } = req.query;

        let filteredProperties = mockProperties.filter(property => property.ownerId === userId);

        if (type) {
          filteredProperties = filteredProperties.filter(property => property.type === type);
        }

        if (city) {
          filteredProperties = filteredProperties.filter(property => 
            property.address.city.toLowerCase().includes((city as string).toLowerCase())
          );
        }

        if (minArea) {
          filteredProperties = filteredProperties.filter(property => 
            property.details.area >= parseInt(minArea as string)
          );
        }

        if (maxArea) {
          filteredProperties = filteredProperties.filter(property => 
            property.details.area <= parseInt(maxArea as string)
          );
        }

        res.status(200).json(filteredProperties);
      } catch (error) {
        console.error('Get properties error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const ownerId = req.user?.userId;
        const propertyData = req.body;

        const newProperty = {
          id: uuidv4(),
          ownerId,
          ...propertyData,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockProperties.push(newProperty);

        res.status(201).json({
          message: 'Property created successfully',
          property: newProperty,
        });
      } catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
