import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { postLogin, postLogout, getMe } from '../controllers/auth.controller.js';
import {
  getResponses,
  getResponsesSummary,
  exportResponsesCsv,
  deleteResponse,
} from '../controllers/adminSurvey.controller.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';

const router = Router();

/** Login: limite agressivo — é a porta de entrada da área protegida. */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Muitas tentativas de login. Aguarde alguns minutos.',
    },
  },
});

router.post('/auth/login', loginLimiter, postLogin);
router.post('/auth/logout', postLogout);
router.get('/auth/me', requireAdmin, getMe);

// Dados da pesquisa — tudo atrás de requireAdmin (§15, §16)
router.get('/survey-responses/summary', requireAdmin, getResponsesSummary);
router.get('/survey-responses/export.csv', requireAdmin, exportResponsesCsv);
router.get('/survey-responses', requireAdmin, getResponses);
router.delete('/survey-responses/:id', requireAdmin, deleteResponse);

export default router;
