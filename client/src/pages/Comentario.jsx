import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { comentarioSchema } from '@pesquisa/shared';
import { useDraft } from '../draft.jsx';
import Progress from '../components/Progress.jsx';
import { TextArea, StepNav } from '../components/Fields.jsx';

/** Etapa de comentário — `/pesquisa/comentario` (§8.7). Tudo opcional. */
export default function Comentario() {
  const navigate = useNavigate();
  const { draft, update } = useDraft();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(comentarioSchema),
    defaultValues: {
      openComment: draft.openComment ?? '',
      balanceSuggestion: draft.balanceSuggestion ?? '',
    },
  });

  const onNext = (data) => {
    update(data);
    navigate('/pesquisa/revisao');
  };

  return (
    <div className="container-form">
      <Progress current={6} total={7} />
      <h1>Comentário final</h1>
      <p className="lead">
        Estas perguntas são opcionais. Evite escrever nome, e-mail ou qualquer informação que
        identifique você ou outras pessoas.
      </p>
      <form onSubmit={handleSubmit(onNext)} noValidate>
        <TextArea
          label="Na sua opinião, qual é a principal influência das redes sociais na sua vida como estudante?"
          name="openComment"
          register={register}
          error={errors.openComment}
          maxLength={2000}
        />
        <TextArea
          label="O que poderia ajudar estudantes a manter uma relação mais equilibrada com as redes sociais?"
          name="balanceSuggestion"
          register={register}
          error={errors.balanceSuggestion}
          maxLength={2000}
        />
        <StepNav onBack={() => navigate('/pesquisa/bem-estar')} submitting={isSubmitting} />
      </form>
    </div>
  );
}
