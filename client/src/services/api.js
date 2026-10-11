/**
 * Camada HTTP do formulário — única chamada remota do MVP é o envio.
 * Erro do servidor volta no formato { error: { code, message, fields } }.
 * Base configurável: dev usa proxy do Vite (relativo); produção separada
 * usa VITE_API_URL (ex.: https://sua-api.onrender.com).
 */
const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function submitSurvey(payload) {
  const res = await fetch(`${API_BASE}/api/survey-responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // resposta sem JSON (queda de rede, proxy): trata abaixo
  }

  if (!res.ok) {
    const err = new Error(
      (data && data.error && data.error.message) ||
        'Não foi possível enviar suas respostas. Verifique sua conexão e tente novamente.',
    );
    err.fields = data && data.error && data.error.fields;
    throw err;
  }

  return data;
}
