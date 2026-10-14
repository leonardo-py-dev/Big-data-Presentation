import { useCallback, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import {
  EDUCATION_LEVELS, STUDY_AREAS, DAILY_USAGES, SOCIAL_NETWORKS, MAIN_REASONS,
  ACCESS_SITUATIONS, INFLUENCE_ITEMS, FREQUENCY_OPTIONS,
  PRODUCTIVITY_IMPACTS, POST_USE_FEELINGS, REDUCE_ATTEMPTS, CONTROL_METHODS,
} from '@pesquisa/shared';
import { listResponses, deleteResponse, exportUrl } from '../../services/admin.js';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Label } from '../../components/ui/label.jsx';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select.jsx';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog.jsx';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '../../components/ui/alert-dialog.jsx';
import { Alert, AlertDescription, TriangleAlert } from '../../components/ui/alert.jsx';
import { Skeleton } from '../../components/ui/skeleton.jsx';
import { Badge } from '../../components/ui/badge.jsx';

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value ?? '—';
const labelsOf = (options, values) => (values ?? []).map((v) => labelOf(options, v)).join(', ') || '—';
const fmtDate = (iso) => new Date(iso).toLocaleString('pt-BR');

const EMPTY_FILTERS = {
  educationLevel: '', studyArea: '', dailyUsage: '', mainNetwork: '', from: '', to: '',
};

/** Item vazio do Select radial ("Todos/Todas") — Radix não aceita value="". */
const ALL = '__all';
const fromSelect = (v) => (v === ALL ? '' : v);
const toSelect = (v) => (v === '' ? ALL : v);

function FilterSelect({ id, label, value, onChange, allLabel, options }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={toSelect(value)} onValueChange={(v) => onChange(fromSelect(v))}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Tela de respostas — `/admin/respostas` (§16): tabela, filtros, CSV, exclusão. */
export default function Respostas() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async (f, p) => {
    setError(null);
    try {
      const params = { ...f, page: p, limit: 20 };
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      setResult(await listResponses(params));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load(applied, page);
  }, [applied, page, load]);

  const apply = (e) => {
    e.preventDefault();
    setPage(1);
    setApplied(filters);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  };

  const confirmRemove = async () => {
    if (!pendingDelete) return;
    try {
      await deleteResponse(pendingDelete);
      setPendingDelete(null);
      load(applied, page);
    } catch (err) {
      setPendingDelete(null);
      setError(err.message);
    }
  };

  const set = (k) => (v) => setFilters((f) => ({ ...f, [k]: typeof v === 'string' ? v : v.target.value }));

  const detailRows = detail ? [
    ['Redes', labelsOf(SOCIAL_NETWORKS, detail.socialNetworks)],
    ['Motivo', detail.mainReason ? labelOf(MAIN_REASONS, detail.mainReason) : '—'],
    ['Sono', detail.sleepImpact ? labelOf(FREQUENCY_OPTIONS, detail.sleepImpact) : '—'],
    ['Estudos', detail.studyCheckingFrequency ? labelOf(FREQUENCY_OPTIONS, detail.studyCheckingFrequency) : '—'],
    ['Produtividade', detail.academicProductivityImpact ? labelOf(PRODUCTIVITY_IMPACTS, detail.academicProductivityImpact) : '—'],
    ['Sensações', labelsOf(POST_USE_FEELINGS, detail.postUseFeelings)],
    ['Redução', detail.triedToReduce ? labelOf(REDUCE_ATTEMPTS, detail.triedToReduce) : '—'],
    ['Estratégias', labelsOf(CONTROL_METHODS, detail.controlMethods)],
    ['Situações (1–5)', ACCESS_SITUATIONS.map((s) => `${s.label}: ${detail.accessSituations?.[s.value] ?? '—'}`).join(' · ')],
  ] : [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Respostas</h1>
          <p className="text-sm text-muted-foreground">
            {result ? `${result.total} resposta(s) · filtros aplicados ao CSV` : 'Carregando…'}
          </p>
        </div>
        <Button asChild>
          <a href={exportUrl(applied)} download>
            <Download />
            Exportar CSV
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={apply} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              id="f-edu" label="Nível de ensino" value={filters.educationLevel}
              onChange={set('educationLevel')} allLabel="Todos" options={EDUCATION_LEVELS}
            />
            <FilterSelect
              id="f-area" label="Área de estudo" value={filters.studyArea}
              onChange={set('studyArea')} allLabel="Todas" options={STUDY_AREAS}
            />
            <FilterSelect
              id="f-time" label="Tempo diário" value={filters.dailyUsage}
              onChange={set('dailyUsage')} allLabel="Todos" options={DAILY_USAGES}
            />
            <FilterSelect
              id="f-net" label="Rede principal" value={filters.mainNetwork}
              onChange={set('mainNetwork')} allLabel="Todas"
              options={SOCIAL_NETWORKS.filter((n) => n.value !== 'none')}
            />
            <div className="grid gap-2">
              <Label htmlFor="f-from">De</Label>
              <Input id="f-from" type="date" value={filters.from} onChange={set('from')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="f-to">Até</Label>
              <Input id="f-to" type="date" value={filters.to} onChange={set('to')} />
            </div>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-2">
              <Button type="submit">Filtrar</Button>
              <Button type="button" variant="secondary" onClick={clearFilters}>
                Limpar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!result && !error && (
        <div className="grid gap-2" aria-label="Carregando respostas">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      )}

      {result && result.total === 0 && (
        <p className="text-sm text-muted-foreground">Nenhuma resposta para os filtros atuais.</p>
      )}

      {result && result.total > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Data</TableHead>
                <TableHead scope="col">Nível</TableHead>
                <TableHead scope="col">Área</TableHead>
                <TableHead scope="col">Rede principal</TableHead>
                <TableHead scope="col">Tempo diário</TableHead>
                <TableHead scope="col"><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.map((d) => (
                <TableRow key={d._id}>
                  <TableCell className="whitespace-nowrap">{fmtDate(d.createdAt)}</TableCell>
                  <TableCell>{labelOf(EDUCATION_LEVELS, d.educationLevel)}</TableCell>
                  <TableCell>{d.studyArea ? labelOf(STUDY_AREAS, d.studyArea) : '—'}</TableCell>
                  <TableCell>{d.mainNetwork ? labelOf(SOCIAL_NETWORKS, d.mainNetwork) : '—'}</TableCell>
                  <TableCell>{labelOf(DAILY_USAGES, d.dailyUsage)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-1">
                      <Button variant="link" onClick={() => setDetail(d)}>
                        Ver
                      </Button>
                      <Button variant="link" className="text-destructive" onClick={() => setPendingDelete(d._id)}>
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {result.page} de {result.pages} ({result.total} respostas)
            </span>
            <Button
              type="button"
              variant="secondary"
              disabled={page >= result.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </>
      )}

      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              Resposta <Badge variant="muted">{detail && fmtDate(detail.createdAt)}</Badge>
            </DialogTitle>
          </DialogHeader>
          <dl className="grid gap-3 sm:grid-cols-2">
            {detailRows.map(([term, desc]) => (
              <div key={term} className="sm:col-span-1">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{term}</dt>
                <dd className="mt-1 text-sm">{desc}</dd>
              </div>
            ))}
            {detail?.openComment && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Comentário</dt>
                <dd className="mt-1 text-sm">{detail.openComment}</dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Influência (1–5)</dt>
              <dd className="mt-1 text-sm">
                {detail ? INFLUENCE_ITEMS.map((i) => `${i.label} (${detail.influenceRatings?.[i.value] ?? '—'})`).join(' · ') : ''}
              </dd>
            </div>
            {detail?.balanceSuggestion && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Equilíbrio</dt>
                <dd className="mt-1 text-sm">{detail.balanceSuggestion}</dd>
              </div>
            )}
          </dl>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta resposta?</AlertDialogTitle>
            <AlertDialogDescription>
              A ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
