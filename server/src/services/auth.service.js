import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';
import { env } from '../config/env.js';

export const COOKIE_NAME = 'admin_token';
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h — um dia de trabalho de pesquisa

/** Retorna o admin se email+senha conferem, senão null (sem dizer qual falhou). */
export async function verifyCredentials(email, password) {
  const admin = await AdminUser.findOne({ email: String(email).toLowerCase().trim() });
  if (!admin) return null;
  const ok = await bcrypt.compare(String(password), admin.passwordHash);
  return ok ? admin : null;
}

export function signSession(admin) {
  return jwt.sign({ sub: String(admin._id), email: admin.email }, env.JWT_SECRET, {
    expiresIn: '12h',
  });
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
    path: '/',
  };
}
