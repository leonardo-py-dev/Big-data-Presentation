import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDraft } from '../draft.jsx';
import Progress from '../components/Progress.jsx';
import { FieldError, StepNav } from '../components/Fields.jsx';

/**
 * Etapa de consentimento — `/pesquisa/consentimento` (§8.2).
 * Quem não confirma ser estudante é encerrado SEM gerar registro (§8.2).
 */
export default function Consent() {
  const navigate = useNavigate();
  const { draft, update } = useDraft();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { consentGiven: draft.consentGiven ?? false, studentConfirmed: draft.studentConfirmed ?? false },
  });

  const onNext = (data) => {
    // Recusa: encerra sem salvar nada — nem rascunho, nem resposta
    if (!data.studentConfirmed) {
      navigate('/pesquisa/encerrada');
      return;
    }
    if (!data.consentGiven) {
      setError('consentGiven', {
        type: 'required',
        message: 'É necessário concordar com a participação para continuar.',
      });
      return;
    }
    update(data);
    navigate('/pesquisa/contexto');
  };

  return (
    <div className="container">
      <Progress current={1} total={7} />
      <h1>Consentimento</h1>
      <p className="lead">
        Sua participação é voluntária e anônima. Você pode abandonar o formulário a qualquer
        momento, sem concluir — nada será registrado até o envio final.
      </p>
      <form onSubmit={handleSubmit(onNext)} noValidate>
        <div className="field">
          <label className="option" htmlFor="consentGiven">
            <input type="checkbox" id="consentGiven" {...register('consentGiven')} />
            <span>Li as informações acima e concordo em participar voluntariamente da pesquisa.</span>
          </label>
          <FieldError id="consentGiven-error" message={errors.consentGiven?.message} />
        </div>
        <div className="field">
          <label className="option" htmlFor="studentConfirmed">
            <input type="checkbox" id="studentConfirmed" {...register('studentConfirmed')} />
            <span>Confirmo que sou estudante.</span>
          </label>
          <FieldError id="studentConfirmed-error" message={errors.studentConfirmed?.message} />
        </div>
        <StepNav onBack={() => navigate('/pesquisa')} submitting={false} />
      </form>
    </div>
  );
}
