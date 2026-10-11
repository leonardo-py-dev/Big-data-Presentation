import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  habitosSchema,
  SOCIAL_NETWORKS,
  DAILY_USAGES,
  ACCESS_SITUATIONS,
  MAIN_REASONS,
} from '@pesquisa/shared';
import { useDraft, cleanEmpty, stripEmpty } from '../draft.jsx';
import Progress from '../components/Progress.jsx';
import { SelectField, CheckboxGroup, RadioGroup, MatrixRow, StepNav } from '../components/Fields.jsx';

/** Etapa de hábitos — `/pesquisa/habitos` (§8.4). */
export default function Habitos() {
  const navigate = useNavigate();
  const { draft, update } = useDraft();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(stripEmpty(habitosSchema)),
    defaultValues: {
      socialNetworks: draft.socialNetworks ?? [],
      mainNetwork: draft.mainNetwork ?? '',
      dailyUsage: draft.dailyUsage,
      accessSituations: draft.accessSituations ?? {},
      mainReason: draft.mainReason ?? '',
    },
  });

  // Rede principal: só entre as selecionadas (exclui "Nenhuma") — espelha a regra do schema
  const selected = watch('socialNetworks') ?? [];
  const mainOptions = SOCIAL_NETWORKS.filter((n) => selected.includes(n.value) && n.value !== 'none');

  const onNext = (data) => {
    update(cleanEmpty(data));
    navigate('/pesquisa/influencia');
  };

  return (
    <div className="container">
      <Progress current={3} total={7} />
      <h1>Hábitos de uso</h1>
      <form onSubmit={handleSubmit(onNext)} noValidate>
        <CheckboxGroup
          legend="Quais redes sociais você utiliza atualmente?"
          name="socialNetworks"
          options={SOCIAL_NETWORKS}
          register={register}
          error={errors.socialNetworks}
        />
        {mainOptions.length > 0 && (
          <SelectField
            label="Qual rede social você utiliza com maior frequência?"
            name="mainNetwork"
            options={mainOptions}
            register={register}
            error={errors.mainNetwork}
            required
          />
        )}
        <RadioGroup
          legend="Quanto tempo por dia você estima passar em redes sociais?"
          name="dailyUsage"
          options={DAILY_USAGES}
          register={register}
          error={errors.dailyUsage}
          required
        />
        <h2>Com que frequência você acessa redes sociais nos seguintes momentos?</h2>
        {ACCESS_SITUATIONS.map((s) => (
          <MatrixRow
            key={s.value}
            legend={s.label}
            name={`accessSituations.${s.value}`}
            register={register}
            error={errors.accessSituations?.[s.value]}
          />
        ))}
        <SelectField
          label="Qual é o principal motivo para utilizar redes sociais?"
          name="mainReason"
          options={MAIN_REASONS}
          register={register}
          error={errors.mainReason}
        />
        <StepNav onBack={() => navigate('/pesquisa/contexto')} submitting={isSubmitting} />
      </form>
    </div>
  );
}
