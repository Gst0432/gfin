import { User } from '../../types';
import { query } from '../db';
import { compare } from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  is_premium: number;
  premium_expiry_date: string | null;
  created_at: string;
  is_active: number;
  company_info: string | null;
}

export async function validateUser(email: string, password: string): Promise<User> {
  try {
    const sql = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
    const [rows] = await query<UserRow[]>(sql, [email]);

    if (!rows || rows.length === 0) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const user = rows[0];

    const isValidPassword = await compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: Boolean(user.is_premium),
      premiumExpiryDate: user.premium_expiry_date || undefined,
      createdAt: user.created_at,
      isActive: Boolean(user.is_active),
      companyInfo: user.company_info ? JSON.parse(user.company_info) : undefined
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Erreur lors de l\'authentification');
  }
}