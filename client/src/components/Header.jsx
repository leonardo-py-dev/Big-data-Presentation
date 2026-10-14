import { useState } from 'react';
import { Link } from 'react-router-dom';

/** Header pill flutuante — espelha a referência (fixo, blur, CTA à direita). */
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Início">
        <span className="brand-mark" aria-hidden="true" />
        <span>Pesquisa</span>
      </Link>
      <nav className={`site-nav${open ? ' open' : ''}`} aria-label="Navegação principal">
        <a href="#dimensoes" onClick={() => setOpen(false)}>
          A pesquisa
        </a>
        <a href="#como-funciona" onClick={() => setOpen(false)}>
          Como funciona
        </a>
        <a href="#privacidade" onClick={() => setOpen(false)}>
          Privacidade
        </a>
        <a href="#garantias" onClick={() => setOpen(false)}>
          Garantias
        </a>
      </nav>
      <Link className="btn btn-primary" to="/pesquisa">
        Iniciar pesquisa <span aria-hidden="true">→</span>
      </Link>
      <button
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((o) => !o)}
      >
        ☰
      </button>
    </header>
  );
}
