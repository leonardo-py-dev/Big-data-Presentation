import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { influenciaSchema, INFLUENCE_ITEMS } from '@pesquisa/shared';
import { useDraft } from '../draft.jsx';
import Progress from '../components/Progress.jsx';
import { ScaleItem, StepNav } from '../components/Fields.jsx';

/**
 * Etapa de influência — `/pesquisa/influencia` (§8.5).
 * Ordem das afirmações é a do PRD — não reordenar (neutralidade metodológica).
 */
export default function Influencia() {
  const navigate = useNavigate();
  const { draft, update } = useDraft();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(influenciaSchema),
    defaultValues: { influenceRatings: draft.influenceRatings ?? {} },
  });

  const onNext = (data) => {
    update(data);
    navigate('/pesquisa/bem-estar');
  };

  return (
    <div className="container">
      <Progress current={4} total={7} />
      <h1>Influência no cotidiano</h1>
      <p className="lead">
        Indique o quanto você concorda com cada afirmação, de 1 (discordo totalmente) a 5
        (concordo totalmente).
      </p>
      <form onSubmit={handleSubmit(onNext)} noValidate>
        {INFLUENCE_ITEMS.map((item) => (
          <ScaleItem
            key={item.value}
            statement={item.label}
            name={`influenceRatings.${item.value}`}
            register={register}
            error={errors.influenceRatings?.[item.value]}
          />
        ))}
        <StepNav onBack={() => navigate('/pesquisa/habitos')} submitting={isSubmitting} />
      </form>
    </div>
  );
}
