import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { me } from '../../services/admin.js';

/** Guarda as rotas /admin/*: sem sessão válida, volta ao login. */
export default function RequireAdmin({ children }) {
  const location = useLocation();
  const [state, setState] = useState('checking'); // checking | ok | denied

  useEffect(() => {
    me().then(
      () => setState('ok'),
      () => setState('denied'),
    );
  }, []);

  if (state === 'checking') {
    return (
      <div className="container">
        <p className="lead">Verificando sessão…</p>
      </div>
    );
  }
  if (state === 'denied') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
