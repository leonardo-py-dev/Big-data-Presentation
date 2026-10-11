/**
 * Formato único de erro: { error: { code, message, fields? } }
 * Detalhe técnico vai para o log, nunca para o response.
 * Nunca logar o body — pode conter resposta de participante (anonimato, RNF05).
 */
export function errorHandler(err, _req, res, _next) {
  // Normaliza erros do body-parser para o formato estável e pt-BR
  if (err.type === 'entity.too.large') {
    err.status = 413;
    err.code = 'BODY_TOO_LARGE';
    err.message = 'Resposta muito grande. Reduza o texto e tente novamente.';
  } else if (err.type === 'entity.parse.failed') {
    err.status = 400;
    err.code = 'MALFORMED_JSON';
    err.message = 'Formato de dados inválido.';
  }

  const status = err.status ?? 500;
  const code = err.code ?? 'INTERNAL_ERROR';
  const message =
    status >= 500
      ? 'Ocorreu um erro interno. Tente novamente em instantes.'
      : (err.message ?? 'Requisição inválida.');

  if (status >= 500) {
    // Log técnico sem payload: só o que ajuda a diagnosticar
    console.error({ code, status, stack: err.stack });
  }

  const body = { error: { code, message } };
  if (err.fields) body.error.fields = err.fields;
  res.status(status).json(body);
}

/** 404 para rotas desconhecidas */
export function notFound(_req, _res, next) {
  const err = new Error('Rota não encontrada.');
  err.status = 404;
  err.code = 'NOT_FOUND';
  next(err);
}
