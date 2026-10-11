# AGENTS.md — Pesquisa sobre uso de redes sociais

Diretrizes específicas deste projeto. O guia genérico (arquitetura, boas práticas, segurança, testes) está em `~/.config/opencode/AGENTS.md` e vem carregado junto. Não repita aquele conteúdo aqui.

**Fonte de verdade: o PRD** em `.agents/` na raiz deste diretório. As referências `§N` abaixo são desse arquivo. Na dúvida sobre comportamento, regra de negócio ou lista de opções, **leia o PRD** — não deduza.

## Estado atual

Monorepo npm com `shared/`, `server/`, `client/`. `shared/` contém enums e schemas Zod verificados. API Express completa e com e2e real verificado contra Atlas. Formulário com landing informativa (`/`: hero, 3 dimensões, como funciona, privacidade, FAQ, CTA), apresentação (`/pesquisa`) e fluxo completo verificado via Playwright (7/7 + scroll-to-top, 9/9 na landing). Paleta terrosa. Scroll volta ao topo a cada etapa. UI refeita na linguagem visual da página de referência do usuário (tema escuro, header pill, hero uppercase+serif, glow, cards): só estrutura e estética — marca, imagens e conteúdo deles NÃO foram copiados; conteúdo 100% nosso em pt-BR. Exceção registrada no CSS à regra global "sem gradientes" (glow desfocado, a pedido). Componente `SpectralDrape` próprio (canvas, sem dependências): drape de dots com glow em 3D no hero; respeita prefers-reduced-motion (frame estático) e pausa fora da viewport. NÃO é o componente pago do React Bits Pro (sem licença) — ideia equivalente, código original. `CometDial` (React Bits, fonte fornecida pelo usuário + dep `motion`): é a barra de progresso do formulário (`Progress.jsx`) — `value` controlado anima a cada etapa; vai `disabled` (sem foco/tab/drag) com override de opacidade, e o `role=progressbar` + texto seguem como sinal para AT. Verificado (display, tab-skip, fluxo 7/7). Banco: MongoDB Atlas, `pesquisa_redes_sociais` (o da coleta real, por decisão do usuário; testes removem seus docs, count 0). Sem git ainda. Fase 3 pronta — Bloco 5 (auth admin 9/9), Bloco 6 (endpoints listagem/summary/CSV/delete 24/24 contra banco de teste), Bloco 7 (telas /admin/login, /admin com cards+5 gráficos Recharts sempre com n, /admin/respostas com filtros/paginação/detalhe/CSV/excluir; UI 8/8 + teste com dados). Rotas admin em chunks lazy (Recharts fora do bundle público). Rate limit de login: 10/15min por IP (store em memória — restart zera); suite própria já o disparou uma vez. Acesso pelo link discreto "Acesso restrito" no rodapé. Repo: https://github.com/leonardo-py-dev/Big-data-Presentation.git (main, push OK; segredos verificados fora do commit). Deploy Vercel preparado: `server/src/app.js` exporta app puro, boot em `server/src/start.js`, Mongo com cache p/ serverless, `api/index.js` + `vercel.json` (build client, rewrite /api/*). Pendente lado do usuário: importar repo na Vercel, setar env vars, liberar 0.0.0.0/0 no Atlas Network Access, seed via máquina local.

## O produto

Formulário web **anônimo**, responsivo, mobile-first, para estudantes. Duas áreas isoladas: questionário público (`/pesquisa/*`) e painel protegido (`/admin/*`).

**Todo texto visível é em português do Brasil.** Labels, mensagens de erro, texto de consentimento. Não traduzir, não inventar string. Identificadores de código em inglês — segue a diretriz global.

## Regras que não se negociam

### 1. Anonimato (PRD §4.2, §6, §11 RNF05)

Não adicione campos de nome, e-mail, telefone, endereço. Não persista IP, user-agent ou device id. Não registre payload de resposta em log.

Isso não é preferência de estilo: a pesquisa **não pode** coletar dado identificável, e a combinação das respostas também não pode. Manter categorias amplas (nível de ensino, área) exatamente como o PRD lista.

### 2. Neutralidade metodológica (§6, §8.5)

As 12 afirmações de influência misturam benefícios e impactos **de propósito**. Não reordene, não remova, não "melhore" a redação. Isso é desenho de pesquisa, não bug. Pergunta enviesada invalida o trabalho.

### 3. Validação em duas camadas (§9, §11)

Todo campo obrigatório tem schema no client **e** no server. O backend nunca confia no frontend — trata a entrada como hostil.

Regras de combinação que precisam virar validação (não só UI):

- `"Nenhuma"` não pode coexistir com outras redes em `socialNetworks`.
- `mainNetwork` precisa estar dentro de `socialNetworks` selecionado.
- `mainNetwork` só é obrigatório se houver ≥1 rede selecionada.
- Os dois consentimentos (`consentGiven` + `studentConfirmed`) são obrigatórios no envio.
- Quem **não** confirma ser estudante é encerrado com mensagem informativa e **não gera registro** (§8.2). A recusa não é uma resposta.
- Campos inesperados no payload são **rejeitados**, não ignorados em silêncio.
- Escala de influência aceita só inteiros de 1 a 5.

### 4. Proteção do endpoint público (§15, RF08)

`POST /api/survey-responses` é aberto por natureza — é pesquisa anônima. A proteção é rate limit, limite de tamanho de body e honeypot, **não** autenticação. Não "melhore" isso exigindo login; quebraria o requisito de não coletar identidade.

Prevenir duplo envio: desabilitar o botão durante o processamento e tratar retry de rede. Falha de API **não pode apagar** o preenchimento corrente (RF13).

### 5. Painel administrativo (§16)

Todo endpoint sob `/api/admin/*` exige autenticação — inclusive `summary` e `export.csv`.

A exportação respeita os filtros ativos e **jamais** inclui campo pessoal. Indicadores sempre exibem tamanho da amostra ao lado do número; comparação com poucos participantes precisa de aviso (§16, "cuidados estatísticos"). Esse ponto não é cosmético: sem o `n`, o painel convence o pesquisador a tirar conclusão que os dados não sustentam.

### 6. Stack — fixa, não trocar (§12)

- **Client:** React + Vite, React Hook Form, Zod, React Router, Axios ou `fetch`, Recharts.
- **Server:** Node.js + Express, Mongoose, Zod, Helmet, CORS, express-rate-limit, bcrypt + JWT, lib de CSV.
- **Banco:** MongoDB, Atlas em produção, conexão por variável de ambiente.

Estrutura em `client/src/` e `server/src/` conforme §13.

### 7. Modelo de dados (§14)

**Enum em inglês snake_case no banco, label em português na tela.** `instagram`, `2_4h`, `part_time`, `yes_difficult`. Ao adicionar pergunta, derivar o valor da lista do PRD e manter label ↔ valor coerentes nos dois lados — divergência aqui aparece como bug de filtro no painel.

Índice **apenas** nos campos usados nos filtros administrativos (§14). Não indexar o resto: custo de escrita sem retorno.

Guardar versão do questionário (`questionnaireVersion`), para permitir evolução futura sem quebrar análise de dados antigos.

## Ordem de trabalho (§19)

**Fase 1 — só o MVP do participante.** Introdução → consentimento → etapas → envio → confirmação. O painel admin é Fase 3; não antecipar. Fase 0 é decisão humana.

Fluxo e paths (§8), nesta ordem:

`/` → `/pesquisa/consentimento` → `/contexto` → `/habitos` → `/influencia` → `/bem-estar` → `/comentario` → `/revisao` → `/pesquisa/concluida`

O progresso das etapas vive na sessão do navegador. **Não** implementar persistência de rascunho — está fora de escopo (§7). A etapa de revisão é recomendável mas removível; tratar como opcional, não obrigatória.

## Decisões em aberto — perguntar, não chutar (§23)

O PRD lista 10 decisões bloqueantes. Se qualquer uma for necessária à tarefa em mãos, **pergunte ao usuário**:

instituição e grupo participante · menores de idade podem responder · texto final de consentimento · nível de ensino e área obrigatórios ou opcionais · prazo de encerramento da coleta · quem acessa o admin · prazo de retenção e exclusão · se precisa CAPTCHA ou basta rate limit + honeypot · piloto · formato de análise dos resultados.

Duas que o §23 **não** cobre e continuam em aberto:

Decidido: monorepo npm com `shared/` como fonte única (enums + schemas Zod). Client e server importam de `@pesquisa/shared`; nada de validação duplicada.
- **MongoDB local.** Atlas real ou mock em memória para desenvolvimento? Afeta como o dev server sobe e como teste de integração roda.

## Não está no escopo (§4.2)

Cadastro de participante · login de respondente · coleta de dado pessoal · feed ou interação entre respondentes · diagnóstico psicológico · app mobile nativo · integração com API das redes sociais.

Se uma tarefa parecer exigir um desses, é indício de que o escopo foi esticado — confirme antes.

## Ambiente

Caminho do projeto tem **espaço e acento** (`Área de Trabalho`), e o nome do PRD tem **em dash**. Sempre **quote os paths** nos comandos e evite referenciar o `.md` por wildcard. Shell é PowerShell.

Skills locais em `.agents/skills/` cobrem React, a11y, testes, Node e MongoDB.