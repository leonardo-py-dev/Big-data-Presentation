# PRD — Pesquisa sobre o uso de redes sociais e sua influência no cotidiano de estudantes

**Versão:** 1.0  
**Status:** Planejamento  
**Stack prevista:** MERN — MongoDB, Express, React e Node.js  
**Público-alvo:** Estudantes regularmente matriculados em uma instituição de ensino  
**Tempo estimado de preenchimento:** 3 a 5 minutos

---

## 1. Visão geral

Este produto será uma página web responsiva para coleta anônima de respostas sobre hábitos de uso de redes sociais e a influência percebida dessas plataformas no dia a dia de estudantes.

A aplicação deverá oferecer uma experiência simples, rápida e acessível para o participante, além de uma área administrativa protegida para que pesquisadores autorizados possam acompanhar, filtrar, analisar e exportar os dados coletados.

O questionário deverá manter uma abordagem neutra, investigando tanto possíveis benefícios quanto possíveis impactos negativos das redes sociais, sem induzir o participante a considerar previamente que o uso é positivo ou prejudicial.

---

## 2. Problema

Estudantes utilizam redes sociais em diferentes momentos da rotina, inclusive durante os estudos, antes de dormir e em situações de tédio ou ansiedade. Entretanto, é necessário coletar dados estruturados para compreender:

- Quais plataformas são mais utilizadas;
- Quanto tempo os estudantes permanecem conectados;
- Quais são os principais motivos de uso;
- Como o uso é percebido em relação à concentração, produtividade, sono, humor e relacionamentos;
- Quais estratégias os estudantes utilizam para controlar o tempo de uso.

Atualmente, sem um formulário padronizado, as respostas podem ficar dispersas, difíceis de comparar e trabalhosas de analisar manualmente.

---

## 3. Objetivos

### 3.1 Objetivo principal

Coletar e organizar informações sobre o uso de redes sociais e sua influência percebida no cotidiano de estudantes.

### 3.2 Objetivos específicos

1. Identificar as redes sociais mais utilizadas.
2. Estimar o tempo médio diário de uso.
3. Identificar os principais momentos e motivos de acesso.
4. Medir a percepção dos estudantes sobre concentração, produtividade, sono, humor e relacionamentos.
5. Verificar se os participantes já tentaram reduzir o uso.
6. Identificar estratégias de controle utilizadas.
7. Permitir a análise dos resultados por grupos acadêmicos amplos, quando essa informação for coletada.
8. Disponibilizar os dados para análise em formato estruturado e, quando necessário, exportável.

---

## 4. Escopo

### 4.1 Incluído na primeira versão

- Página de apresentação da pesquisa;
- Consentimento informado;
- Confirmação de que o participante é estudante;
- Questionário dividido em etapas;
- Indicador de progresso;
- Validação dos campos obrigatórios;
- Salvamento da resposta na API;
- Página de confirmação após o envio;
- API REST em Node.js e Express;
- Persistência em MongoDB usando Mongoose;
- Área administrativa protegida;
- Listagem e filtragem de respostas;
- Indicadores estatísticos básicos;
- Exportação de dados anonimizados em CSV;
- Tratamento de erros e proteção contra envios abusivos.

### 4.2 Fora do escopo inicial

- Cadastro de participantes;
- Login para respondentes;
- Coleta de nome, e-mail, telefone ou endereço;
- Feed ou interação entre participantes;
- Diagnóstico psicológico ou clínico;
- Recomendação personalizada de tratamento ou comportamento;
- Aplicativo mobile nativo;
- Integração com APIs das redes sociais;
- Publicação automática dos resultados em redes sociais.

---

## 5. Personas

### 5.1 Participante

Estudante que acessa o formulário pelo celular ou computador, responde às perguntas e deseja concluir o processo rapidamente.

**Necessidades:** clareza, privacidade, poucas etapas, facilidade de preenchimento e confirmação do envio.

**Possíveis dificuldades:** conexão instável, dúvida sobre alguma pergunta, falta de tempo e receio de identificação.

### 5.2 Pesquisador ou administrador

Pessoa autorizada a acompanhar a coleta e analisar os resultados.

**Necessidades:** visualizar o volume de respostas, aplicar filtros, consultar distribuições e exportar dados para análise posterior.

**Requisitos:** autenticação, controle de acesso, proteção dos dados e interface objetiva.

---

## 6. Princípios do produto

1. **Anonimato por padrão:** não solicitar dados pessoais identificáveis sem justificativa clara.
2. **Neutralidade metodológica:** apresentar perguntas equilibradas, com aspectos positivos e negativos.
3. **Baixa fricção:** reduzir o número de campos e manter o preenchimento entre 3 e 5 minutos.
4. **Mobile first:** priorizar o uso em smartphones.
5. **Transparência:** explicar finalidade, voluntariedade e uso das respostas.
6. **Acessibilidade:** utilizar linguagem simples, bom contraste, navegação por teclado e rótulos adequados.
7. **Validação consistente:** validar os dados no frontend e no backend.
8. **Privacidade e segurança:** coletar apenas o necessário e restringir o acesso administrativo.

---

## 7. Jornada do participante

```text
Acessa a pesquisa
      ↓
Lê a apresentação e a finalidade
      ↓
Confirma que é estudante e aceita participar
      ↓
Responde ao contexto acadêmico
      ↓
Responde sobre hábitos de uso
      ↓
Avalia influências no cotidiano
      ↓
Responde sobre estudos, sono e controle de uso
      ↓
Adiciona comentário opcional
      ↓
Envia a resposta
      ↓
Visualiza confirmação
```

A aplicação deve permitir retornar à etapa anterior sem perder os dados já preenchidos. O progresso deve ser mantido apenas durante a sessão do navegador, salvo se futuramente for implementado um mecanismo explícito de rascunho.

---

## 8. Planejamento da página pública

### 8.1 Página de apresentação — `/`

**Objetivo:** explicar a pesquisa e incentivar uma participação consciente.

**Elementos:**

- Título: **Uso de redes sociais e sua influência no cotidiano de estudantes**;
- Texto curto sobre a finalidade;
- Público-alvo;
- Tempo estimado de preenchimento;
- Aviso de participação voluntária;
- Aviso de que as respostas serão analisadas de forma agregada;
- Link para informações de privacidade;
- Botão principal: **Iniciar pesquisa**;
- Botão secundário ou link: **Sair**.

**Texto sugerido:**

> Esta pesquisa busca compreender como estudantes utilizam redes sociais e como percebem sua influência na rotina, nos estudos, no sono, no humor e nos relacionamentos. A participação é voluntária, e o preenchimento leva aproximadamente 3 a 5 minutos. Não solicitaremos nome, e-mail ou outros dados pessoais identificáveis.

### 8.2 Etapa de consentimento — `/pesquisa/consentimento`

**Campos obrigatórios:**

- Checkbox: “Li as informações acima e concordo em participar voluntariamente da pesquisa.”
- Checkbox: “Confirmo que sou estudante.”

**Comportamento:**

- O botão de continuidade permanece desabilitado até os dois aceites;
- Caso o participante não confirme que é estudante, o formulário é encerrado com uma mensagem informativa;
- A recusa não deve ser registrada como uma resposta de pesquisa.

### 8.3 Etapa de contexto acadêmico — `/pesquisa/contexto`

Campos recomendados:

1. **Nível de ensino** — obrigatório
   - Ensino fundamental
   - Ensino médio
   - Ensino técnico
   - Graduação
   - Pós-graduação
   - Outro
   - Prefiro não responder

2. **Área de estudo** — opcional
   - Ciências humanas
   - Ciências exatas
   - Ciências biológicas
   - Saúde
   - Tecnologia
   - Artes e comunicação
   - Outra
   - Prefiro não responder

3. **Além de estudar, você trabalha?** — opcional
   - Não
   - Sim, em período parcial
   - Sim, em período integral
   - Prefiro não responder

A área de estudo deve usar categorias amplas para evitar que a combinação de respostas identifique um participante.

### 8.4 Etapa de hábitos de uso — `/pesquisa/habitos`

1. **Quais redes sociais você utiliza atualmente?** — seleção múltipla, obrigatória
   - Instagram
   - TikTok
   - YouTube
   - Facebook
   - WhatsApp
   - X/Twitter
   - LinkedIn
   - Reddit
   - Outra
   - Nenhuma

2. **Qual rede social você utiliza com maior frequência?** — seleção única, obrigatória quando uma ou mais redes forem selecionadas

3. **Quanto tempo por dia você estima passar em redes sociais?** — seleção única, obrigatória
   - Menos de 30 minutos
   - De 30 minutos a 1 hora
   - De 1 a 2 horas
   - De 2 a 4 horas
   - De 4 a 6 horas
   - Mais de 6 horas
   - Não sei estimar

4. **Com que frequência você acessa redes sociais nos seguintes momentos?** — matriz de frequência

| Situação | Nunca | Raramente | Às vezes | Frequentemente | Sempre |
|---|---:|---:|---:|---:|---:|
| Ao acordar | ○ | ○ | ○ | ○ | ○ |
| Durante as refeições | ○ | ○ | ○ | ○ | ○ |
| Durante os estudos | ○ | ○ | ○ | ○ | ○ |
| Antes de dormir | ○ | ○ | ○ | ○ | ○ |
| Quando está entediado(a) | ○ | ○ | ○ | ○ | ○ |
| Quando está ansioso(a) ou preocupado(a) | ○ | ○ | ○ | ○ | ○ |

5. **Qual é o principal motivo para utilizar redes sociais?** — seleção única
   - Entretenimento
   - Comunicação
   - Notícias e informação
   - Estudos ou trabalho
   - Acompanhar amigos e familiares
   - Compras
   - Criar ou compartilhar conteúdo
   - Passar o tempo
   - Outro

### 8.5 Etapa de influência no cotidiano — `/pesquisa/influencia`

Usar escala de concordância de 1 a 5:

- 1 — Discordo totalmente
- 2 — Discordo parcialmente
- 3 — Nem concordo nem discordo
- 4 — Concordo parcialmente
- 5 — Concordo totalmente

Afirmações:

1. As redes sociais facilitam minha comunicação com outras pessoas.
2. As redes sociais me ajudam a encontrar informações úteis.
3. As redes sociais contribuem para meu entretenimento.
4. As redes sociais interferem na minha concentração durante os estudos.
5. As redes sociais fazem com que eu adie tarefas acadêmicas.
6. Sinto que as redes sociais ocupam mais tempo do que eu gostaria.
7. Tenho dificuldade para interromper o uso depois que começo.
8. As redes sociais influenciam meu humor.
9. Comparo minha vida com a de pessoas que acompanho nas redes sociais.
10. As redes sociais influenciam minhas opiniões ou decisões.
11. As redes sociais ajudam a manter meus relacionamentos.
12. As redes sociais prejudicam momentos de convivência presencial.

### 8.6 Etapa de estudos, sono e bem-estar — `/pesquisa/bem-estar`

1. **Com que frequência o uso de redes sociais afeta seu sono?**
   - Nunca
   - Raramente
   - Às vezes
   - Frequentemente
   - Sempre

2. **Com que frequência você verifica redes sociais enquanto deveria estar estudando?**
   - Nunca
   - Raramente
   - Às vezes
   - Frequentemente
   - Sempre

3. **Como você avalia o impacto das redes sociais na sua produtividade acadêmica?**
   - Muito positivo
   - Positivo
   - Neutro
   - Negativo
   - Muito negativo
   - Não sei avaliar

4. **Como você costuma se sentir depois de passar muito tempo nas redes sociais?** — seleção múltipla
   - Mais relaxado(a)
   - Mais informado(a)
   - Mais conectado(a)
   - Indiferente
   - Cansado(a)
   - Ansioso(a)
   - Frustrado(a)
   - Outro

5. **Você já tentou reduzir o tempo de uso?**
   - Sim, e consegui manter a redução
   - Sim, mas tive dificuldade
   - Não, mas gostaria de tentar
   - Não tenho interesse
   - Não sei

6. **Você utiliza alguma estratégia para controlar o tempo de uso?** — seleção múltipla
   - Limite de aplicativos
   - Desativação de notificações
   - Aplicativo de monitoramento
   - Períodos sem celular
   - Deixar o celular distante durante os estudos
   - Nenhuma
   - Outra

### 8.7 Etapa de comentário — `/pesquisa/comentario`

Campo opcional:

> Na sua opinião, qual é a principal influência das redes sociais na sua vida como estudante?

Limite recomendado: 2.000 caracteres.

Campo opcional adicional:

> O que poderia ajudar estudantes a manter uma relação mais equilibrada com as redes sociais?

### 8.8 Etapa de revisão — `/pesquisa/revisao`

Antes do envio, mostrar:

- Resumo das respostas por seção;
- Aviso de que o envio não poderá ser editado posteriormente;
- Botão **Voltar e editar**;
- Botão **Enviar respostas**.

A revisão é recomendada, mas pode ser removida caso o objetivo prioritário seja reduzir o tempo de preenchimento.

### 8.9 Página de conclusão — `/pesquisa/concluida`

Mensagem sugerida:

> Obrigado por participar. Sua resposta foi registrada com sucesso e será analisada junto às demais respostas da pesquisa.

A página não deve exibir dados que permitam identificar o participante. Opcionalmente, poderá apresentar um código técnico de confirmação, sem transformá-lo em um identificador pessoal.

---

## 9. Regras de validação

### Regras gerais

- Campos obrigatórios devem ser claramente identificados;
- O participante não pode avançar se houver erro na etapa atual;
- Mensagens de erro devem ser específicas e próximas ao campo;
- Os dados devem ser validados novamente no backend;
- Campos de texto devem ter limite de caracteres;
- Valores de escalas devem aceitar apenas números dentro do intervalo definido;
- A opção “Nenhuma” não pode ser combinada com outras redes sociais;
- A rede principal deve pertencer à lista de redes selecionadas;
- O envio deve exigir os dois consentimentos;
- O formulário deve impedir duplo clique e envio duplicado durante o processamento.

### Mensagens de erro sugeridas

- “Selecione pelo menos uma opção.”
- “Escolha a rede social utilizada com maior frequência.”
- “Confirme que você é estudante para continuar.”
- “É necessário concordar com a participação para continuar.”
- “Não foi possível enviar suas respostas. Verifique sua conexão e tente novamente.”

---

## 10. Requisitos funcionais

### RF01 — Apresentação

O sistema deve exibir a finalidade, o público-alvo, o tempo estimado e os avisos de privacidade antes do início.

### RF02 — Consentimento

O sistema deve solicitar e registrar o consentimento antes de aceitar uma resposta.

### RF03 — Identificação do público

O sistema deve confirmar que o participante é estudante. Participantes que não atendam ao critério devem ser direcionados para uma página de encerramento.

### RF04 — Formulário por etapas

O sistema deve dividir o questionário em etapas com navegação anterior/próxima.

### RF05 — Indicador de progresso

O sistema deve exibir a etapa atual e o progresso aproximado.

### RF06 — Persistência temporária

O sistema deve manter os dados preenchidos enquanto o participante navega entre as etapas durante a sessão.

### RF07 — Envio

O sistema deve enviar uma resposta completa para a API e exibir uma confirmação após o processamento bem-sucedido.

### RF08 — Prevenção de duplicidade

O sistema deve reduzir o risco de múltiplos envios acidentais do mesmo formulário.

### RF09 — Área administrativa

O sistema deve permitir que usuários autorizados consultem respostas por meio de uma área protegida.

### RF10 — Filtros

O administrador deve conseguir filtrar respostas por nível de ensino, área de estudo, tempo diário de uso, rede principal e período de envio.

### RF11 — Indicadores

O painel deve apresentar contagem total, distribuição de tempo de uso, redes mais utilizadas e médias das escalas principais.

### RF12 — Exportação

O administrador deve conseguir exportar dados anonimizados em CSV.

### RF13 — Tratamento de indisponibilidade

Caso a API esteja indisponível, o sistema deve informar o problema sem apagar os dados preenchidos na etapa atual.

---

## 11. Requisitos não funcionais

### RNF01 — Responsividade

A interface deve funcionar em smartphones, tablets e computadores, com prioridade para telas pequenas.

### RNF02 — Desempenho

A página inicial deve carregar rapidamente em uma conexão móvel comum. O frontend deve evitar dependências e imagens desnecessárias.

### RNF03 — Acessibilidade

- Navegação completa por teclado;
- Labels associados aos campos;
- Foco visível;
- Contraste adequado;
- Mensagens de erro anunciadas de forma acessível;
- Não depender apenas de cor para indicar estado;
- Botões com área de toque confortável;
- Compatibilidade com leitores de tela sempre que possível.

### RNF04 — Segurança

- HTTPS em produção;
- Helmet no backend;
- CORS restrito ao domínio do frontend;
- Rate limiting no endpoint de envio;
- Limite de tamanho do corpo das requisições;
- Sanitização e validação de entradas;
- Segredos armazenados em variáveis de ambiente;
- Autenticação e autorização na área administrativa;
- Senhas administrativas armazenadas com hash seguro;
- Logs sem respostas completas ou dados sensíveis.

### RNF05 — Privacidade

- Não armazenar nome, e-mail, telefone ou endereço por padrão;
- Não armazenar IP ou identificadores de dispositivo sem necessidade documentada;
- Não disponibilizar respostas publicamente;
- Restringir exportações aos administradores;
- Definir prazo de retenção e procedimento de exclusão;
- Informar claramente a finalidade da coleta.

### RNF06 — Observabilidade

Registrar eventos técnicos como falhas de API, erros de banco e tentativas de acesso administrativo, sem registrar o conteúdo das respostas de forma desnecessária.

---

## 12. Arquitetura técnica MERN

```text
React + Vite
  ├── React Hook Form
  ├── Zod
  ├── React Router
  └── Cliente HTTP
          │
          │ HTTPS / JSON
          ▼
Node.js + Express
  ├── Rotas
  ├── Controllers
  ├── Services
  ├── Middlewares de validação
  ├── Autenticação administrativa
  └── Rate limiting
          │
          ▼
MongoDB + Mongoose
```

### Frontend

- React;
- Vite;
- React Hook Form;
- Zod;
- React Router;
- Axios ou `fetch`;
- Biblioteca de componentes acessíveis, se necessário;
- Recharts ou biblioteca similar para gráficos administrativos.

### Backend

- Node.js;
- Express;
- Mongoose;
- Zod ou express-validator;
- Helmet;
- CORS;
- Express Rate Limit;
- Biblioteca para autenticação e hash de senha;
- Biblioteca de geração de CSV.

### Banco

MongoDB Atlas em produção, com conexão por variável de ambiente.

---

## 13. Estrutura de pastas sugerida

```text
project/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── research/
│       │   └── admin/
│       ├── schemas/
│       ├── services/
│       ├── hooks/
│       ├── routes/
│       └── styles/
│
└── server/
    └── src/
        ├── config/
        ├── controllers/
        ├── middlewares/
        ├── models/
        ├── routes/
        ├── services/
        ├── validators/
        └── app.js
```

---

## 14. Modelo de dados

### Coleção `survey_responses`

```js
{
  _id: ObjectId,
  consentGiven: true,
  studentConfirmed: true,
  educationLevel: "undergraduate",
  studyArea: "technology",
  worksWhileStudying: "part_time",
  socialNetworks: ["instagram", "youtube", "whatsapp"],
  mainNetwork: "instagram",
  dailyUsage: "2_4h",
  accessSituations: {
    wakingUp: 4,
    meals: 2,
    studying: 3,
    beforeSleep: 5,
    boredom: 5,
    anxiety: 3
  },
  mainReason: "entertainment",
  influenceRatings: {
    communication: 5,
    usefulInformation: 4,
    entertainment: 5,
    concentrationInterference: 4,
    academicProcrastination: 4,
    excessiveTime: 4,
    difficultyStopping: 3,
    moodInfluence: 3,
    socialComparison: 3,
    opinionInfluence: 4,
    relationships: 4,
    inPersonInteraction: 2
  },
  sleepImpact: "sometimes",
  studyCheckingFrequency: "frequently",
  academicProductivityImpact: "negative",
  postUseFeelings: ["tired", "anxious"],
  triedToReduce: "yes_difficult",
  controlMethods: ["notifications_disabled"],
  openComment: "Texto opcional do participante",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Observações sobre o modelo

- Não incluir campos de identificação pessoal por padrão;
- Usar enums para respostas fechadas;
- Limitar o tamanho de respostas abertas;
- Criar índices somente para campos usados nos filtros administrativos;
- Considerar um campo técnico de versão do questionário para permitir evolução futura;
- Considerar um campo de status técnico, como `valid`, `flagged` ou `deleted`, se houver necessidade de moderação ou exclusão lógica.

---

## 15. Endpoints da API

### Público

```http
POST /api/survey-responses
```

Cria uma resposta validada.

```http
GET /api/health
```

Verifica a disponibilidade da API.

### Administrativo

```http
POST /api/admin/auth/login
GET /api/admin/survey-responses
GET /api/admin/survey-responses/summary
GET /api/admin/survey-responses/export.csv
DELETE /api/admin/survey-responses/:id
```

### Regras dos endpoints

- `POST /api/survey-responses` deve aceitar apenas os campos previstos no schema;
- A API deve rejeitar campos inesperados ou ignorá-los de forma controlada;
- Endpoints administrativos exigem autenticação;
- A exportação deve respeitar os filtros aplicados;
- A exclusão deve exigir uma permissão administrativa apropriada e gerar registro técnico da ação.

---

## 16. Painel administrativo

### Tela de login — `/admin/login`

- Campo de usuário ou e-mail;
- Campo de senha;
- Mensagem genérica para falha de autenticação;
- Proteção contra tentativas repetidas;
- Encerramento seguro da sessão.

### Dashboard — `/admin`

Cards recomendados:

- Total de respostas;
- Respostas recebidas no período;
- Rede mais utilizada;
- Faixa de tempo de uso mais frequente;
- Percentual de participantes que acessam redes durante os estudos;
- Percentual de participantes que relatam impacto no sono.

Gráficos recomendados:

- Redes sociais utilizadas;
- Tempo diário de uso;
- Principais motivos de uso;
- Distribuição das escalas de influência;
- Estratégias de controle de uso;
- Comparação entre níveis de ensino, se houver amostra suficiente.

### Tela de respostas

- Tabela paginada;
- Filtros combináveis;
- Ordenação por data;
- Visualização detalhada sem dados pessoais;
- Exportação CSV;
- Exclusão ou anonimização conforme permissão.

### Cuidados estatísticos

O painel deve exibir o tamanho da amostra junto aos indicadores. Comparações com poucos participantes devem ser sinalizadas para evitar interpretações equivocadas.

---

## 17. Privacidade, ética e LGPD

Como a pesquisa coleta percepções sobre rotina e bem-estar, a aplicação deve tratar os dados com cuidado, mesmo sem solicitar informações de saúde ou identificação direta.

### Medidas recomendadas

- Exibir finalidade e forma de uso dos dados antes do consentimento;
- Informar que a participação é voluntária;
- Informar que o participante pode abandonar o formulário sem concluir;
- Coletar somente dados necessários ao objetivo;
- Evitar perguntas sobre diagnósticos, tratamentos ou informações clínicas;
- Evitar combinação de respostas que torne um estudante identificável;
- Definir quem terá acesso aos resultados;
- Definir prazo de retenção;
- Documentar o procedimento de exclusão;
- Apresentar resultados de forma agregada;
- Consultar a instituição ou responsável pela pesquisa sobre necessidade de avaliação ética, autorização institucional ou termo de consentimento específico.

O texto final de consentimento deve ser revisado pelo responsável pela pesquisa e, se aplicável, pela instituição de ensino ou comitê competente. Este PRD não substitui orientação jurídica ou ética institucional.

---

## 18. Critérios de sucesso

### Métricas de produto

- Taxa de conclusão do formulário;
- Tempo médio de preenchimento;
- Taxa de abandono por etapa;
- Taxa de erro no envio;
- Percentual de respostas inválidas ou incompletas;
- Percentual de acessos em dispositivos móveis;
- Número de respostas válidas por período.

### Metas iniciais sugeridas

- Tempo mediano de preenchimento inferior a 5 minutos;
- Taxa de conclusão superior a 70% entre os participantes que iniciaram;
- Menos de 2% de falhas técnicas no envio;
- 100% dos registros armazenados sem campos pessoais não previstos;
- 100% dos endpoints administrativos protegidos;
- Exportação concluída em tempo adequado para o volume esperado.

As metas devem ser ajustadas após um teste piloto.

---

## 19. Plano de desenvolvimento

### Fase 0 — Preparação

- Validar objetivo da pesquisa;
- Revisar perguntas com o responsável acadêmico;
- Confirmar público e critérios de participação;
- Revisar texto de consentimento e privacidade;
- Definir prazo de retenção dos dados.

### Fase 1 — MVP do participante

- Configurar projeto React e API Express;
- Criar schema MongoDB;
- Implementar introdução, consentimento e formulário;
- Adicionar validação e indicador de progresso;
- Implementar envio e confirmação;
- Criar tratamento de erros;
- Realizar teste de usabilidade com pequeno grupo.

### Fase 2 — Segurança e qualidade

- Configurar CORS, Helmet e rate limiting;
- Adicionar testes de validação;
- Revisar acessibilidade;
- Testar em dispositivos móveis;
- Verificar ausência de dados pessoais acidentais;
- Configurar logs técnicos.

### Fase 3 — Área administrativa

- Implementar autenticação;
- Criar dashboard;
- Criar listagem e filtros;
- Implementar resumo estatístico;
- Implementar exportação CSV;
- Adicionar controle de permissões.

### Fase 4 — Piloto e publicação

- Aplicar a pesquisa a um grupo pequeno;
- Avaliar clareza das perguntas;
- Medir tempo de preenchimento e abandono;
- Corrigir problemas;
- Publicar a versão oficial;
- Monitorar a coleta e a qualidade dos dados.

---

## 20. Testes necessários

### Testes funcionais

- O participante consegue iniciar a pesquisa;
- O participante não avança sem consentimento;
- A opção “Nenhuma” funciona corretamente;
- A rede principal precisa estar entre as redes selecionadas;
- O envio é realizado uma única vez;
- A confirmação aparece somente após resposta aceita pela API;
- A área administrativa exige autenticação;
- Os filtros retornam os dados esperados;
- A exportação contém apenas campos permitidos.

### Testes de acessibilidade

- Navegação por teclado;
- Leitor de tela;
- Foco visível;
- Contraste;
- Campos com labels;
- Mensagens de erro compreensíveis;
- Uso em orientação vertical no celular.

### Testes de segurança

- Tentativas de acesso sem autenticação;
- Campos inesperados no payload;
- Payloads excessivamente grandes;
- Tentativas repetidas de envio;
- Injeção de conteúdo em campos abertos;
- Acesso indevido a respostas;
- Exposição de credenciais ou variáveis de ambiente.

### Testes de usabilidade

Conduzir um piloto com estudantes que representem o público-alvo e perguntar:

- As instruções ficaram claras?
- Alguma pergunta pareceu ambígua?
- O tempo de preenchimento foi aceitável?
- Houve desconforto ou receio de identificação?
- As opções de resposta cobriram a realidade do participante?

---

## 21. Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Baixa taxa de conclusão | Alto | Formulário curto, progresso visível e teste piloto |
| Perguntas induzem respostas | Alto | Revisão metodológica e linguagem neutra |
| Identificação indireta do participante | Alto | Categorias amplas e minimização de dados |
| Respostas duplicadas | Médio | Rate limiting, controle técnico e análise de padrões |
| Spam automatizado | Médio | Rate limiting, honeypot e CAPTCHA somente se necessário |
| Interpretação indevida de correlação | Alto | Exibir amostra, documentar limitações e evitar conclusões causais |
| Indisponibilidade da API | Médio | Monitoramento, tratamento de erro e manutenção do preenchimento local |
| Acesso indevido ao painel | Alto | Autenticação forte, autorização e logs |
| Amostra não representativa | Alto | Documentar método de divulgação e limitações da pesquisa |
| Respostas abertas com dados pessoais | Médio | Aviso para não inserir informações identificáveis e revisão na exportação |

---

## 22. Limitações metodológicas esperadas

- Os dados serão baseados na percepção dos participantes;
- O tempo de uso será estimado, não necessariamente medido objetivamente;
- A amostra pode não representar todos os estudantes;
- Os resultados podem indicar associação, mas não provar causalidade;
- Participantes com maior interesse no tema podem estar mais propensos a responder;
- Respostas abertas podem exigir categorização manual posterior.

Essas limitações devem acompanhar qualquer relatório produzido a partir dos dados.

---

## 23. Decisões recomendadas antes do desenvolvimento

1. Definir a instituição, turma ou grupo que poderá participar.
2. Confirmar se estudantes menores de idade poderão responder.
3. Revisar o texto de consentimento com o responsável pela pesquisa.
4. Decidir se “nível de ensino” e “área de estudo” serão obrigatórios ou opcionais.
5. Definir o prazo de encerramento da coleta.
6. Definir quem terá acesso ao painel administrativo.
7. Definir o prazo de retenção e o procedimento de exclusão.
8. Definir se será necessário um CAPTCHA ou se rate limiting e honeypot serão suficientes.
9. Realizar um piloto antes da divulgação ampla.
10. Definir como os resultados serão analisados e apresentados.

---

## 24. Definition of Done

A primeira versão será considerada pronta quando:

- O participante conseguir completar o questionário pelo celular;
- O consentimento for exigido antes do envio;
- Todas as perguntas obrigatórias tiverem validação no frontend e backend;
- A resposta for persistida corretamente no MongoDB;
- O sistema impedir ou sinalizar envios duplicados;
- A página de confirmação for exibida após sucesso;
- A API possuir tratamento de erros consistente;
- Os endpoints administrativos exigirem autenticação;
- O painel apresentar listagem, filtros e indicadores básicos;
- A exportação CSV não incluir dados pessoais não previstos;
- Os testes funcionais, de acessibilidade e de segurança essenciais forem aprovados;
- O texto de consentimento e privacidade tiver sido revisado pelo responsável pela pesquisa;
- Um teste piloto tiver sido concluído e os ajustes necessários aplicados.

---

## 25. Resumo executivo

O produto será um formulário web anônimo, responsivo e dividido em etapas para estudantes, com foco em três dimensões principais:

1. **Hábitos de uso:** plataformas, tempo, momentos e motivos de acesso;
2. **Influência percebida:** concentração, produtividade, sono, humor e relacionamentos;
3. **Autocontrole:** tentativas e estratégias para reduzir o uso.

A solução MERN permitirá separar claramente a experiência do participante da área administrativa, mantendo os dados estruturados, protegidos e disponíveis para análise. A recomendação é iniciar com um MVP simples, realizar um piloto com poucos estudantes e só então divulgar a pesquisa em maior escala.
