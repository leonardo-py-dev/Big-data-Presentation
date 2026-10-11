import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/admin.js';

/** Tela de login — `/admin/login` (§16). Mensagem genérica, sem dizer o que falhou. */
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.code === 401 ? 'E-mail ou senha incorretos.' : err.message);
      setSending(false);
    }
  };

  return (
    <div className="container">
      <h1>Área administrativa</h1>
      <p className="lead">Acesso restrito a pesquisadores autorizados.</p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="admin-email">E-mail</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Senha</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="step-nav">
          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? 'Entrando…' : 'Entrar'}
          </button>
        </div>
      </form>
      <p>
        <Link to="/">Voltar ao início</Link>
      </p>
    </div>
  );
}
