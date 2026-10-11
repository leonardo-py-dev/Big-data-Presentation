import {
  parseFilter,
  listSurveys,
  getSummary,
  streamCsv,
  deleteSurvey,
} from '../services/surveyAdmin.service.js';

/** Controllers finos: filtro → service → resposta. Sem regra de negócio aqui. */

export async function getResponses(req, res, next) {
  try {
    const { match, page, limit } = parseFilter(req.query);
    res.json(await listSurveys(match, page, limit));
  } catch (err) {
    next(err);
  }
}

export async function getResponsesSummary(req, res, next) {
  try {
    const { match } = parseFilter(req.query);
    res.json(await getSummary(match));
  } catch (err) {
    next(err);
  }
}

export async function exportResponsesCsv(req, res, next) {
  try {
    const { match } = parseFilter(req.query);
    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="respostas-${stamp}.csv"`);
    await streamCsv(match, res);
    res.end();
  } catch (err) {
    next(err);
  }
}

export async function deleteResponse(req, res, next) {
  try {
    await deleteSurvey(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
