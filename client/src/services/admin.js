/**
 * Camada HTTP da área administrativa.
 * credentials:'include' envia o cookie de sessão (same-origin via proxy no dev).
 * 401 vira erro tipado para o guard redirecionar ao login.
 */
async function adminFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}/api/admin${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 401) {
    const err = new Error('Sessão expirada ou inexistente.');
    err.code = 401;
    throw err;
  }
  if (res.status === 204) return null;
  let data = null;
  try {
    data = await res.json();
  } catch {
    // corpo vazio ou não-JSON
  }
  if (!res.ok) {
    throw new Error(data?.error?.message ?? 'Erro inesperado. Tente novamente.');
  }
  return data;
}

export const login = (email, password) =>
  adminFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const logout = () => adminFetch('/auth/logout', { method: 'POST' });

export const me = () => adminFetch('/auth/me');

export const getSummary = () => adminFetch('/survey-responses/summary');

export const listResponses = (params) =>
  adminFetch(`/survey-responses?${new URLSearchParams(params)}`);

export const deleteResponse = (id) => adminFetch(`/survey-responses/${id}`, { method: 'DELETE' });

const API_BASE = import.meta.env.VITE_API_URL ?? '';

/** Download via <a>: mesmo origem, o navegador envia o cookie sozinho. */
export const exportUrl = (params) =>
  `${API_BASE}/api/admin/survey-responses/export.csv?${new URLSearchParams(params)}`;
