import { createSurveyResponse } from '../services/survey.service.js';

/** Controller traduz HTTP: delega ao service, responde 201. Sem regra de negócio aqui. */
export async function postSurveyResponse(req, res, next) {
  try {
    const doc = await createSurveyResponse(req.validatedBody);
    res.status(201).json({ id: doc._id, createdAt: doc.createdAt });
  } catch (err) {
    next(err);
  }
}

export function getHealth(_req, res) {
  res.json({ status: 'ok' });
}
