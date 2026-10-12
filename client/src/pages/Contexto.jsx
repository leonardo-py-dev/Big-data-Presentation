import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contextoSchema, EDUCATION_LEVELS, STUDY_AREAS, WORK_STATUSES } from '@pesquisa/shared';
import { useDraft, cleanEmpty, stripEmpty } from '../draft.jsx';
import Progress from '../components/Progress.jsx';
import { SelectField, RadioGroup, StepNav } from '../components/Fields.jsx';

/** Etapa de contexto acadêmico — `/pesquisa/contexto` (§8.3). */
export default function Contexto() {
  const navigate = useNavigate();
  const { draft, update } = useDraft();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(stripEmpty(contextoSchema)),
    defaultValues: {
      educationLevel: draft.educationLevel ?? '',
      studyArea: draft.studyArea ?? '',
      // radios opcionais: sem default = nenhum pré-selecionado (correto)
      worksWhileStudying: draft.worksWhileStudying,
    },
  });

  const onNext = (data) => {
    update(cleanEmpty(data));
    navigate('/pesquisa/habitos');
  };

  return (
    <div className="container-form">
      <Progress current={2} total={7} />
      <h1>Contexto acadêmico</h1>
      <form onSubmit={handleSubmit(onNext)} noValidate>
        <SelectField
          label="Nível de ensino"
          name="educationLevel"
          options={EDUCATION_LEVELS}
          register={register}
          error={errors.educationLevel}
          required
        />
        <SelectField
          label="Área de estudo"
          name="studyArea"
          options={STUDY_AREAS}
          register={register}
          error={errors.studyArea}
        />
        <RadioGroup
          legend="Além de estudar, você trabalha?"
          name="worksWhileStudying"
          options={WORK_STATUSES}
          register={register}
          error={errors.worksWhileStudying}
        />
        <StepNav onBack={() => navigate('/pesquisa/consentimento')} submitting={isSubmitting} />
      </form>
    </div>
  );
}
