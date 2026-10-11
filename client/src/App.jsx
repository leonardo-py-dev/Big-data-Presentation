import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { DraftProvider } from './draft.jsx';
import Landing from './pages/Landing.jsx';
import Inicio from './pages/Inicio.jsx';
import Exit from './pages/Exit.jsx';
import Consent from './pages/Consent.jsx';
import Ineligible from './pages/Ineligible.jsx';
import Contexto from './pages/Contexto.jsx';
import Habitos from './pages/Habitos.jsx';
import Influencia from './pages/Influencia.jsx';
import BemEstar from './pages/BemEstar.jsx';
import Comentario from './pages/Comentario.jsx';
import Revisao from './pages/Revisao.jsx';
import Concluida from './pages/Concluida.jsx';
// Rotas admin em chunks separados: Recharts (~450 kB) não entra no bundle
// inicial do questionário — crítico para conexão móvel (RNF02).
const Login = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Respostas = lazy(() => import('./pages/admin/Respostas.jsx'));
import RequireAdmin from './pages/admin/RequireAdmin.jsx';

/** Volta ao topo a cada troca de etapa — o formulário é longo no celular. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Fluxo: landing → apresentação → 6 etapas → revisão → conclusão (§8). */
export default function App() {
  return (
    <DraftProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pesquisa" element={<Inicio />} />
        <Route path="/sair" element={<Exit />} />
        <Route path="/pesquisa/consentimento" element={<Consent />} />
        <Route path="/pesquisa/encerrada" element={<Ineligible />} />
        <Route path="/pesquisa/contexto" element={<Contexto />} />
        <Route path="/pesquisa/habitos" element={<Habitos />} />
        <Route path="/pesquisa/influencia" element={<Influencia />} />
        <Route path="/pesquisa/bem-estar" element={<BemEstar />} />
        <Route path="/pesquisa/comentario" element={<Comentario />} />
        <Route path="/pesquisa/revisao" element={<Revisao />} />
        <Route path="/pesquisa/concluida" element={<Concluida />} />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<div className="container"><p className="lead">Carregando…</p></div>}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Suspense fallback={<div className="container"><p className="lead">Carregando…</p></div>}>
                <Dashboard />
              </Suspense>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/respostas"
          element={
            <RequireAdmin>
              <Suspense fallback={<div className="container"><p className="lead">Carregando…</p></div>}>
                <Respostas />
              </Suspense>
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DraftProvider>
  );
}
