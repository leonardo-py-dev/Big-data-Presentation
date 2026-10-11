import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  surveyResponseSchema,
  EDUCATION_LEVELS,
  STUDY_AREAS,
  WORK_STATUSES,
  SOCIAL_NETWORKS,
  DAILY_USAGES,
  ACCESS_SITUATIONS,
  MAIN_REASONS,
  INFLUENCE_ITEMS,
  AGREEMENT_SCALE,
  FREQUENCY_OPTIONS,
  PRODUCTIVITY_IMPACTS,
  POST_USE_FEELINGS,
  REDUCE_ATTEMPTS,
  CONTROL_METHODS,
} from '@pesquisa/shared';
import { useDraft } from '../draft.jsx';
import { submitSurvey } from '../services/api.js';
import Progress from '../components/Progress.jsx';

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value;
const labelsOf = (options, values) => (values ?? []).map((v) => labelOf(options, v)).join(', ');

function Section({ title, rows }) {
  return (
    <section className="review-section" aria-label={title}>
      <h2>{title}</h2>
      <dl>
        {rows.map(([term, desc]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{desc || '—'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * Etapa de revisão — `/pesquisa/revisao` (§8.8).
 * Envio único: botão desabilita durante o processamento (RF08).
 * Falha de API mantém os dados e mostra o erro (RF13).
 */
export default function Revisao() {
  const navigate = useNavigate();
  const { draft, clear } = useDraft();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const send = async () => {
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      // Validação completa no cliente antes de enviar (o servidor valida de novo)
      const parsed = surveyResponseSchema.safeParse(draft);
      if (!parsed.success) {
        throw new Error('Alguma resposta ficou incompleta. Volte e revise as etapas.');
      }
      await submitSurvey(parsed.data);
      clear();
      navigate('/pesquisa/concluida');
    } catch (err) {
      // Dados mantidos no rascunho — nada é apagado (RF13)
      setError(err.message);
      setSending(false);
    }
  };

  const d = draft;
  return (
    <div className="container">
      <Progress current={7} total={7} />
      <h1>Revisão</h1>
      <p className="lead">
        Confira suas respostas. Após o envio, elas não poderão ser editadas.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Section
        title="Contexto acadêmico"
        rows={[
          ['Nível de ensino', labelOf(EDUCATION_LEVELS, d.educationLevel)],
          ['Área de estudo', d.studyArea ? labelOf(STUDY_AREAS, d.studyArea) : ''],
          ['Trabalha além de estudar', d.worksWhileStudying ? labelOf(WORK_STATUSES, d.worksWhileStudying) : ''],
        ]}
      />
      <Section
        title="Hábitos de uso"
        rows={[
          ['Redes utilizadas', labelsOf(SOCIAL_NETWORKS, d.socialNetworks)],
          ['Rede mais frequente', d.mainNetwork ? labelOf(SOCIAL_NETWORKS, d.mainNetwork) : ''],
          ['Tempo diário', labelOf(DAILY_USAGES, d.dailyUsage)],
          ['Motivo principal', d.mainReason ? labelOf(MAIN_REASONS, d.mainReason) : ''],
        ]}
      />
      <Section
        title="Influência no cotidiano"
        rows={INFLUENCE_ITEMS.map((item) => [
          item.label,
          labelOf(AGREEMENT_SCALE, d.influenceRatings?.[item.value]),
        ])}
      />
      <Section
        title="Estudos, sono e bem-estar"
        rows={[
          ['Impacto no sono', d.sleepImpact ? labelOf(FREQUENCY_OPTIONS, d.sleepImpact) : ''],
          ['Verifica durante os estudos', d.studyCheckingFrequency ? labelOf(FREQUENCY_OPTIONS, d.studyCheckingFrequency) : ''],
          ['Produtividade acadêmica', d.academicProductivityImpact ? labelOf(PRODUCTIVITY_IMPACTS, d.academicProductivityImpact) : ''],
          ['Sensações após o uso', labelsOf(POST_USE_FEELINGS, d.postUseFeelings)],
          ['Tentou reduzir', d.triedToReduce ? labelOf(REDUCE_ATTEMPTS, d.triedToReduce) : ''],
          ['Estratégias de controle', labelsOf(CONTROL_METHODS, d.controlMethods)],
        ]}
      />
      {(d.openComment || d.balanceSuggestion) && (
        <Section
          title="Comentários"
          rows={[
            ['Principal influência', d.openComment ?? ''],
            ['Relação mais equilibrada', d.balanceSuggestion ?? ''],
          ]}
        />
      )}
      <div className="step-nav">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/pesquisa/comentario')}
          disabled={sending}
        >
          Voltar e editar
        </button>
        <button type="button" className="btn btn-primary" onClick={send} disabled={sending}>
          {sending ? 'Enviando…' : 'Enviar respostas'}
        </button>
      </div>
    </div>
  );
}
