import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  SOCIAL_NETWORKS, DAILY_USAGES, MAIN_REASONS, INFLUENCE_ITEMS, CONTROL_METHODS,
} from '@pesquisa/shared';
import { getSummary } from '../../services/admin.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Alert, AlertDescription, TriangleAlert } from '../../components/ui/alert.jsx';
import { Skeleton } from '../../components/ui/skeleton.jsx';

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value;
const topOf = (arr) => (arr && arr.length > 0 ? arr[0] : null);

const tooltipStyle = {
  backgroundColor: '#171717',
  border: '1px solid #2c2c2c',
  borderRadius: '8px',
  color: '#fff',
};

const axisTick = { fill: '#b8b8b8', fontSize: 12 };

function ChartPanel({ title, n, height = 280, children }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>{title}</CardTitle>
        <Badge variant="muted">n&nbsp;=&nbsp;{n}</Badge>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VerticalBar({ data, height = 70, anim = true }) {
  return (
    <BarChart data={data}>
      <CartesianGrid stroke="#2c2c2c" vertical={false} />
      <XAxis dataKey="name" tick={axisTick} interval={0} angle={-18} dy={10} height={height} />
      <YAxis tick={axisTick} allowDecimals={false} />
      <Tooltip contentStyle={tooltipStyle} />
      <Bar dataKey="n" fill="#ffffff" isAnimationActive={anim} />
    </BarChart>
  );
}

/** Dashboard — `/admin` (§16). Todo indicador exibe o n da amostra. */
export default function Dashboard() {
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

  if (error) {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!summary) {
    return (
      <div className="grid gap-3" aria-label="Carregando indicadores">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  const { n } = summary;
  const topNet = topOf(summary.byNetwork);
  const topTime = topOf(summary.byDailyUsage);
  const anim = !reduced;

  if (n === 0) {
    return <p className="text-sm text-muted-foreground">Ainda não há respostas registradas.</p>;
  }

  const kpis = [
    { value: n, label: 'respostas no total' },
    {
      value: topNet ? labelOf(SOCIAL_NETWORKS, topNet._id) : '—',
      label: `rede mais utilizada${topNet ? ` (${topNet.n} menções)` : ''}`,
    },
    { value: topTime ? labelOf(DAILY_USAGES, topTime._id) : '—', label: 'faixa de tempo mais frequente' },
    { value: `${summary.studyOftenPct}%`, label: `verificam redes durante os estudos (n = ${n})` },
    { value: `${summary.sleepOftenPct}%`, label: `relatam impacto no sono (n = ${n})` },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Painel da pesquisa</h1>
          <p className="text-sm text-muted-foreground">Indicadores agregados e anônimos.</p>
        </div>
        <Badge variant="secondary">n&nbsp;=&nbsp;{n}</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{kpi.value}</CardTitle>
              <CardDescription>{kpi.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="visao-geral">
        <TabsList aria-label="Dimensões da pesquisa">
          <TabsTrigger value="visao-geral">Visão geral</TabsTrigger>
          <TabsTrigger value="habitos">Hábitos</TabsTrigger>
          <TabsTrigger value="influencia">Influência</TabsTrigger>
          <TabsTrigger value="controle">Controle</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="grid gap-4">
          <ChartPanel title="Redes sociais utilizadas" n={n}>
            <VerticalBar
              data={summary.byNetwork.map((d) => ({ name: labelOf(SOCIAL_NETWORKS, d._id), n: d.n }))}
              anim={anim}
            />
          </ChartPanel>
          <ChartPanel title="Tempo diário de uso" n={n} height={300}>
            <VerticalBar
              data={summary.byDailyUsage.map((d) => ({ name: labelOf(DAILY_USAGES, d._id), n: d.n }))}
              height={90}
              anim={anim}
            />
          </ChartPanel>
        </TabsContent>

        <TabsContent value="habitos" className="grid gap-4">
          <ChartPanel title="Principais motivos de uso" n={n} height={300}>
            <VerticalBar
              data={summary.byReason.map((d) => ({ name: labelOf(MAIN_REASONS, d._id), n: d.n }))}
              height={90}
              anim={anim}
            />
          </ChartPanel>
        </TabsContent>

        <TabsContent value="influencia" className="grid gap-4">
          <ChartPanel title="Médias das escalas de influência (1–5)" n={n} height={480}>
            <BarChart
              data={INFLUENCE_ITEMS.map((item) => ({
                name: item.label,
                media: summary.avgRatings[item.value],
              }))}
              layout="vertical"
            >
              <CartesianGrid stroke="#2c2c2c" horizontal={false} />
              <XAxis type="number" domain={[1, 5]} tick={axisTick} />
              <YAxis type="category" dataKey="name" width={220} tick={{ fill: '#b8b8b8', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="media" fill="#ffffff" isAnimationActive={anim} />
            </BarChart>
          </ChartPanel>
        </TabsContent>

        <TabsContent value="controle" className="grid gap-4">
          <ChartPanel title="Estratégias de controle de uso" n={n} height={300}>
            <VerticalBar
              data={summary.controlTop.map((d) => ({ name: labelOf(CONTROL_METHODS, d._id), n: d.n }))}
              height={90}
              anim={anim}
            />
          </ChartPanel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
