import { Link } from 'react-router-dom';

/** Página de conclusão — `/pesquisa/concluida` (§8.9). Sem dado identificável. */
export default function Concluida() {
  return (
    <div className="container">
      <h1>Obrigado por participar</h1>
      <p className="lead">
        Sua resposta foi registrada com sucesso e será analisada junto às demais respostas da
        pesquisa.
      </p>
      <p>
        <Link to="/">Voltar ao início</Link>
      </p>
    </div>
  );
}
