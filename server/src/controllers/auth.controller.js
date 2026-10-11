import { z } from 'zod';
import {
  verifyCredentials,
  signSession,
  cookieOptions,
  COOKIE_NAME,
} from '../services/auth.service.js';

const loginSchema = z.object({
  email: z.string().email({ message: 'Informe um e-mail válido.' }).max(254),
  password: z.string().min(1, { message: 'Informe a senha.' }).max(256),
});

/** POST /api/admin/auth/login — mensagem genérica anti-enumeração. */
export async function postLogin(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      // Formato inválido recebe a MESMA resposta de credencial errada
      return fail(res);
    }
    const admin = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (!admin) return fail(res);
    res.cookie(COOKIE_NAME, signSession(admin), cookieOptions());
    return res.json({ email: admin.email });
  } catch (err) {
    return next(err);
  }
}

function fail(res) {
  return res.status(401).json({
    error: { code: 'INVALID_CREDENTIALS', message: 'E-mail ou senha incorretos.' },
  });
}

/** POST /api/admin/auth/logout — limpa o cookie de sessão. */
export function postLogout(_req, res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.status(204).end();
}

/** GET /api/admin/auth/me — sonda de sessão para o guard do frontend. */
export function getMe(req, res) {
  res.json({ email: req.admin.email });
}
