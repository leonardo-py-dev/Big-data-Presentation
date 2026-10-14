import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/admin.js';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Alert, AlertDescription, TriangleAlert } from '../../components/ui/alert.jsx';
import '../../admin.css';

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
    <div className="admin-scope flex min-h-screen items-center justify-center bg-background px-4 font-sans text-foreground antialiased">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-2xl font-bold">Área administrativa</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Acesso restrito a pesquisadores autorizados.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Informe as credenciais de pesquisador.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <TriangleAlert />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={submit} noValidate className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-email">E-mail</Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-password">Senha</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={sending}>
                {sending ? 'Entrando…' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 text-sm">
          <Link to="/" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  );
}
