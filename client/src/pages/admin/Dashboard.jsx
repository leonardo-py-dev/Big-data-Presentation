import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  SOCIAL_NETWORKS, DAILY_USAGES, MAIN_REASONS, INFLUENCE_ITEMS, CONTROL_METHODS,
} from '@pesquisa/shared';
import { getSummary, logout } from '../../services/admin.js';

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value;
const topOf = (arr) => (arr && arr.length > 0 ? arr[0] : null);

function ChartCard({ title, n, children }) {
  return (
    <section className="chart-card" aria-label={`${title} (n = ${n})`}>
      <h2>
        {title} <span className="sample-n">n&nbsp;=&nbsp;{n}</span>
      </h2>
      {children}
    </section>
  );
}

const tooltipStyle = {
  backgroundColor: '#171717',
  border: '1px solid #2c2c2c',
  borderRadius: '8px',
  color: '#fff',
};

/** Dashboard — `/admin` (§16). Todo indicador exibe o n da amostra. */
export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    getSummary().then(setSummary, (err) => setError(err.message));
  }, []);

  const exit = async () => {
    await logout().catch(() => {});
    navigate('/admin/login', { replace: true });
  };

  if (error) {
    return (
      <div className="container">
        <p className="form-error" role="alert">
          {error}
        </p>
      </div>
    );
  }
  if (!summary) {
    return (
      <div className="container">
        <p className="lead">Carregando indicadores…</p>
      </div>
    );
  }

  const { n } = summary;
  const topNet = topOf(summary.byNetwork);
  const topTime = topOf(summary.byDailyUsage);
  const anim = !reduced;

  return (
    <div className="container-wide admin">
      <header className="admin-header">
        <h1>Painel da pesquisa</h1>
        <div className="admin-actions">
          <Link className="btn btn-secondary" to="/admin/respostas">
            Ver respostas
          </Link>
          <button type="button" className="btn btn-secondary" onClick={exit}>
            Sair
          </button>
        </div>
      </header>

      {n === 0 ? (
        <p className="lead">Ainda não há respostas registradas.</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <strong>{n}</strong>
              <span>respostas no total</span>
            </div>
            <div className="stat-card">
              <strong>{topNet ? labelOf(SOCIAL_NETWORKS, topNet._id) : '—'}</strong>
              <span>rede mais utilizada{topNet ? ` (${topNet.n} menções)` : ''}</span>
            </div>
            <div className="stat-card">
              <strong>{topTime ? labelOf(DAILY_USAGES, topTime._id) : '—'}</strong>
              <span>faixa de tempo mais frequente</span>
            </div>
            <div className="stat-card">
              <strong>{summary.studyOftenPct}%</strong>
              <span>verificam redes durante os estudos (n&nbsp;=&nbsp;{n})</span>
            </div>
            <div className="stat-card">
              <strong>{summary.sleepOftenPct}%</strong>
              <span>relatam impacto no sono (n&nbsp;=&nbsp;{n})</span>
            </div>
          </div>

          <ChartCard title="Redes sociais utilizadas" n={n}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={summary.byNetwork.map((d) => ({ name: labelOf(SOCIAL_NETWORKS, d._id), n: d.n }))}
              >
                <CartesianGrid stroke="#2c2c2c" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#b8b8b8', fontSize: 12 }} interval={0} angle={-18} dy={10} height={70} />
                <YAxis tick={{ fill: '#b8b8b8' }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="n" fill="#ffffff" isAnimationActive={anim} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Tempo diário de uso" n={n}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={summary.byDailyUsage.map((d) => ({ name: labelOf(DAILY_USAGES, d._id), n: d.n }))}
              >
                <CartesianGrid stroke="#2c2c2c" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#b8b8b8', fontSize: 12 }} interval={0} angle={-18} dy={10} height={80} />
                <YAxis tick={{ fill: '#b8b8b8' }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="n" fill="#ffffff" isAnimationActive={anim} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Principais motivos de uso" n={n}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={summary.byReason.map((d) => ({ name: labelOf(MAIN_REASONS, d._id), n: d.n }))}
              >
                <CartesianGrid stroke="#2c2c2c" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#b8b8b8', fontSize: 12 }} interval={0} angle={-18} dy={10} height={80} />
                <YAxis tick={{ fill: '#b8b8b8' }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="n" fill="#ffffff" isAnimationActive={anim} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Médias das escalas de influência (1–5)" n={n}>
            <ResponsiveContainer width="100%" height={480}>
              <BarChart
                data={INFLUENCE_ITEMS.map((item) => ({
                  name: item.label,
                  media: summary.avgRatings[item.value],
                }))}
                layout="vertical"
              >
                <CartesianGrid stroke="#2c2c2c" horizontal={false} />
                <XAxis type="number" domain={[1, 5]} tick={{ fill: '#b8b8b8' }} />
                <YAxis type="category" dataKey="name" width={250} tick={{ fill: '#b8b8b8', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="media" fill="#ffffff" isAnimationActive={anim} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Estratégias de controle de uso" n={n}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={summary.controlTop.map((d) => ({ name: labelOf(CONTROL_METHODS, d._id), n: d.n }))}
              >
                <CartesianGrid stroke="#2c2c2c" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#b8b8b8', fontSize: 12 }} interval={0} angle={-18} dy={10} height={80} />
                <YAxis tick={{ fill: '#b8b8b8' }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="n" fill="#ffffff" isAnimationActive={anim} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </>
      )}
    </div>
  );
}
