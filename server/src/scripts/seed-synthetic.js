/**
 * Gera respostas SINTÉTICAS no banco de TESTE (MONGODB_URI_TEST) — nunca no
 * banco da coleta. Uso: npm run seed:synthetic --workspace=@pesquisa/server [-- --count=N]
 * Determinístico (LCG com seed fixa): mesma sequência a cada execução.
 */
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
dotenv.config({ path: path.join(rootDir, '.env') });

import mongoose from 'mongoose';
import {
  EDUCATION_LEVELS,
  STUDY_AREAS,
  WORK_STATUSES,
  SOCIAL_NETWORKS,
  DAILY_USAGES,
  MAIN_REASONS,
  PRODUCTIVITY_IMPACTS,
  POST_USE_FEELINGS,
  REDUCE_ATTEMPTS,
  CONTROL_METHODS,
  valuesOf,
} from '@pesquisa/shared';
import { SurveyResponse } from '../models/SurveyResponse.js';

const { MONGODB_URI_TEST } = process.env;
if (!MONGODB_URI_TEST) {
  console.error('MONGODB_URI_TEST não definida no .env.');
  process.exit(1);
}
if (MONGODB_URI_TEST.includes('pesquisa_redes_sociais?') || /pesquisa_redes_sociais["']?$/.test(MONGODB_URI_TEST)) {
  console.error('Trava de segurança: MONGODB_URI_TEST aponta para o banco REAL. Abortando.');
  process.exit(1);
}

const countArg = Number(process.argv[process.argv.indexOf('--count') + 1]);
const COUNT = Number.isInteger(countArg) && countArg > 0 ? Math.min(countArg, 500) : 24;

// LCG determinístico — mesma massa de teste em toda execução
let seed = 42;
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickMany = (arr, max) => {
  const n = 1 + Math.floor(rand() * max);
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length > 0) {
    out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  }
  return out;
};
const rating = () => 1 + Math.floor(rand() * 5);

const NETS = valuesOf(SOCIAL_NETWORKS).filter((n) => n !== 'none');

function makeDoc(i) {
  const nets = rand() < 0.06 ? ['none'] : pickMany(NETS, 4);
  const hasReal = nets.some((n) => n !== 'none');
  return {
    consentGiven: true,
    studentConfirmed: true,
    educationLevel: pick(valuesOf(EDUCATION_LEVELS)),
    studyArea: pick(valuesOf(STUDY_AREAS)),
    worksWhileStudying: pick(valuesOf(WORK_STATUSES)),
    socialNetworks: nets,
    mainNetwork: hasReal ? nets.find((n) => n !== 'none') : undefined,
    dailyUsage: pick(valuesOf(DAILY_USAGES)),
    accessSituations: {
      wakingUp: rating(), meals: rating(), studying: rating(),
      beforeSleep: rating(), boredom: rating(), anxiety: rating(),
    },
    mainReason: pick(valuesOf(MAIN_REASONS)),
    influenceRatings: {
      communication: rating(), usefulInformation: rating(), entertainment: rating(),
      concentrationInterference: rating(), academicProcrastination: rating(),
      excessiveTime: rating(), difficultyStopping: rating(), moodInfluence: rating(),
      socialComparison: rating(), opinionInfluence: rating(), relationships: rating(),
      inPersonInteraction: rating(),
    },
    sleepImpact: pick(['never', 'rarely', 'sometimes', 'frequently', 'always']),
    studyCheckingFrequency: pick(['never', 'rarely', 'sometimes', 'frequently', 'always']),
    academicProductivityImpact: pick(valuesOf(PRODUCTIVITY_IMPACTS)),
    postUseFeelings: pickMany(valuesOf(POST_USE_FEELINGS), 3),
    triedToReduce: pick(valuesOf(REDUCE_ATTEMPTS)),
    controlMethods: pickMany(valuesOf(CONTROL_METHODS), 3),
    ...(i % 3 === 0 ? { openComment: `Comentário sintético nº ${i} — massa de teste.` } : {}),
    questionnaireVersion: '1.0',
  };
}

await mongoose.connect(MONGODB_URI_TEST);
console.log('banco:', mongoose.connection.db.databaseName);
await SurveyResponse.deleteMany({});
const docs = await SurveyResponse.insertMany(Array.from({ length: COUNT }, (_, i) => makeDoc(i)));
console.log(`${docs.length} respostas sintéticas inseridas (banco de teste).`);
await mongoose.disconnect();
process.exit(0);
