import { Link } from 'react-router-dom';

/** Destino do botão "Sair" — participação voluntária inclui poder não começar. */
export default function Exit() {
  return (
    <div className="container">
      <h1>Sem problema</h1>
      <p className="lead">
        Você optou por não participar. Nenhuma informação foi registrada. Você pode fechar esta
        página quando quiser — ou <Link to="/">voltar ao início</Link> se mudar de ideia.
      </p>
    </div>
  );
}
