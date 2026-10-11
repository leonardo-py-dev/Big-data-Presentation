import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  bemEstarSchema,
  FREQUENCY_OPTIONS,
  PRODUCTIVITY_IMPACTS,
  POST_USE_FEELINGS,
  REDUCE_ATTEMPTS,
  CONTROL_METHODS,
} from '@pesquisa/shared';
import { useDraft, cleanEmpty } from '../draft.jsx';
import Progress from '../components/Progress.jsx';
import { RadioGroup, CheckboxGroup, StepNav } from '../components/Fields.jsx';

/** Etapa de estudos, sono e bem-estar — `/pesquisa/bem-estar` (§8.6). */
export default function BemEstar() {
  const navigate = useNavigate();
  const { draft, update } = useDraft();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bemEstarSchema),
    defaultValues: {
      sleepImpact: draft.sleepImpact,
      studyCheckingFrequency: draft.studyCheckingFrequency,
      academicProductivityImpact: draft.academicProductivityImpact,
      postUseFeelings: draft.postUseFeelings ?? [],
      triedToReduce: draft.triedToReduce,
      controlMethods: draft.controlMethods ?? [],
    },
  });

  const onNext = (data) => {
    update(cleanEmpty(data));
    navigate('/pesquisa/comentario');
  };

  return (
    <div className="container">
      <Progress current={5} total={7} />
      <h1>Estudos, sono e bem-estar</h1>
      <form onSubmit={handleSubmit(onNext)} noValidate>
        <RadioGroup
          legend="Com que frequência o uso de redes sociais afeta seu sono?"
          name="sleepImpact"
          options={FREQUENCY_OPTIONS}
          register={register}
          error={errors.sleepImpact}
        />
        <RadioGroup
          legend="Com que frequência você verifica redes sociais enquanto deveria estar estudando?"
          name="studyCheckingFrequency"
          options={FREQUENCY_OPTIONS}
          register={register}
          error={errors.studyCheckingFrequency}
        />
        <RadioGroup
          legend="Como você avalia o impacto das redes sociais na sua produtividade acadêmica?"
          name="academicProductivityImpact"
          options={PRODUCTIVITY_IMPACTS}
          register={register}
          error={errors.academicProductivityImpact}
        />
        <CheckboxGroup
          legend="Como você costuma se sentir depois de passar muito tempo nas redes sociais?"
          name="postUseFeelings"
          options={POST_USE_FEELINGS}
          register={register}
          error={errors.postUseFeelings}
        />
        <RadioGroup
          legend="Você já tentou reduzir o tempo de uso?"
          name="triedToReduce"
          options={REDUCE_ATTEMPTS}
          register={register}
          error={errors.triedToReduce}
        />
        <CheckboxGroup
          legend="Você utiliza alguma estratégia para controlar o tempo de uso?"
          name="controlMethods"
          options={CONTROL_METHODS}
          register={register}
          error={errors.controlMethods}
        />
        <StepNav onBack={() => navigate('/pesquisa/influencia')} submitting={isSubmitting} />
      </form>
    </div>
  );
}
