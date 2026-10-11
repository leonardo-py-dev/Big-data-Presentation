import { useNavigate } from 'react-router-dom';

/** Página de apresentação — `/pesquisa` (§8.1). Texto sugerido do PRD, sem alteração. */
export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Uso de redes sociais e sua influência no cotidiano de estudantes</h1>
      <p className="lead">
        Esta pesquisa busca compreender como estudantes utilizam redes sociais e como percebem sua
        influência na rotina, nos estudos, no sono, no humor e nos relacionamentos. A participação
        é voluntária, e o preenchimento leva aproximadamente 3 a 5 minutos. Não solicitaremos nome,
        e-mail ou outros dados pessoais identificáveis.
      </p>
      <div className="notice">
        <p>
          <strong>Público-alvo:</strong> estudantes regularmente matriculados.
          <br />
          <strong>Tempo estimado:</strong> 3 a 5 minutos.
          <br />
          <strong>Privacidade:</strong> as respostas são anônimas e analisadas de forma agregada.
        </p>
      </div>
      <div className="step-nav">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/sair')}>
          Sair
        </button>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/pesquisa/consentimento')}>
          Iniciar pesquisa
        </button>
      </div>
    </div>
  );
}
