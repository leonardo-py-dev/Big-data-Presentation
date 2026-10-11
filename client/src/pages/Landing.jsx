import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import SpectralDrape from '../components/SpectralDrape.jsx';

/**
 * Landing page — `/`. Estrutura e linguagem visual espelham a página de
 * referência (header pill, hero uppercase + serif, glow, showcase, cards,
 * split fixo, FAQ, CTA, footer). Conteúdo 100% nosso, em português.
 */
export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="glow glow-hero" aria-hidden="true" />
          <SpectralDrape />
          <div className="container-wide hero-inner">
            <p className="eyebrow">Pesquisa acadêmica • Anônima • Voluntária</p>
            <h1 id="hero-title" className="hero-title">
              Redes sociais
              <span className="serif">na vida do estudante</span>
            </h1>
            <p className="hero-sub">
              Como estudantes usam as redes sociais — e como percebem essa presença na rotina, nos
              estudos, no sono, no humor e nos relacionamentos.
            </p>
            <div className="hero-ctas">
              <Link className="btn btn-primary" to="/pesquisa">
                Iniciar pesquisa <span aria-hidden="true">→</span>
              </Link>
              <a className="btn btn-secondary" href="#como-funciona">
                Como funciona
              </a>
            </div>
            <p className="hero-note">Cerca de 3 a 5 minutos, direto no celular.</p>
          </div>
        </section>

        <section className="showcase" aria-label="Prévia do questionário">
          <div className="container-wide">
            <div className="glow glow-showcase" aria-hidden="true" />
            <div className="mock">
              <div className="mock-bar" aria-hidden="true">
                <span className="mock-dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span>pesquisa • etapa 3 de 7</span>
              </div>
              <div className="mock-body">
                <h3>Hábitos de uso</h3>
                <p>Quais redes sociais você utiliza atualmente?</p>
                <div className="mock-options" aria-hidden="true">
                  <div className="mock-option on">
                    <span className="mock-radio" />
                    Instagram
                  </div>
                  <div className="mock-option on">
                    <span className="mock-radio" />
                    YouTube
                  </div>
                  <div className="mock-option">
                    <span className="mock-radio" />
                    TikTok
                  </div>
                </div>
                <p className="mock-caption">
                  Prévia ilustrativa — o questionário real tem 7 etapas com barra de progresso.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="dimensoes" aria-labelledby="dimensoes-t">
          <div className="container-wide">
            <h2 id="dimensoes-t" className="section-title">
              O que a pesquisa <span className="serif">investiga</span>
            </h2>
            <p className="section-sub">
              Três dimensões, do hábito concreto à percepção de equilíbrio.
            </p>
            <div className="cards">
              <div className="card">
                <strong>Hábitos de uso</strong>
                <p>
                  Quais plataformas você usa, quanto tempo passa nelas, em que momentos do dia
                  acessa e por quais motivos.
                </p>
                <Link className="more" to="/pesquisa">
                  Responder <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="card">
                <strong>Influência percebida</strong>
                <p>
                  Como você sente esse uso na concentração, na produtividade, no sono, no humor e
                  nos relacionamentos — pontos positivos e negativos.
                </p>
                <Link className="more" to="/pesquisa">
                  Responder <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="card">
                <strong>Autocontrole</strong>
                <p>
                  Se você já tentou reduzir o tempo de uso e quais estratégias adota para manter o
                  equilíbrio.
                </p>
                <Link className="more" to="/pesquisa">
                  Responder <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="privacidade" aria-labelledby="privacidade-t">
          <div className="container-wide split">
            <div className="split-sticky">
              <h2 id="privacidade-t">
                Por que
                <br />
                participar?
              </h2>
              <Link className="btn btn-secondary" to="/pesquisa">
                Iniciar pesquisa
              </Link>
            </div>
            <div className="rows">
              <div className="row">
                <span className="row-icon" aria-hidden="true">
                  A
                </span>
                <div>
                  <h3>Anônima por desenho</h3>
                  <p>
                    Sem nome, e-mail, telefone ou endereço — em nenhuma etapa. As perguntas de
                    perfil usam faixas genéricas para impedir identificação indireta, e as respostas
                    são analisadas em conjunto.
                  </p>
                </div>
              </div>
              <div className="row">
                <span className="row-icon" aria-hidden="true">
                  R
                </span>
                <div>
                  <h3>Rápida de verdade</h3>
                  <p>
                    Sete etapas curtas com barra de progresso, pensadas para concluir em 3 a 5
                    minutos no celular. Dá para voltar sem perder o que já preencheu.
                  </p>
                </div>
              </div>
              <div className="row">
                <span className="row-icon" aria-hidden="true">
                  V
                </span>
                <div>
                  <h3>Voluntária até o fim</h3>
                  <p>
                    Nada é registrado antes do envio final. Abandonou no meio? Nenhuma resposta é
                    guardada. Sem cadastro, sem login, sem contato posterior.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="como-funciona" aria-labelledby="como-funciona-t">
          <div className="container-wide">
            <h2 id="como-funciona-t" className="section-title">
              Como <span className="serif">funciona</span>
            </h2>
            <p className="section-sub">Da apresentação à confirmação, em quatro passos.</p>
            <ol className="steps">
              <li>
                <strong>Leia e consinta.</strong> Você confirma que é estudante e aceita participar
                voluntariamente.
              </li>
              <li>
                <strong>Responda em etapas.</strong> Partes curtas, com progresso visível — e retorno
                sem perda de dados.
              </li>
              <li>
                <strong>Revise.</strong> Antes de enviar, confira o resumo das suas respostas.
              </li>
              <li>
                <strong>Envie e pronto.</strong> Confirmação na hora. Depois do envio, não há como
                editar.
              </li>
            </ol>
          </div>
        </section>

        <section className="section" id="faq" aria-labelledby="faq-t">
          <div className="container-wide">
            <h2 id="faq-t" className="section-title">
              Perguntas <span className="serif">frequentes</span>
            </h2>
            <details className="faq">
              <summary>Quem pode participar?</summary>
              <p>Estudantes regularmente matriculados em uma instituição de ensino.</p>
            </details>
            <details className="faq">
              <summary>Quanto tempo leva?</summary>
              <p>
                Aproximadamente 3 a 5 minutos. O questionário mostra seu progresso em todas as
                etapas.
              </p>
            </details>
            <details className="faq">
              <summary>Posso parar no meio?</summary>
              <p>
                Sim. A participação é voluntária do início ao fim — basta fechar a página. Nada é
                registrado até você clicar em “Enviar respostas”.
              </p>
            </details>
            <details className="faq">
              <summary>Preciso criar conta ou informar e-mail?</summary>
              <p>
                Não. Não há cadastro, login nem qualquer dado de contato. A pesquisa é anônima por
                desenho.
              </p>
            </details>
            <details className="faq">
              <summary>O que acontece com as minhas respostas?</summary>
              <p>
                Elas são armazenadas de forma estruturada e analisadas em conjunto com as demais
                respostas. Pesquisadores autorizados veem apenas dados agregados e anonimizados.
              </p>
            </details>
          </div>
        </section>

        <section className="cta-final" aria-label="Começar">
          <div className="container-wide">
            <h2 className="section-title">
              Pronto para <span className="serif">começar?</span>
            </h2>
            <p>
              Ao iniciar, você verá primeiro o termo de consentimento — leia com calma antes de
              aceitar.
            </p>
            <Link className="btn btn-primary" to="/pesquisa">
              Iniciar pesquisa <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container-wide">
          <div className="footer-grid">
            <div>
              <Link className="brand" to="/" aria-label="Início">
                <span className="brand-mark" aria-hidden="true" />
                <span>Pesquisa</span>
              </Link>
            </div>
            <nav aria-label="A pesquisa">
              <strong>A pesquisa</strong>
              <a href="#dimensoes">O que investiga</a>
              <a href="#como-funciona">Como funciona</a>
              <a href="#faq">FAQ</a>
            </nav>
            <nav aria-label="Participar">
              <strong>Participar</strong>
              <Link to="/pesquisa">Apresentação</Link>
              <Link to="/pesquisa/consentimento">Consentimento</Link>
              <Link to="/sair">Sair</Link>
            </nav>
          </div>
          <div className="footer-base">
            <span>Pesquisa acadêmica sobre hábitos digitais de estudantes.</span>
            <span>Respostas anônimas, análise agregada.</span>
            <Link className="discreet" to="/admin/login">
              Acesso restrito
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
