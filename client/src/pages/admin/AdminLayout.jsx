import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { logout } from '../../services/admin.js';
import { Button } from '../../components/ui/button.jsx';
import '../../admin.css';

/**
 * Moldura da área administrativa: carrega o CSS do admin (chunk lazy,
 * fora do bundle público) e o cabeçalho com navegação + saída.
 */
export default function AdminLayout() {
  const navigate = useNavigate();

  const exit = async () => {
    await logout().catch(() => {});
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-scope min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <span className="mr-auto text-sm font-bold uppercase tracking-widest">
            Pesquisa <span className="text-muted-foreground">• Admin</span>
          </span>
          <nav aria-label="Administração" className="flex items-center gap-1">
            <Button variant="ghost" asChild>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => (isActive ? 'bg-muted text-foreground' : undefined)}
              >
                Painel
              </NavLink>
            </Button>
            <Button variant="ghost" asChild>
              <NavLink
                to="/admin/respostas"
                className={({ isActive }) => (isActive ? 'bg-muted text-foreground' : undefined)}
              >
                Respostas
              </NavLink>
            </Button>
          </nav>
          <Button variant="secondary" onClick={exit}>
            <LogOut />
            Sair
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6">
        <Outlet />
      </main>
    </div>
  );
}
