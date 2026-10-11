import { SurveyResponse } from '../models/SurveyResponse.js';

/** Regra de negócio isolada do HTTP: recebe dado validado, persiste, devolve o doc. */
export async function createSurveyResponse(data) {
  const doc = await SurveyResponse.create(data);
  return doc;
}
