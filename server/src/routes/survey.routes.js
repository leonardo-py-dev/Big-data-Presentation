import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { surveyResponseSchema } from '@pesquisa/shared';
import { validateBody } from '../middlewares/validate.js';
import { postSurveyResponse, getHealth } from '../controllers/survey.controller.js';

const router = Router();

/**
 * Rate limit SÓ no POST (RF08): endpoint público precisa de proteção
 * contra envio abusivo, mas sem autenticação (anonimato, §4.2).
 */
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    },
  },
});

router.get('/health', getHealth);
router.post('/survey-responses', submitLimiter, validateBody(surveyResponseSchema), postSurveyResponse);

export default router;
