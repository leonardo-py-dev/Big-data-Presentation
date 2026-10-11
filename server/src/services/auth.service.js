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
  // Produção cross-site (front na Vercel + API em outro host): o navegador
  // só envia o cookie com SameSite=None + Secure. Em dev local (http),
  // None+Secure seria rejeitado — por isso a chave COOKIE_SECURE.
  const secureCookies = env.COOKIE_SECURE;
  return {
    httpOnly: true,
    sameSite: secureCookies ? 'none' : 'lax',
    secure: secureCookies,
    maxAge: SESSION_TTL_MS,
    path: '/',
  };
}
