/**
 * Enums da pesquisa — FONTE ÚNICA DA VERDADE.
 *
 * Derivados do PRD §8 (opções exibidas) e §14 (valores gravados).
 * Regra: `value` em inglês snake_case vai para o MongoDB;
 * `label` em português do Brasil vai para a tela.
 *
 * Tanto o <select> do React quanto o `enum` do Mongoose leem daqui.
 * Nunca declare esses valores em outro lugar.
 */

/** Nível de ensino — §8.3, obrigatório */
export const EDUCATION_LEVELS = [
  { value: 'elementary', label: 'Ensino fundamental' },
  { value: 'high_school', label: 'Ensino médio' },
  { value: 'technical', label: 'Ensino técnico' },
  { value: 'undergraduate', label: 'Graduação' },
  { value: 'postgraduate', label: 'Pós-graduação' },
  { value: 'other', label: 'Outro' },
  { value: 'prefer_not_to_answer', label: 'Prefiro não responder' },
];

/** Área de estudo — §8.3, opcional. Categorias amplas por anonimato (§6). */
export const STUDY_AREAS = [
  { value: 'humanities', label: 'Ciências humanas' },
  { value: 'exact_sciences', label: 'Ciências exatas' },
  { value: 'biological_sciences', label: 'Ciências biológicas' },
  { value: 'health', label: 'Saúde' },
  { value: 'technology', label: 'Tecnologia' },
  { value: 'arts_communication', label: 'Artes e comunicação' },
  { value: 'other', label: 'Outra' },
  { value: 'prefer_not_to_answer', label: 'Prefiro não responder' },
];

/** Além de estudar, trabalha? — §8.3, opcional */
export const WORK_STATUSES = [
  { value: 'no', label: 'Não' },
  { value: 'part_time', label: 'Sim, em período parcial' },
  { value: 'full_time', label: 'Sim, em período integral' },
  { value: 'prefer_not_to_answer', label: 'Prefiro não responder' },
];

/** Redes sociais — §8.4, seleção múltipla, obrigatória.
 * "none" ("Nenhuma") NÃO pode coexistir com outras — regra de validação, não só UI (§9). */
export const SOCIAL_NETWORKS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'x_twitter', label: 'X/Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'other', label: 'Outra' },
  { value: 'none', label: 'Nenhuma' },
];

/** Tempo diário estimado — §8.4, obrigatório */
export const DAILY_USAGES = [
  { value: 'under_30m', label: 'Menos de 30 minutos' },
  { value: '30m_1h', label: 'De 30 minutos a 1 hora' },
  { value: '1_2h', label: 'De 1 a 2 horas' },
  { value: '2_4h', label: 'De 2 a 4 horas' },
  { value: '4_6h', label: 'De 4 a 6 horas' },
  { value: 'over_6h', label: 'Mais de 6 horas' },
  { value: 'unknown', label: 'Não sei estimar' },
];

/** Situações de acesso — §8.4, matriz de frequência 1–5.
 * Chaves em camelCase (modelo §14); labels em pt-BR. */
export const ACCESS_SITUATIONS = [
  { value: 'wakingUp', label: 'Ao acordar' },
  { value: 'meals', label: 'Durante as refeições' },
  { value: 'studying', label: 'Durante os estudos' },
  { value: 'beforeSleep', label: 'Antes de dormir' },
  { value: 'boredom', label: 'Quando está entediado(a)' },
  { value: 'anxiety', label: 'Quando está ansioso(a) ou preocupado(a)' },
];

/** Motivo principal — §8.4, seleção única */
export const MAIN_REASONS = [
  { value: 'entertainment', label: 'Entretenimento' },
  { value: 'communication', label: 'Comunicação' },
  { value: 'news_information', label: 'Notícias e informação' },
  { value: 'study_work', label: 'Estudos ou trabalho' },
  { value: 'friends_family', label: 'Acompanhar amigos e familiares' },
  { value: 'shopping', label: 'Compras' },
  { value: 'content_creation', label: 'Criar ou compartilhar conteúdo' },
  { value: 'passing_time', label: 'Passar o tempo' },
  { value: 'other', label: 'Outro' },
];

/** Afirmações de influência — §8.5, escala 1–5.
 * Ordem intencional do PRD (benefícios e impactos misturados).
 * NÃO reordenar — é desenho metodológico, não lista arbitrária. */
export const INFLUENCE_ITEMS = [
  { value: 'communication', label: 'As redes sociais facilitam minha comunicação com outras pessoas.' },
  { value: 'usefulInformation', label: 'As redes sociais me ajudam a encontrar informações úteis.' },
  { value: 'entertainment', label: 'As redes sociais contribuem para meu entretenimento.' },
  { value: 'concentrationInterference', label: 'As redes sociais interferem na minha concentração durante os estudos.' },
  { value: 'academicProcrastination', label: 'As redes sociais fazem com que eu adie tarefas acadêmicas.' },
  { value: 'excessiveTime', label: 'Sinto que as redes sociais ocupam mais tempo do que eu gostaria.' },
  { value: 'difficultyStopping', label: 'Tenho dificuldade para interromper o uso depois que começo.' },
  { value: 'moodInfluence', label: 'As redes sociais influenciam meu humor.' },
  { value: 'socialComparison', label: 'Comparo minha vida com a de pessoas que acompanho nas redes sociais.' },
  { value: 'opinionInfluence', label: 'As redes sociais influenciam minhas opiniões ou decisões.' },
  { value: 'relationships', label: 'As redes sociais ajudam a manter meus relacionamentos.' },
  { value: 'inPersonInteraction', label: 'As redes sociais prejudicam momentos de convivência presencial.' },
];

/** Rótulos da escala de concordância 1–5 — §8.5 */
export const AGREEMENT_SCALE = [
  { value: 1, label: 'Discordo totalmente' },
  { value: 2, label: 'Discordo parcialmente' },
  { value: 3, label: 'Nem concordo nem discordo' },
  { value: 4, label: 'Concordo parcialmente' },
  { value: 5, label: 'Concordo totalmente' },
];

/** Frequência (sono, estudos, matriz) — §8.4 e §8.6.
 * `value` 1–5 para a matriz; os enums de sono/estudo usam as strings. */
export const FREQUENCY_OPTIONS = [
  { value: 'never', label: 'Nunca' },
  { value: 'rarely', label: 'Raramente' },
  { value: 'sometimes', label: 'Às vezes' },
  { value: 'frequently', label: 'Frequentemente' },
  { value: 'always', label: 'Sempre' },
];

/** Impacto na produtividade acadêmica — §8.6 */
export const PRODUCTIVITY_IMPACTS = [
  { value: 'very_positive', label: 'Muito positivo' },
  { value: 'positive', label: 'Positivo' },
  { value: 'neutral', label: 'Neutro' },
  { value: 'negative', label: 'Negativo' },
  { value: 'very_negative', label: 'Muito negativo' },
  { value: 'unknown', label: 'Não sei avaliar' },
];

/** Como se sente após muito tempo — §8.6, seleção múltipla */
export const POST_USE_FEELINGS = [
  { value: 'relaxed', label: 'Mais relaxado(a)' },
  { value: 'informed', label: 'Mais informado(a)' },
  { value: 'connected', label: 'Mais conectado(a)' },
  { value: 'indifferent', label: 'Indiferente' },
  { value: 'tired', label: 'Cansado(a)' },
  { value: 'anxious', label: 'Ansioso(a)' },
  { value: 'frustrated', label: 'Frustrado(a)' },
  { value: 'other', label: 'Outro' },
];

/** Já tentou reduzir? — §8.6 */
export const REDUCE_ATTEMPTS = [
  { value: 'yes_maintained', label: 'Sim, e consegui manter a redução' },
  { value: 'yes_difficult', label: 'Sim, mas tive dificuldade' },
  { value: 'no_wants_to_try', label: 'Não, mas gostaria de tentar' },
  { value: 'no_interest', label: 'Não tenho interesse' },
  { value: 'unknown', label: 'Não sei' },
];

/** Estratégias de controle — §8.6, seleção múltipla */
export const CONTROL_METHODS = [
  { value: 'app_limits', label: 'Limite de aplicativos' },
  { value: 'notifications_disabled', label: 'Desativação de notificações' },
  { value: 'monitoring_app', label: 'Aplicativo de monitoramento' },
  { value: 'phone_free_periods', label: 'Períodos sem celular' },
  { value: 'phone_away_studying', label: 'Deixar o celular distante durante os estudos' },
  { value: 'none', label: 'Nenhuma' },
  { value: 'other', label: 'Outra' },
];

/** Gênero — §3.1, opcional. */
export const GENDERS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'non_binary', label: 'Não binário' },
  { value: 'other', label: 'Outro' },
  { value: 'prefer_not_to_answer', label: 'Prefiro não responder' },
];

/** Faixa etária — §3.2, opcional. */
export const AGE_RANGES = [
  { value: 'under_18', label: 'Menos de 18 anos' },
  { value: '18_24', label: '18 a 24 anos' },
  { value: '25_34', label: '25 a 34 anos' },
  { value: '35_44', label: '35 a 44 anos' },
  { value: '45_plus', label: '45 anos ou mais' },
  { value: 'prefer_not_to_answer', label: 'Prefiro não responder' },
];

/** Classe social (autoclassificação) — §3.3, opcional. */
export const SOCIAL_CLASSES = [
  { value: 'lower', label: 'Baixa' },
  { value: 'lower_middle', label: 'Média-baixa' },
  { value: 'middle', label: 'Média' },
  { value: 'upper_middle', label: 'Média-alta' },
  { value: 'upper', label: 'Alta' },
  { value: 'prefer_not_to_answer', label: 'Prefiro não responder' },
];

/** Tipo de conteúdo consumido — §3.4, checkbox múltiplo, opcional. */
export const CONTENT_TYPES = [
  { value: 'entertainment_humor', label: 'Entretenimento / humor' },
  { value: 'news_politics', label: 'Notícias e política' },
  { value: 'education_science', label: 'Educação e ciência' },
  { value: 'lifestyle_fashion', label: 'Estilo de vida e moda' },
  { value: 'gaming', label: 'Jogos' },
  { value: 'music_arts', label: 'Música e artes' },
  { value: 'sports', label: 'Esportes' },
  { value: 'finance_business', label: 'Finanças e negócios' },
  { value: 'other', label: 'Outro' },
];

/** Principais hobbies / atividades de lazer — §3.5, checkbox múltiplo, opcional. */
export const HOBBIES = [
  { value: 'reading', label: 'Leitura' },
  { value: 'sports_physical', label: 'Esportes / atividade física' },
  { value: 'gaming_video', label: 'Videogames' },
  { value: 'music_playing', label: 'Tocar instrumento / música' },
  { value: 'creative_arts', label: 'Artes visuais / criatividade' },
  { value: 'social_activities', label: 'Socialização presencial' },
  { value: 'streaming_series', label: 'Séries / streaming' },
  { value: 'outdoor', label: 'Atividades ao ar livre' },
  { value: 'volunteering', label: 'Voluntariado / causas sociais' },
  { value: 'other', label: 'Outro' },
];

/** Extrai só os values — para `z.enum()` e `enum` do Mongoose. */
export const valuesOf = (options) => options.map((o) => o.value);
