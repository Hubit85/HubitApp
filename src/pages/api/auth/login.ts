
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'particular' | 'community_member' | 'service_provider' | 'administrator';
  isActive: boolean;
  profile?: any;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@hubit.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Administrador',
    role: 'administrator',
    isActive: true,
  },
  {
    id: '2',
    email: 'particular@hubit.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Usuario Particular',
    role: 'particular',
    isActive: true,
  },
  {
    id: '3',
    email: 'proveedor@hubit.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Proveedor de Servicios',
    role: 'service_provider',
    isActive: true,
  },
  {
    id: '4',
    email: 'comunidad@hubit.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Miembro Comunidad',
    role: 'community_member',
    isActive: true,
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as Partial<User>).password;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
