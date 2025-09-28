import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const subscriptionPlans = [
  {
    id: 'plan-basic',
    name: 'Plan Básico',
    description: 'Funcionalidades básicas para usuarios particulares',
    price: 9.99,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Hasta 3 solicitudes de presupuesto por mes',
      'Gestión básica de propiedades',
      'Soporte por email',
      'Acceso a proveedores verificados'
    ],
    userTypes: ['particular'],
    isActive: true,
  },
  {
    id: 'plan-premium',
    name: 'Plan Premium',
    description: 'Funcionalidades avanzadas para proveedores de servicios',
    price: 29.99,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Solicitudes de presupuesto ilimitadas',
      'Gestión avanzada de contratos',
      'Dashboard de analytics',
      'Soporte prioritario',
      'Herramientas de marketing',
      'Gestión de equipos'
    ],
    userTypes: ['service_provider'],
    isActive: true,
  },
  {
    id: 'plan-community',
    name: 'Plan Comunidad',
    description: 'Gestión completa para administradores de fincas',
    price: 99.99,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Gestión ilimitada de comunidades',
      'Portal de propietarios',
      'Facturación automática',
      'Reportes financieros',
      'Gestión de incidencias',
      'Soporte 24/7',
      'API personalizada'
    ],
    userTypes: ['administrator'],
    isActive: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Plan Empresarial',
    description: 'Solución completa para grandes organizaciones',
    price: 299.99,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Todas las funcionalidades Premium',
      'Múltiples comunidades',
      'Integración con sistemas externos',
      'Soporte dedicado',
      'Personalización avanzada',
      'SLA garantizado',
      'Formación incluida'
    ],
    userTypes: ['administrator', 'service_provider'],
    isActive: true,
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userType } = req.query;
      
      let filteredPlans = subscriptionPlans.filter(plan => plan.isActive);
      
      if (userType) {
        filteredPlans = filteredPlans.filter(plan => 
          plan.userTypes.includes(userType as string)
        );
      }

      res.status(200).json(filteredPlans);
    } catch (error) {
      console.error('Get subscription plans error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
