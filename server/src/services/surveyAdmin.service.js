import { z } from 'zod';
import {
  EDUCATION_LEVELS,
  STUDY_AREAS,
  DAILY_USAGES,
  SOCIAL_NETWORKS,
  valuesOf,
} from '@pesquisa/shared';
import { SurveyResponse } from '../models/SurveyResponse.js';

/** Filtros da listagem (RF10). Chave desconhecida é ignorada; page/limit têm teto. */
const filterSchema = z.object({
  educationLevel: z.enum(valuesOf(EDUCATION_LEVELS)).optional(),
  studyArea: z.enum(valuesOf(STUDY_AREAS)).optional(),
  dailyUsage: z.enum(valuesOf(DAILY_USAGES)).optional(),
  mainNetwork: z.enum(valuesOf(SOCIAL_NETWORKS)).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export function parseFilter(query) {
  const parsed = filterSchema.safeParse(query);
  if (!parsed.success) {
    const err = new Error('Filtros inválidos.');
    err.status = 400;
    err.code = 'INVALID_FILTERS';
    throw err;
  }
  const { page, limit, from, to, ...fields } = parsed.data;
  const match = { ...fields };
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = from;
    if (to) match.createdAt.$lte = to;
  }
  return { match, page, limit };
}

export async function listSurveys(match, page, limit) {
  const [total, data] = await Promise.all([
    SurveyResponse.countDocuments(match),
    SurveyResponse.find(match).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
  ]);
  return { data, page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) };
}

const RATING_KEYS = [
  'communication', 'usefulInformation', 'entertainment', 'concentrationInterference',
  'academicProcrastination', 'excessiveTime', 'difficultyStopping', 'moodInfluence',
  'socialComparison', 'opinionInfluence', 'relationships', 'inPersonInteraction',
];

/**
 * Indicadores agregados (RF11). Tudo calculado no MongoDB.
 * O `n` acompanha cada bloco (§16 — sem amostra, sem conclusão).
 */
export async function getSummary(match) {
  const avgStage = { _id: null };
  for (const k of RATING_KEYS) avgStage[k] = { $avg: `$influenceRatings.${k}` };

  const [res] = await SurveyResponse.aggregate([
    { $match: match },
    {
      $facet: {
        total: [{ $count: 'n' }],
        byDailyUsage: [{ $group: { _id: '$dailyUsage', n: { $sum: 1 } } }, { $sort: { n: -1 } }],
        byNetwork: [
          { $unwind: '$socialNetworks' },
          { $group: { _id: '$socialNetworks', n: { $sum: 1 } } },
          { $sort: { n: -1 } },
        ],
        byReason: [{ $group: { _id: '$mainReason', n: { $sum: 1 } } }, { $sort: { n: -1 } }],
        byEducation: [{ $group: { _id: '$educationLevel', n: { $sum: 1 } } }, { $sort: { n: -1 } }],
        avgRatings: [{ $group: avgStage }],
        sleepOften: [
          { $match: { sleepImpact: { $in: ['frequently', 'always'] } } },
          { $count: 'n' },
        ],
        studyOften: [
          { $match: { studyCheckingFrequency: { $in: ['frequently', 'always'] } } },
          { $count: 'n' },
        ],
        controlTop: [
          { $unwind: '$controlMethods' },
          { $group: { _id: '$controlMethods', n: { $sum: 1 } } },
          { $sort: { n: -1 } },
          { $limit: 7 },
        ],
      },
    },
  ]);

  const n = res.total[0]?.n ?? 0;
  const avg = res.avgRatings[0] ?? {};
  const avgRatings = {};
  for (const k of RATING_KEYS) {
    avgRatings[k] = avg[k] == null ? null : Math.round(avg[k] * 100) / 100;
  }
  const pct = (c) => (n === 0 ? 0 : Math.round(((c?.[0]?.n ?? 0) / n) * 1000) / 10);
  return {
    n,
    byDailyUsage: res.byDailyUsage,
    byNetwork: res.byNetwork,
    byReason: res.byReason.filter((r) => r._id != null),
    byEducation: res.byEducation,
    avgRatings,
    sleepOftenPct: pct(res.sleepOften),
    studyOftenPct: pct(res.studyOften),
    controlTop: res.controlTop,
  };
}

/** Colunas do CSV — só campos previstos, jamais dado pessoal (nem existe no modelo). */
const COLUMNS = [
  ['id', (d) => String(d._id)],
  ['createdAt', (d) => d.createdAt?.toISOString() ?? ''],
  ['questionnaireVersion', (d) => d.questionnaireVersion ?? ''],
  ['educationLevel', (d) => d.educationLevel ?? ''],
  ['studyArea', (d) => d.studyArea ?? ''],
  ['worksWhileStudying', (d) => d.worksWhileStudying ?? ''],
  ['socialNetworks', (d) => (d.socialNetworks ?? []).join('|')],
  ['mainNetwork', (d) => d.mainNetwork ?? ''],
  ['dailyUsage', (d) => d.dailyUsage ?? ''],
  ['access_wakingUp', (d) => d.accessSituations?.wakingUp ?? ''],
  ['access_meals', (d) => d.accessSituations?.meals ?? ''],
  ['access_studying', (d) => d.accessSituations?.studying ?? ''],
  ['access_beforeSleep', (d) => d.accessSituations?.beforeSleep ?? ''],
  ['access_boredom', (d) => d.accessSituations?.boredom ?? ''],
  ['access_anxiety', (d) => d.accessSituations?.anxiety ?? ''],
  ['mainReason', (d) => d.mainReason ?? ''],
  ...RATING_KEYS.map((k) => [`rating_${k}`, (d) => d.influenceRatings?.[k] ?? '']),
  ['sleepImpact', (d) => d.sleepImpact ?? ''],
  ['studyCheckingFrequency', (d) => d.studyCheckingFrequency ?? ''],
  ['academicProductivityImpact', (d) => d.academicProductivityImpact ?? ''],
  ['postUseFeelings', (d) => (d.postUseFeelings ?? []).join('|')],
  ['triedToReduce', (d) => d.triedToReduce ?? ''],
  ['controlMethods', (d) => (d.controlMethods ?? []).join('|')],
  ['openComment', (d) => d.openComment ?? ''],
  ['balanceSuggestion', (d) => d.balanceSuggestion ?? ''],
];

/** Escaping RFC 4180 — comentário aberto pode ter vírgula, aspa e quebra de linha. */
export function escapeCsv(value) {
  const s = String(value ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function csvHeader() {
  return COLUMNS.map(([h]) => h).join(',');
}

export function csvRow(doc) {
  return COLUMNS.map(([, get]) => escapeCsv(get(doc))).join(',');
}

/** Stream via cursor — não carrega a coleta inteira na memória. */
export async function streamCsv(match, writable) {
  writable.write('\uFEFF');
  writable.write(csvHeader() + '\n');
  const cursor = SurveyResponse.find(match).sort({ createdAt: -1 }).lean().cursor();
  for await (const doc of cursor) {
    if (!writable.write(csvRow(doc) + '\n')) {
      await new Promise((resolve) => writable.once('drain', resolve));
    }
  }
}

export async function deleteSurvey(id) {
  const doc = await SurveyResponse.findByIdAndDelete(id);
  if (!doc) {
    const err = new Error('Resposta não encontrada.');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
  // Registro técnico da ação: só o id, nunca o conteúdo (§15)
  console.log(JSON.stringify({ action: 'survey.delete', id: String(doc._id), at: new Date().toISOString() }));
}
