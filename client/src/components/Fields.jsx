/**
 * Primitivos de formulário acessíveis (RNF03):
 * - todo input tem <label> associado; grupos usam <fieldset>/<legend>
 * - erro ligado ao campo por aria-describedby e anunciado com role="alert"
 * - foco visível via CSS (:focus-visible)
 */

export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className="field-error" id={id} role="alert">
      {message}
    </p>
  );
}

export function SelectField({ label, name, options, register, error, required }) {
  const errorId = `${name}-error`;
  // <select> intocado emite "" — converte para undefined ANTES da validação,
  // senão o optional do Zod rejeita com mensagem crua em inglês
  const registration = register(name, { setValueAs: (v) => (v === '' ? undefined : v) });
  return (
    <div className="field">
      <label htmlFor={name}>
        {label} {required && <span aria-hidden="true"> *</span>}
      </label>
      <select
        id={name}
        aria-required={!!required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...registration}
      >
        <option value="">Selecione…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

export function CheckboxGroup({ legend, name, options, register, error }) {
  const errorId = `${name}-error`;
  return (
    <fieldset className="field" aria-describedby={error ? errorId : undefined}>
      <legend>{legend}</legend>
      <div className="options">
        {options.map((o) => (
          <label key={o.value} className="option">
            <input type="checkbox" value={o.value} {...register(name)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error?.message} />
    </fieldset>
  );
}

export function RadioGroup({ legend, name, options, register, error, required }) {
  const errorId = `${name}-error`;
  // Radio nativo emite string ("4"); a conversão para número vive no
  // preprocess do schema (shared), pois o RHF não aplica setValueAs a radios.
  return (
    <fieldset
      className="field"
      aria-describedby={error ? errorId : undefined}
      aria-required={!!required}
    >
      <legend>
        {legend} {required && <span aria-hidden="true"> *</span>}
      </legend>
      <div className="options">
        {options.map((o) => (
          <label key={String(o.value)} className="option">
            <input
              type="radio"
              value={o.value}
              aria-invalid={!!error}
              {...register(name)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error?.message} />
    </fieldset>
  );
}

/** Linha da matriz de frequência — um fieldset por situação (§8.4). */
export function MatrixRow({ legend, name, register, error }) {
  const scale = [
    { value: 1, label: 'Nunca' },
    { value: 2, label: 'Raramente' },
    { value: 3, label: 'Às vezes' },
    { value: 4, label: 'Frequentemente' },
    { value: 5, label: 'Sempre' },
  ];
  return <RadioGroup legend={legend} name={name} options={scale} register={register} error={error} required />;
}

/** Item da escala de concordância 1–5 (§8.5). */
export function ScaleItem({ statement, name, register, error }) {
  const scale = [
    { value: 1, label: '1 — Discordo totalmente' },
    { value: 2, label: '2 — Discordo parcialmente' },
    { value: 3, label: '3 — Nem concordo nem discordo' },
    { value: 4, label: '4 — Concordo parcialmente' },
    { value: 5, label: '5 — Concordo totalmente' },
  ];
  return <RadioGroup legend={statement} name={name} options={scale} register={register} error={error} required />;
}

export function TextArea({ label, name, register, error, maxLength, hint }) {
  const errorId = `${name}-error`;
  const hintId = hint ? `${name}-hint` : undefined;
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {hint && (
        <p className="field-hint" id={hintId}>
          {hint}
        </p>
      )}
      <textarea
        id={name}
        rows={4}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={[hintId, error ? errorId : null].filter(Boolean).join(' ') || undefined}
        {...register(name)}
      />
      <FieldError id={errorId} message={error?.message} />
    </div>
  );
}

/** Navegação entre etapas: voltar (secundário) + continuar (primário). */
export function StepNav({ onBack, backLabel = 'Voltar', submitting, submitLabel = 'Continuar' }) {
  return (
    <div className="step-nav">
      {onBack && (
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          {backLabel}
        </button>
      )}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitLabel}
      </button>
    </div>
  );
}
