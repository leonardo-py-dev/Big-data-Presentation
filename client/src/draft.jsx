import { createContext, useContext, useState, useEffect } from 'react';
import { z } from 'zod';

/**
 * Rascunho do questionário — vive na sessão do navegador (§7, RF06).
 * Chave versionada (regra 4.4 da skill React): muda o schema, muda a versão,
 * e rascunho antigo não contamina o formulário novo.
 */
const DRAFT_KEY = 'survey:draft:v1';

const DraftContext = createContext(null);

function loadDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function DraftProvider({ children }) {
  const [draft, setDraft] = useState(loadDraft);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // sessionStorage cheio ou indisponível: segue sem persistir
    }
  }, [draft]);

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const clear = () => {
    setDraft({});
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // sem persistência, nada a limpar
    }
  };

  return <DraftContext.Provider value={{ draft, update, clear }}>{children}</DraftContext.Provider>;
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useDraft fora do DraftProvider');
  return ctx;
}

/**
 * Remove strings vazias ("") vindas de <select> não escolhido.
 * O schema trata esses campos como optional — "" não é undefined,
 * então limpa antes de mesclar no rascunho.
 */
export function cleanEmpty(data) {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''));
}

/**
 * Envolve um schema de etapa para descartar "" e null antes de validar.
 * Necessário por dois comportamentos do formulário HTML/RHF:
 * - <select> intocado emite "" (e setValueAs só roda on change);
 * - radio group intocado é lido como null (getRadioValue do RHF).
 * Ausente = campo opcional não respondido. O dado validado que chega
 * ao onNext já vem limpo.
 */
export function stripEmpty(schema) {
  return z.preprocess(
    (v) =>
      v && typeof v === 'object' && !Array.isArray(v)
        ? Object.fromEntries(
            Object.entries(v).filter(([, val]) => val !== '' && val !== null),
          )
        : v,
    schema,
  );
}
