import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EDUCATION_LEVELS, STUDY_AREAS, DAILY_USAGES, SOCIAL_NETWORKS, MAIN_REASONS,
  ACCESS_SITUATIONS, INFLUENCE_ITEMS, AGREEMENT_SCALE, FREQUENCY_OPTIONS,
  PRODUCTIVITY_IMPACTS, POST_USE_FEELINGS, REDUCE_ATTEMPTS, CONTROL_METHODS,
} from '@pesquisa/shared';
import { listResponses, deleteResponse, exportUrl } from '../../services/admin.js';

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value ?? '—';
const labelsOf = (options, values) => (values ?? []).map((v) => labelOf(options, v)).join(', ') || '—';
const fmtDate = (iso) => new Date(iso).toLocaleString('pt-BR');

const EMPTY_FILTERS = {
  educationLevel: '', studyArea: '', dailyUsage: '', mainNetwork: '', from: '', to: '',
};

/** Tela de respostas — `/admin/respostas` (§16): tabela, filtros, CSV, exclusão. */
export default function Respostas() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

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

  const remove = async (id) => {
    if (!window.confirm('Excluir esta resposta? A ação não pode ser desfeita.')) return;
    try {
      await deleteResponse(id);
      load(applied, page);
    } catch (err) {
      setError(err.message);
    }
  };

  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container-wide admin">
      <header className="admin-header">
        <h1>Respostas{result ? ` (${result.total})` : ''}</h1>
        <div className="admin-actions">
          <Link className="btn btn-secondary" to="/admin">
            Painel
          </Link>
          <a className="btn btn-primary" href={exportUrl(applied)} download>
            Exportar CSV
          </a>
        </div>
      </header>

      <form className="filters" onSubmit={apply}>
        <div className="field">
          <label htmlFor="f-edu">Nível de ensino</label>
          <select id="f-edu" value={filters.educationLevel} onChange={set('educationLevel')}>
            <option value="">Todos</option>
            {EDUCATION_LEVELS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-area">Área de estudo</label>
          <select id="f-area" value={filters.studyArea} onChange={set('studyArea')}>
            <option value="">Todas</option>
            {STUDY_AREAS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-time">Tempo diário</label>
          <select id="f-time" value={filters.dailyUsage} onChange={set('dailyUsage')}>
            <option value="">Todos</option>
            {DAILY_USAGES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-net">Rede principal</label>
          <select id="f-net" value={filters.mainNetwork} onChange={set('mainNetwork')}>
            <option value="">Todas</option>
            {SOCIAL_NETWORKS.filter((n) => n.value !== 'none').map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-from">De</label>
          <input id="f-from" type="date" value={filters.from} onChange={set('from')} />
        </div>
        <div className="field">
          <label htmlFor="f-to">Até</label>
          <input id="f-to" type="date" value={filters.to} onChange={set('to')} />
        </div>
        <div className="field filters-actions">
          <button type="submit" className="btn btn-primary">Filtrar</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setFilters(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); setPage(1); }}
          >
            Limpar
          </button>
        </div>
      </form>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {result && result.total === 0 && <p className="lead">Nenhuma resposta para os filtros atuais.</p>}

      {result && result.total > 0 && (
        <>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Nível</th>
                  <th scope="col">Área</th>
                  <th scope="col">Rede principal</th>
                  <th scope="col">Tempo diário</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((d) => (
                  <Fragment key={d._id}>
                    <tr>
                      <td>{fmtDate(d.createdAt)}</td>
                      <td>{labelOf(EDUCATION_LEVELS, d.educationLevel)}</td>
                      <td>{d.studyArea ? labelOf(STUDY_AREAS, d.studyArea) : '—'}</td>
                      <td>{d.mainNetwork ? labelOf(SOCIAL_NETWORKS, d.mainNetwork) : '—'}</td>
                      <td>{labelOf(DAILY_USAGES, d.dailyUsage)}</td>
                      <td className="row-actions">
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => setOpenId(openId === d._id ? null : d._id)}
                          aria-expanded={openId === d._id}
                        >
                          {openId === d._id ? 'Ocultar' : 'Ver'}
                        </button>
                        <button type="button" className="link-btn danger" onClick={() => remove(d._id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                    {openId === d._id && (
                      <tr className="detail-row">
                        <td colSpan={6}>
                          <dl className="detail-grid">
                            <div><dt>Redes</dt><dd>{labelsOf(SOCIAL_NETWORKS, d.socialNetworks)}</dd></div>
                            <div><dt>Motivo</dt><dd>{d.mainReason ? labelOf(MAIN_REASONS, d.mainReason) : '—'}</dd></div>
                            <div><dt>Sono</dt><dd>{d.sleepImpact ? labelOf(FREQUENCY_OPTIONS, d.sleepImpact) : '—'}</dd></div>
                            <div><dt>Estudos</dt><dd>{d.studyCheckingFrequency ? labelOf(FREQUENCY_OPTIONS, d.studyCheckingFrequency) : '—'}</dd></div>
                            <div><dt>Produtividade</dt><dd>{d.academicProductivityImpact ? labelOf(PRODUCTIVITY_IMPACTS, d.academicProductivityImpact) : '—'}</dd></div>
                            <div><dt>Sensações</dt><dd>{labelsOf(POST_USE_FEELINGS, d.postUseFeelings)}</dd></div>
                            <div><dt>Redução</dt><dd>{d.triedToReduce ? labelOf(REDUCE_ATTEMPTS, d.triedToReduce) : '—'}</dd></div>
                            <div><dt>Estratégias</dt><dd>{labelsOf(CONTROL_METHODS, d.controlMethods)}</dd></div>
                            <div><dt>Situações (1–5)</dt><dd>{ACCESS_SITUATIONS.map((s) => `${s.label}: ${d.accessSituations?.[s.value] ?? '—'}`).join(' · ')}</dd></div>
                            <div><dt>Influência (1–5)</dt><dd>{INFLUENCE_ITEMS.map((i) => `${i.label} (${d.influenceRatings?.[i.value] ?? '—'})`).join(' · ')}</dd></div>
                            {d.openComment && (<div><dt>Comentário</dt><dd>{d.openComment}</dd></div>)}
                            {d.balanceSuggestion && (<div><dt>Equilíbrio</dt><dd>{d.balanceSuggestion}</dd></div>)}
                          </dl>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span>
              Página {result.page} de {result.pages} ({result.total} respostas)
            </span>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={page >= result.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
