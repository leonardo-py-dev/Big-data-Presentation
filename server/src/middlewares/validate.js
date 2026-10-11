/**
 * Valida `req.body` contra um schema Zod do shared.
 * Erro de validação vira 400 com formato estável — nunca 500, nunca stack trace.
 */
export function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.') || '_';
        if (!fields[path]) fields[path] = [];
        fields[path].push(issue.message);
      }
      const err = new Error('Dados inválidos. Verifique os campos e tente novamente.');
      err.status = 400;
      err.code = 'VALIDATION_FAILED';
      err.fields = fields;
      return next(err);
    }
    req.validatedBody = result.data;
    return next();
  };
}
