import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-politica-privacidade',
  standalone: true,
  template: `
    <div class="privacy-container">
      <header class="header">
        <div class="nav-container">
          <a class="brand" (click)="voltarHome()">
            <img src="/logo.png" alt="MindSteps" />
          </a>
          <button class="btn btn-outline" (click)="voltarHome()">← Voltar ao Início</button>
        </div>
      </header>

      <main class="content">
        <h1>Política de Privacidade</h1>
        <p class="updated">Última atualização: 23 de Junho de 2026</p>

        <section>
          <h2>1. Introdução</h2>
          <p>O MindSteps está comprometido em proteger a privacidade dos seus usuários. Esta Política de Privacidade explica como coletamos, usamos, armazenamos, tratamos e protegemos as informações pessoais de psicólogos e pacientes em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
        </section>

        <section>
          <h2>2. Coleta de Informações</h2>
          <p>Coletamos os seguintes tipos de informações para viabilizar o acompanhamento terapêutico e prestação dos serviços:</p>
          <ul>
            <li><strong>Para Psicólogos:</strong> Nome completo, e-mail profissional, número de registro CRP (Conselho Regional de Psicologia), telefone e senha.</li>
            <li><strong>Para Pacientes:</strong> Nome, data de nascimento, gênero, registros de humor diário, respostas a atividades terapêuticas prescritas pelo psicólogo e histórico de pontuação de gamificação.</li>
            <li><strong>Dados Clínicos:</strong> O MindSteps funciona como operador de dados inseridos pelos psicólogos (controladores), tais como registros de pensamentos automáticos (RPD), check-ins emocionais e evolução.</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalidade do Tratamento de Dados</h2>
          <p>Os dados tratados na plataforma destinam-se única e exclusivamente às seguintes finalidades:</p>
          <ul>
            <li>Viabilizar a comunicação e o acompanhamento terapêutico entre o psicólogo e seu respectivo paciente;</li>
            <li>Identificar a regularidade do registro profissional do psicólogo (CRP) para segurança da plataforma e dos pacientes;</li>
            <li>Gerar gráficos de evolução emocional e adesão terapêutica visíveis apenas ao profissional responsável;</li>
            <li>Melhorar as mecânicas dos jogos educativos e fornecer a experiência de gamificação ao paciente.</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartilhamento e Confidencialidade</h2>
          <p>O MindSteps preza pelo sigilo absoluto das informações terapêuticas. <strong>Não vendemos, não compartilhamos e não comercializamos dados pessoais de psicólogos ou pacientes com terceiros.</strong></p>
          <p>Os dados inseridos pelo paciente são de acesso restrito ao próprio paciente e ao seu psicólogo vinculado. A equipe administrativa do MindSteps não acessa conteúdos das sessões ou respostas individuais das atividades, exceto se expressamente solicitado pelo profissional responsável para fins de suporte técnico e mediante controle rígido de segurança.</p>
        </section>

        <section>
          <h2>5. Segurança das Informações</h2>
          <p>Adotamos medidas técnicas e administrativas rigorosas de segurança da informação para proteger os dados pessoais contra acessos não autorizados, perda, destruição ou alteração desautorizada. Isso inclui:</p>
          <ul>
            <li>Uso de criptografia SSL/TLS em todas as comunicações e requisições à API;</li>
            <li>Criptografia de senhas utilizando hash seguro (BCrypt);</li>
            <li>Hospedagem em servidores com controles de acesso restritos e redundância.</li>
          </ul>
        </section>

        <section>
          <h2>6. Direitos dos Titulares dos Dados</h2>
          <p>Em consonância com a LGPD, os usuários (psicólogos e pacientes) possuem os seguintes direitos a qualquer momento:</p>
          <ul>
            <li>Confirmação da existência do tratamento e acesso aos dados pessoais armazenados;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Eliminação dos dados pessoais tratados mediante exclusão da conta pelo próprio usuário ou solicitação formal.</li>
          </ul>
        </section>

        <section>
          <h2>7. Alterações a Esta Política</h2>
          <p>Podemos atualizar esta Política de Privacidade periodicamente. Avisaremos sobre quaisquer alterações postando a nova versão nesta página com a respectiva data de atualização.</p>
        </section>

        <section>
          <h2>8. Fale Conosco</h2>
          <p>Se você tiver alguma dúvida sobre esta Política de Privacidade ou sobre o tratamento de dados no MindSteps, entre em contato através do e-mail: <strong>privacidade&#64;mindsteps.com.br</strong>.</p>
        </section>
      </main>

      <footer class="footer">
        <div class="copyright">🔒 Seguro e em conformidade com a LGPD • © 2026 MindSteps.</div>
      </footer>
    </div>
  `,
  styles: [`
    .privacy-container {
      font-family: 'Inter', sans-serif;
      color: #1f2937;
      background-color: #f9fafb;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand img {
      height: 36px;
      cursor: pointer;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-outline {
      border: 1px solid #d1d5db;
      background: transparent;
      color: #374151;
    }
    .btn-outline:hover {
      background: #f3f4f6;
    }
    .content {
      max-width: 900px;
      margin: 2.5rem auto;
      padding: 0 2rem;
      flex-grow: 1;
    }
    h1 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #111827;
      margin-bottom: 0.5rem;
    }
    .updated {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 2.5rem;
    }
    section {
      margin-bottom: 2rem;
    }
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.75rem;
    }
    p, li {
      font-size: 1rem;
      line-height: 1.625;
      color: #4b5563;
    }
    ul {
      margin-top: 0.5rem;
      padding-left: 1.5rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    .footer {
      background-color: #ffffff;
      border-top: 1px solid #e5e7eb;
      padding: 1.5rem 2rem;
      text-align: center;
    }
    .copyright {
      color: #6b7280;
      font-size: 0.875rem;
    }
  `]
})
export class PoliticaPrivacidade {
  constructor(private router: Router) {}

  voltarHome() {
    this.router.navigate(['/']);
  }
}
