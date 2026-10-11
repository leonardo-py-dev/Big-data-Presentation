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

const { Schema } = mongoose;

/**
 * survey_responses — PRD §14.
 * Valores `enum` derivados do shared: mesma fonte do <select> do React.
 * Sem nenhum campo de identificação pessoal (§4.2, RNF05).
 */
const surveyResponseSchema = new Schema(
  {
    consentGiven: { type: Boolean, required: true },
    studentConfirmed: { type: Boolean, required: true },

    educationLevel: { type: String, enum: valuesOf(EDUCATION_LEVELS), required: true },
    studyArea: { type: String, enum: valuesOf(STUDY_AREAS) },
    worksWhileStudying: { type: String, enum: valuesOf(WORK_STATUSES) },

    socialNetworks: {
      type: [{ type: String, enum: valuesOf(SOCIAL_NETWORKS) }],
      required: true,
    },
    mainNetwork: { type: String, enum: valuesOf(SOCIAL_NETWORKS) },
    dailyUsage: { type: String, enum: valuesOf(DAILY_USAGES), required: true },
    accessSituations: {
      wakingUp: { type: Number, min: 1, max: 5 },
      meals: { type: Number, min: 1, max: 5 },
      studying: { type: Number, min: 1, max: 5 },
      beforeSleep: { type: Number, min: 1, max: 5 },
      boredom: { type: Number, min: 1, max: 5 },
      anxiety: { type: Number, min: 1, max: 5 },
    },
    mainReason: { type: String, enum: valuesOf(MAIN_REASONS) },

    influenceRatings: {
      communication: { type: Number, min: 1, max: 5 },
      usefulInformation: { type: Number, min: 1, max: 5 },
      entertainment: { type: Number, min: 1, max: 5 },
      concentrationInterference: { type: Number, min: 1, max: 5 },
      academicProcrastination: { type: Number, min: 1, max: 5 },
      excessiveTime: { type: Number, min: 1, max: 5 },
      difficultyStopping: { type: Number, min: 1, max: 5 },
      moodInfluence: { type: Number, min: 1, max: 5 },
      socialComparison: { type: Number, min: 1, max: 5 },
      opinionInfluence: { type: Number, min: 1, max: 5 },
      relationships: { type: Number, min: 1, max: 5 },
      inPersonInteraction: { type: Number, min: 1, max: 5 },
    },

    sleepImpact: { type: String, enum: ['never', 'rarely', 'sometimes', 'frequently', 'always'] },
    studyCheckingFrequency: {
      type: String,
      enum: ['never', 'rarely', 'sometimes', 'frequently', 'always'],
    },
    academicProductivityImpact: { type: String, enum: valuesOf(PRODUCTIVITY_IMPACTS) },
    postUseFeelings: [{ type: String, enum: valuesOf(POST_USE_FEELINGS) }],
    triedToReduce: { type: String, enum: valuesOf(REDUCE_ATTEMPTS) },
    controlMethods: [{ type: String, enum: valuesOf(CONTROL_METHODS) }],

    openComment: { type: String, maxlength: 2000 },
    balanceSuggestion: { type: String, maxlength: 2000 },

    questionnaireVersion: { type: String, default: '1.0' },
  },
  { timestamps: true },
);

/**
 * Índices APENAS nos campos usados nos filtros administrativos (RF10 + §14):
 * nível de ensino, área de estudo, tempo diário, rede principal, período de envio.
 * Nada além disso — índice sem uso é custo de escrita.
 */
surveyResponseSchema.index({ educationLevel: 1 });
surveyResponseSchema.index({ studyArea: 1 });
surveyResponseSchema.index({ dailyUsage: 1 });
surveyResponseSchema.index({ mainNetwork: 1 });
surveyResponseSchema.index({ createdAt: -1 });

export const SurveyResponse = mongoose.model('SurveyResponse', surveyResponseSchema, 'survey_responses');
