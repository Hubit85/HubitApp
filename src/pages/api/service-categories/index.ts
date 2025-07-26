
import { NextApiRequest, NextApiResponse } from 'next';

const serviceCategories = [
  {
    id: 'plumbing',
    name: 'Fontanería',
    description: 'Reparación e instalación de sistemas de agua y desagües',
    icon: 'wrench',
    subcategories: [
      'Reparación de fugas',
      'Instalación de grifos',
      'Desatasco de tuberías',
      'Calentadores de agua'
    ]
  },
  {
    id: 'electrical',
    name: 'Electricidad',
    description: 'Instalaciones y reparaciones eléctricas',
    icon: 'zap',
    subcategories: [
      'Instalación de enchufes',
      'Reparación de averías',
      'Iluminación',
      'Cuadros eléctricos'
    ]
  },
  {
    id: 'gardening',
    name: 'Jardinería',
    description: 'Mantenimiento y diseño de jardines',
    icon: 'leaf',
    subcategories: [
      'Poda de árboles',
      'Mantenimiento césped',
      'Diseño paisajístico',
      'Sistemas de riego'
    ]
  },
  {
    id: 'cleaning',
    name: 'Limpieza',
    description: 'Servicios de limpieza profesional',
    icon: 'sparkles',
    subcategories: [
      'Limpieza doméstica',
      'Limpieza de oficinas',
      'Limpieza post-obra',
      'Limpieza de cristales'
    ]
  },
  {
    id: 'painting',
    name: 'Pintura',
    description: 'Servicios de pintura interior y exterior',
    icon: 'palette',
    subcategories: [
      'Pintura interior',
      'Pintura exterior',
      'Pintura decorativa',
      'Restauración'
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpintería',
    description: 'Trabajos en madera y muebles',
    icon: 'hammer',
    subcategories: [
      'Muebles a medida',
      'Reparación de puertas',
      'Instalación de armarios',
      'Tarimas y suelos'
    ]
  },
  {
    id: 'hvac',
    name: 'Climatización',
    description: 'Calefacción, ventilación y aire acondicionado',
    icon: 'thermometer',
    subcategories: [
      'Instalación aire acondicionado',
      'Reparación calefacción',
      'Mantenimiento sistemas',
      'Ventilación'
    ]
  },
  {
    id: 'security',
    name: 'Seguridad',
    description: 'Sistemas de seguridad y cerrajería',
    icon: 'shield',
    subcategories: [
      'Cerrajería',
      'Sistemas de alarma',
      'Videovigilancia',
      'Control de acceso'
    ]
  },
  {
    id: 'maintenance',
    name: 'Mantenimiento General',
    description: 'Servicios generales de mantenimiento',
    icon: 'settings',
    subcategories: [
      'Reparaciones menores',
      'Mantenimiento preventivo',
      'Instalaciones varias',
      'Servicios técnicos'
    ]
  },
  {
    id: 'moving',
    name: 'Mudanzas',
    description: 'Servicios de mudanza y transporte',
    icon: 'truck',
    subcategories: [
      'Mudanzas locales',
      'Mudanzas nacionales',
      'Embalaje',
      'Montaje/desmontaje'
    ]
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { search } = req.query;
      
      let filteredCategories = serviceCategories;
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredCategories = serviceCategories.filter(category =>
          category.name.toLowerCase().includes(searchTerm) ||
          category.description.toLowerCase().includes(searchTerm) ||
          category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm))
        );
      }

      res.status(200).json(filteredCategories);
    } catch (error) {
      console.error('Get service categories error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
