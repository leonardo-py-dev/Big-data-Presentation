# Arquitetura — por que o projeto é assim

> Leitura destinada a quem precisa **explicar** o projeto, não só usá-lo.
> Cada seção responde: *o que foi decidido, por quê, e o que foi rejeitado.*
> Referências `§N` apontam para o PRD em `.agents/`.

---

## 1. O produto em uma frase

Um questionário web **anônimo** sobre uso de redes sociais por estudantes, com um painel **protegido** onde pesquisadores veem indicadores, filtram respostas e exportam CSV.

### Por que duas metades isoladas?

Porque os requisitos são opostos. A metade pública precisa ser aberta (pesquisa anônima não pode exigir login — isso coletaria identidade e quebraria o §4.2) e à prova de abuso sem autenticação. A metade admin precisa de autenticação forte e nunca pode vazar para o público. Misturar as duas no mesmo fluxo seria o caminho mais curto para um vazamento. Por isso: rotas `/pesquisa/*` abertas, rotas `/api/admin/*` e `/admin/*` sempre autenticadas, sem exceção — inclusive `summary` e `export.csv`.

---

## 2. Monorepo com `shared/` — a decisão estrutural mais importante

```
/
├── shared/    # enums + schemas Zod (fonte única)
├── client/    # React + Vite (formulário e painel)
└── server/    # Express + Mongoose (API)
```

### Por quê?

O PRD exige a **mesma validação no cliente e no servidor** (§9, §11). As regras têm partes sutis que só aparecem quando alguém esquece de replicar: o refinamento que garante `mainNetwork ∈ socialNetworks`, a exclusividade de `"Nenhuma"`, a escala 1–5 nas 12 chaves. Com schemas duplicados, a primeira edição unilateral gera divergência silenciosa — o sintoma típico é um 400 do servidor numa tela que o cliente jurava válida, ou pior, o inverso.

Com `shared/`, o `<select>` do React, o `enum` do Mongoose e os dois schemas Zod leem do mesmo lugar. Divergência por acidente fica impossível; divergência intencional exige editar a fonte única, o que é visível no diff.

### Alternativa rejeitada

Schemas duplicados em `client/` e `server/`. Só se justificaria se os dois lados fossem divergir de propósito (ex.: formulário mais estrito que a API para dar feedback melhor). O PRD não pede isso em lugar nenhum.

### Desvio consciente do PRD

O §13 sugere `client/` e `server/` na raiz (duas pastas). Temos três. O §13 diz "estrutura **sugerida**" e é documento de produto; evitar drift de validação é decisão de engenharia, e o próprio PRD fornece o argumento (validação dupla obrigatória).

---

## 3. Validação em duas camadas (e os três vazios do HTML)

Todo campo obrigatório tem schema no client **e** no server. O backend trata a entrada como hostil: `.strict()` rejeita campo inesperado em vez de ignorar (§15), porque campo inesperado é bug ou ataque — silenciar esconde os dois.

Três detalhes que custaram bugs reais para descobrir:

1. **`<select>` intocado emite `""`.** Para o Zod, `""` é valor presente e inválido — `optional()` rejeita. E o `setValueAs` do React Hook Form só roda *on change*, então campo intocado nunca é convertido. Solução: `stripEmpty` (preprocess no resolver do formulário) descarta `""` antes de validar.
2. **Radio group intocado é lido como `null`** (código-fonte do RHF, `getRadioValue`). `stripEmpty` descarta `null` também.
3. **Radio nativo sempre emite string** (`"4"`, nunca `4`), e o RHF não aplica `valueAsNumber`/`setValueAs` a radios. Solução: `z.preprocess` no helper `rating()` do shared converte `"4"`→`4` — num lugar só, valendo para etapa e servidor. `"abc"` vira `NaN` e continua rejeitado.

Regra geral que ficou: **opcional no Zod significa "ausente ou `undefined`"** — `""` e `null` são valores presentes e inválidos. Todo formulário com campo opcional precisa decidir isso na borda.

---

## 4. Stack — fixa pelo PRD, com dois desvios pontuais

| Camada | Escolha | Por quê |
|---|---|---|
| Client | React + Vite (não Next.js) | Formulário SPA sem necessidade de SSR; build estático simples de publicar |
| Form | React Hook Form + Zod (`zodResolver`) | Um schema por etapa no client, o mesmo objeto no server |
| Server | Express + Mongoose | Exigência do §12; Mongoose dá `enum` e validação no nível do modelo |
| Banco | MongoDB Atlas | §12; tier gratuito comporta milhares de respostas como as nossas |
| Senha admin | `bcryptjs` (não `bcrypt`) | Puro JS, sem compilação nativa — no Windows, `bcrypt` exigiria toolchain C++; para o volume de logins de um painel, a diferença é irrelevante |
| Sessão admin | JWT em cookie httpOnly + SameSite | Token nunca toca JavaScript (XSS não o lê); `localStorage` só sem alternativa |
| Gráficos | Recharts em chunk lazy | ~370 kB isolados do bundle público — o questionário mobile não paga por ele |

---

## 5. Banco real único + banco de teste separado

- **Produção/coleta**: `pesquisa_redes_sociais` (decisão do usuário — sem banco de dev separado).
- **Testes**: `pesquisa_redes_sociais_test`, no mesmo cluster, populado pelo seed determinístico `seed:synthetic` (24 docs, LCG com seed fixa = mesma massa a cada execução).

### Por que determinístico?

Teste que gera dado aleatório a cada run é teste que falha de forma diferente a cada run. Com seed fixa, a média `3.25` de `communication` é sempre `3.25` — e a suíte confere contra cálculo independente.

### Travas

O seed sintético aborta se a URI apontar para o banco real (verificação de substring `_test`). A API de teste (`server/boot-test.mjs`, porta 3002) tem a mesma trava. Defesa em profundidade contra o erro mais grave possível aqui: poluir a coleta real.

### Sem mock de banco

`mongodb-memory-server` foi considerado e descartado em favor do Atlas real também em teste: agregações, índices e `explain()` só existem de verdade no `mongod`. Mock faria o `summary` passar no teste e quebrar em produção.

---

## 6. Autenticação do admin

- **Primeiro admin**: script `seed` lê `ADMIN_EMAIL`/`ADMIN_PASSWORD` do `.env`, faz hash (bcrypt, custo 12) e upsert. A senha nunca é logada. Trocar a senha = trocar no `.env` + rodar o seed de novo.
- **Login**: rate limit agressivo (10 tentativas/15min por IP) + **mensagem idêntica** para usuário inexistente e senha errada ("E-mail ou senha incorretos."). Diferenciar as duas permite enumerar contas — erro clássico.
- **Sessão**: JWT de 12h em cookie httpOnly. `GET /auth/me` serve de sonda para o guarda de rotas do frontend.
- **Rate limit é em memória**: restart zera o contador. Para 70 respondentes e 1–2 admins, suficiente; atrás de NAT (rede universitária) o limite por IP pode ficar apertado — revisar antes de publicar.

---

## 7. Endpoints

### Público (aberto por desenho, não por descuido)

`POST /api/survey-responses` é aberto porque pesquisa anônima não tem login. A proteção é rate limit (30/15min) + teto de 50 kB no body + validação estrita — **não** autenticação. "Proteger com login" aqui seria um bug que quebra o requisito central.

`GET /api/health` existe para monitoramento e para verificar deploy.

### Administrativos (todos autenticados, sem exceção)

Listagem com filtros (nível, área, tempo, rede, período) + paginação com teto; `summary` com agregações feitas **no MongoDB** (não no Node); exportação CSV com os mesmos filtros; `DELETE` com registro técnico (só o id, nunca o conteúdo).

### Detalhes que importam

- **Formato de erro único**: `{ error: { code, message, fields? } }`. Erro 500+ vira mensagem genérica; detalhe vai para o log, nunca para a resposta. Erros do body-parser (body grande, JSON malformado) são normalizados para o mesmo formato em pt-BR.
- **CSV com BOM + escaping RFC 4180**: o comentário aberto pode conter vírgula, aspa e quebra de linha; o Excel precisa do BOM para ler os acentos. Testado com ida-volta exata.
- **Todo indicador carrega o `n`**: sem tamanho da amostra ao lado, o painel convence o pesquisador de conclusões que os dados não sustentam (§16). Com 70 respondentes no máximo, filtros por subgrupo quase sempre cairão no aviso de amostra pequena — comportamento correto, não bug.

---

## 8. Frontend

- **Uma etapa, um schema**: cada página do questionário valida contra o schema da sua etapa via `zodResolver`. A revisão valida o schema completo antes de enviar; o servidor valida de novo.
- **Rascunho em `sessionStorage` versionado** (`survey:draft:v1`): sobrevive à navegação entre etapas na sessão (§7, RF06). Persistência real entre sessões foi proibida de propósito — está fora de escopo (§7) e criaria dado parcial de participante.
- **Recusa não gera registro**: quem não confirma ser estudante é encerrado sem salvar nem rascunho (§8.2).
- **Scroll ao topo** a cada troca de rota (o formulário é longo no celular).
- **Progresso = CometDial desabilitado**: o dial (React Bits, fonte fornecida, dep `motion`) é display puro com `value` controlado — sem foco, sem drag, com override de opacidade. O sinal acessível continua sendo `role=progressbar` + texto. Dial arrastável como progresso seria mentiroso.
- **Fundo do hero = SpectralDrape próprio** (canvas, zero deps): o componente pago do React Bits Pro era inacessível sem licença, então a ideia equivalente foi implementada do zero. Respeita `prefers-reduced-motion` (frame estático) e pausa fora da viewport. Micro-transições CSS ainda não respeitam — pendência registrada.
- **Tema escuro**: clonada a linguagem visual da página de referência indicada pelo usuário (header pill, hero uppercase+serif, glow, cards) — **só estrutura e estética**; marca, imagens e conteúdo alheios não foram copiados. Exceção documentada à regra "sem gradientes" (o glow desfocado, a pedido).
- **Rotas admin em chunks lazy**: o questionário público nunca carrega o Recharts.

---

## 9. Como se verifica (e por que assim)

- **Playwright + Chromium headless** percorrem o fluxo real: home → consentimento (inclusive o caminho de recusa) → 6 etapas → revisão → envio → conclusão. Cada run de ponta a ponta **apaga os documentos que criou** no banco real (count volta a 0); a API é verificada contra o banco de teste.
- **Suítes que compartilham o banco real exigem ordem + limpeza entre elas** — aprendizado registrado após uma suíte falhar por resíduo da anterior.
- **Screenshots** conferem o visual (inclusive mobile 390px); checks de atributo (`aria-disabled`, `tabindex`, `role`) conferem acessibilidade estrutural.
- **Falhas de ambiente conhecidas**: o watcher do Vite perde edições sob OneDrive e serve transform em cache (reiniciar resolve); cada chamada de shell é uma sessão PowerShell nova (`Start-Job` não sobrevive entre elas); o rate limit de login já bloqueou a própria suíte de testes uma vez.

---

## 10. Deploy (front e API separados)

- **Frontend → Vercel, estático**: `vercel.json` neutro (só `$schema` — dashboards mandam; um arquivo compartilhado não serve a dois projetos com necessidades opostas). Projeto do front configura build/output pelo dashboard.
- **API → Render (long-running)**: `start.js` conecta e escuta; `PORT` injetada pela plataforma; rate limits em memória voltam a ser exatos. Tentativa serverless na Vercel abandonada: function subia e roteava, mas a conexão Mongoose→Atlas nunca completava a partir da Vercel (`buffering timed out` persistente com credencial válida e firewall aberto) — causa raiz no caminho de rede, fora do alcance do código. `api/index.js` mantido no repo como opção documentada.
- **Cookie cross-site**: `COOKIE_SECURE=true` em produção (`SameSite=None` + Secure); `CLIENT_ORIGIN` = URL do front.
- **Pendente**: `VITE_API_URL` no projeto do front + redeploy; `CLIENT_ORIGIN` apontando para o front publicado.
- **Limites assumidos**: rate limit aproximado por instância (suficiente para 70 respostas); cold start na primeira chamada.

---

## 11. Segredos e Git

`.env` nunca é commitado (verificado por varredura antes do primeiro push). O repositório é https://github.com/leonardo-py-dev/Big-data-Presentation.git. **Pendente**: rotação da senha do Atlas, exposta acidentalmente em um transcript durante manutenção do `.env`.

---

## 12. O que continua em aberto (decisões humanas, não de código)

Do §23 do PRD: instituição participante, menores de idade, **texto final de consentimento** (revisão obrigatória do responsável antes de ir a campo), obrigatoriedade de nível/área, prazo de coleta, quem acessa o admin, retenção/exclusão, CAPTCHA vs rate limit, piloto, formato de análise. Mais: confirmação do orientador sobre dados em nuvem (§17). Nada disso pode ser decidido por engenharia — o código está pronto para receber as respostas.
