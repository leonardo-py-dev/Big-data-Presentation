import CometDial from './CometDial.jsx';

/**
 * Indicador de progresso — etapa atual sobre o total (RF05).
 * O CometDial É a barra de progresso: `value` controlado dispara a
 * animação de mola a cada avanço de etapa.
 * Acessibilidade: role=progressbar com valores no wrapper + texto;
 * o dial vai `disabled` (sem foco/tab, sem drag) e apenas ilustra.
 */
export default function Progress({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={`Etapa ${current} de ${total}`}
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <div className="progress-dial">
        <CometDial
          value={pct}
          min={0}
          max={100}
          unit="%"
          label={`Progresso: etapa ${current} de ${total}`}
          size={104}
          thickness={6}
          disabled
        />
      </div>
      <p className="progress-text">
        Etapa {current} de {total}
      </p>
    </div>
  );
}
