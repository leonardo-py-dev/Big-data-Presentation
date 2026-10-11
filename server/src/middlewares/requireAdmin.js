import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { COOKIE_NAME } from '../services/auth.service.js';

/**
 * Exige sessão admin válida. 401 genérico — sem detalhar se o token
 * expirou, é inválido ou inexistente.
 */
export function requireAdmin(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    const err = new Error('Autenticação necessária.');
    err.status = 401;
    err.code = 'UNAUTHORIZED';
    return next(err);
  }
  try {
    req.admin = jwt.verify(token, env.JWT_SECRET);
    return next();
  } catch {
    const err = new Error('Autenticação necessária.');
    err.status = 401;
    err.code = 'UNAUTHORIZED';
    return next(err);
  }
}
