import { Link } from 'react-router-dom';

/** Encerramento para quem não é estudante — não gera registro (§8.2). */
export default function Ineligible() {
  return (
    <div className="container">
      <h1>Pesquisa encerrada</h1>
      <p className="lead">
        Esta pesquisa é destinada a estudantes regularmente matriculados. Como você não confirmou
        essa condição, o formulário foi encerrado e <strong>nenhuma informação foi registrada</strong>.
      </p>
      <p>
        <Link to="/">Voltar ao início</Link>
      </p>
    </div>
  );
}
