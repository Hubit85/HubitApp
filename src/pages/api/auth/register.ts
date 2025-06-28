
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'particular' | 'community_member' | 'service_provider' | 'administrator';
  phone?: string;
  address?: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mockUsers: User[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name, role, phone, address }: RegisterRequest = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Email, password, name, and role are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role,
      phone,
      address,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.push(newUser);

    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
