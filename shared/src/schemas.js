import { z } from 'zod';
import {
  EDUCATION_LEVELS,
  STUDY_AREAS,
  WORK_STATUSES,
  SOCIAL_NETWORKS,
  DAILY_USAGES,
  ACCESS_SITUATIONS,
  MAIN_REASONS,
  INFLUENCE_ITEMS,
  FREQUENCY_OPTIONS,
  PRODUCTIVITY_IMPACTS,
  POST_USE_FEELINGS,
  REDUCE_ATTEMPTS,
  CONTROL_METHODS,
  GENDERS,
  AGE_RANGES,
  SOCIAL_CLASSES,
  CONTENT_TYPES,
  HOBBIES,
  valuesOf,
} from './enums.js';

/** Enum opcional com mensagem de erro em pt-BR (nunca vaza o inglês cru do Zod). */
const optionalEnum = (options) =>
  z.enum(valuesOf(options), {
    errorMap: () => ({ message: 'Selecione uma opção válida.' }),
  });

/** Nota 1–5 de matriz/escala, com mensagens em pt-BR.
 * O preprocess converte "4" (string de radio HTML) para 4: radio nativo
 * sempre emite string e o RHF não aplica setValueAs/valueAsNumber a radios.
 * Servidor continua rejeitando campo desconhecido (.strict) e NaN. */
const rating = (label) =>
  z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v),
    z.number({
      required_error: `${label} é obrigatório.`,
      invalid_type_error: `${label} deve ser um número de 1 a 5.`,
    }).int()
      .min(1, { message: `${label} deve ser no mínimo 1.` })
      .max(5, { message: `${label} deve ser no máximo 5.` }),
  );

/** Campos por etapa — objetos plain para compor os schemas sem duplicar. */
const consentFields = {
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'É necessário concordar com a participação para continuar.' }),
  }),
  studentConfirmed: z.literal(true, {
    errorMap: () => ({ message: 'Confirme que você é estudante para continuar.' }),
  }),
};

const contextoFields = {
  educationLevel: z.enum(
    EDUCATION_LEVELS.map((o) => o.value),
    { errorMap: () => ({ message: 'Selecione o nível de ensino.' }) },
  ),
  studyArea: optionalEnum(STUDY_AREAS).optional(),
  worksWhileStudying: optionalEnum(WORK_STATUSES).optional(),
  gender: optionalEnum(GENDERS).optional(),
  ageRange: optionalEnum(AGE_RANGES).optional(),
  socialClass: optionalEnum(SOCIAL_CLASSES).optional(),
  contentTypes: z.array(z.enum(valuesOf(CONTENT_TYPES))).optional(),
  hobbies: z.array(z.enum(valuesOf(HOBBIES))).optional(),
};

const habitosFields = {
  socialNetworks: z
    .array(z.enum(valuesOf(SOCIAL_NETWORKS)))
    .min(1, { message: 'Selecione pelo menos uma opção.' }),
  mainNetwork: optionalEnum(SOCIAL_NETWORKS).optional(),
  dailyUsage: z.enum(valuesOf(DAILY_USAGES), {
    errorMap: () => ({ message: 'Selecione o tempo diário estimado.' }),
  }),
  accessSituations: z.object(
    Object.fromEntries(
      ACCESS_SITUATIONS.map((s) => [s.value, rating(`Frequência em "${s.label}"`)]),
    ),
  ),
  mainReason: optionalEnum(MAIN_REASONS).optional(),
};

const influenciaFields = {
  influenceRatings: z.object(
    Object.fromEntries(
      INFLUENCE_ITEMS.map((item) => [item.value, rating('Avaliação')]),
    ),
  ),
};

const bemEstarFields = {
  sleepImpact: optionalEnum(FREQUENCY_OPTIONS).optional(),
  studyCheckingFrequency: optionalEnum(FREQUENCY_OPTIONS).optional(),
  academicProductivityImpact: optionalEnum(PRODUCTIVITY_IMPACTS).optional(),
  postUseFeelings: z.array(z.enum(valuesOf(POST_USE_FEELINGS))).optional(),
  triedToReduce: optionalEnum(REDUCE_ATTEMPTS).optional(),
  controlMethods: z.array(z.enum(valuesOf(CONTROL_METHODS))).optional(),
};

const comentarioFields = {
  openComment: z
    .string()
    .max(2000, { message: 'O comentário deve ter no máximo 2000 caracteres.' })
    .optional(),
  balanceSuggestion: z
    .string()
    .max(2000, { message: 'A sugestão deve ter no máximo 2000 caracteres.' })
    .optional(),
};

/**
 * Regras de combinação da etapa hábitos — §9.
 * Aplicada tanto no schema da etapa (client) quanto no schema completo (server).
 * Não é só UI: o backend precisa rejeitar essas combinações também.
 */
function refineHabitos(data, ctx) {
  const hasNone = data.socialNetworks.includes('none');
  // "Nenhuma" não pode coexistir com outras redes (§9)
  if (hasNone && data.socialNetworks.length > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['socialNetworks'],
      message: 'A opção "Nenhuma" não pode ser combinada com outras redes.',
    });
  }
  // Rede principal precisa estar entre as selecionadas (§9)
  if (data.mainNetwork && !data.socialNetworks.includes(data.mainNetwork)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['mainNetwork'],
      message: 'Escolha a rede social utilizada com maior frequência entre as selecionadas.',
    });
  }
  // Obrigatória quando ≥1 rede real selecionada
  const hasRealNetwork = data.socialNetworks.some((n) => n !== 'none');
  if (hasRealNetwork && !data.mainNetwork) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['mainNetwork'],
      message: 'Escolha a rede social utilizada com maior frequência.',
    });
  }
}

/** Etapa consentimento — §8.2. Os dois aceites são obrigatórios no envio. */
export const consentSchema = z.object(consentFields);

/** Etapa contexto acadêmico — §8.3 */
export const contextoSchema = z.object(contextoFields);

/** Etapa hábitos — §8.4, com as regras de combinação */
export const habitosSchema = z.object(habitosFields).superRefine(refineHabitos);

/** Etapa influência — §8.5. As 12 chaves, cada uma 1–5. */
export const influenciaSchema = z.object(influenciaFields);

/** Etapa bem-estar — §8.6 */
export const bemEstarSchema = z.object(bemEstarFields);

/** Etapa comentário — §8.7. Ambos opcionais, máx. 2000 caracteres. */
export const comentarioSchema = z.object(comentarioFields);

/**
 * Resposta completa — o que o POST /api/survey-responses aceita.
 * `.strict()` rejeita campos inesperados (§15) em vez de ignorá-los.
 */
export const surveyResponseSchema = z
  .object({
    ...consentFields,
    ...contextoFields,
    ...habitosFields,
    ...influenciaFields,
    ...bemEstarFields,
    ...comentarioFields,
    questionnaireVersion: z.string().default('1.0'),
  })
  .strict()
  .superRefine(refineHabitos);
