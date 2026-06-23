import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {
  isScrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  features = [
    {
      title: 'Diário Emocional',
      text: 'O paciente registra emoções, pensamentos e situações do dia de forma simples e guiada.',
      image: 'feature_diary.png',
      description: 'Um espaço seguro e estruturado para o paciente registrar o que sente, quando sente e quais foram os gatilhos, seguindo os princípios da Terapia Cognitivo-Comportamental (TCC).',
      benefits: [
        'Registro rápido de humor diário através de emojis interativos',
        'Identificação de gatilhos, pensamentos automáticos e distorções cognitivas',
        'Gráficos de oscilação de humor compartilhados diretamente com o psicólogo',
        'Exercícios breves de respiração guiada sugeridos automaticamente em momentos de ansiedade'
      ],
      color: '#4c35bd',
      class: 'purple'
    },
    {
      title: 'Jogos Terapêuticos',
      text: 'Atividades lúdicas para treinar funções executivas e habilidades socioemocionais.',
      image: 'feature_games.png',
      description: 'Jogos desenvolvidos especificamente para o público infantojuvenil, focados no treino de funções executivas essenciais (como controle inibitório e flexibilidade cognitiva) de forma totalmente lúdica.',
      benefits: [
        'Treino de Controle Inibitório e Flexibilidade Cognitiva com mecânicas divertidas',
        'Níveis de dificuldade adaptativos baseados no desempenho do próprio paciente',
        'Métricas detalhadas de tempo de reação, acertos e engajamento enviadas ao profissional',
        'Atividades cientificamente fundamentadas para reforçar o aprendizado além do consultório'
      ],
      color: '#0eb594',
      class: 'teal'
    },
    {
      title: 'Missões Terapêuticas',
      text: 'Crie ou personalize tarefas alinhadas aos objetivos do tratamento.',
      image: 'feature_missions.png',
      description: 'Leve as intervenções terapêuticas para o dia a dia do paciente. Prescreva atividades personalizadas, tarefas de exposição ou novos hábitos e acompanhe a execução em tempo real.',
      benefits: [
        'Biblioteca de missões prontas para ansiedade, depressão, TDAH e regulação emocional',
        'Criação de tarefas personalizadas com textos, links, imagens ou áudios do psicólogo',
        'Lembretes inteligentes e notificações diretamente no smartphone do paciente',
        'Sistema de gamificação com conquistas e medalhas para incentivar o engajamento contínuo'
      ],
      color: '#2563eb',
      class: 'blue'
    },
    {
      title: 'Indicadores Clínicos',
      text: 'Acompanhe evolução, padrões e avanços com relatórios visuais e objetivos.',
      image: 'feature_insights.png',
      description: 'Transforme o comportamento do paciente fora da clínica em dados acionáveis. Tenha acesso a relatórios e análises detalhadas para embasar suas tomadas de decisão clínica.',
      benefits: [
        'Relatórios completos de evolução clínica para impressão ou exportação em PDF',
        'Visualização gráfica de correlações entre humor, gatilhos e realização das atividades',
        'Alertas em tempo real em caso de quedas expressivas de humor ou inatividade',
        'Histórico centralizado completo para fundamentar laudos, relatórios e evolução do paciente'
      ],
      color: '#4c35bd',
      class: 'purple'
    }
  ];

  games = [
    { title: 'Semáforo das Emoções', subtitle: 'Regulação emocional', image: 'game_semaforo.png', uses: '1.250', engagement: '92%' },
    { title: 'Mestre Mandou', subtitle: 'Controle inibitório', image: 'game_mestre.png', uses: '987', engagement: '89%' },
    { title: 'Detetive da Memória', subtitle: 'Memória operacional', image: 'game_detetive.png', uses: '1.134', engagement: '90%' },
    { title: 'Mudança de Planos', subtitle: 'Flexibilidade cognitiva', image: 'game_mudanca.png', uses: '876', engagement: '88%' },
    { title: 'Foguete da Pausa', subtitle: 'Tomada de decisão', image: 'game_foguete.png', uses: '1.076', engagement: '91%' },
    { title: 'Tribunal dos Pensamentos', subtitle: 'Reestruturação cognitiva', image: 'game_tribunal.png', uses: '842', engagement: '87%' }
  ];

  plans = [
    {
      name: 'Starter',
      desc: 'Ideal para conhecer a plataforma e iniciar a digitalização.',
      price: '39,90',
      patients: 'Até 5 pacientes ativos',
      popular: false,
      cta: 'Começar teste grátis',
      trial: '7 dias grátis',
      features: ['Diário emocional', 'Jogos terapêuticos básicos', 'App para pacientes', 'Relatórios simples', 'Suporte por e-mail']
    },
    {
      name: 'Essencial',
      desc: 'Aqui está a maioria dos psicólogos autônomos.',
      price: '89',
      patients: 'Até 20 pacientes ativos',
      popular: true,
      cta: 'Começar teste grátis',
      trial: '7 dias grátis',
      features: ['Todos os jogos (completos)', 'Relatórios básicos', 'Painel de evolução', 'App para pacientes', 'Suporte prioritário']
    },
    {
      name: 'Profissional',
      desc: 'Para psicólogos que desejam acompanhar mais e melhor.',
      price: '149',
      patients: 'Pacientes ilimitados',
      popular: false,
      cta: 'Começar teste grátis',
      trial: '7 dias grátis',
      features: ['Pacientes ilimitados', 'Indicadores avançados', 'Exportação de relatórios em PDF', 'Relatórios e Insights gerados por IA', 'Suporte VIP']
    },
    {
      name: 'Clínica',
      desc: 'Para clínicas com múltiplos profissionais e demandas personalizadas.',
      price: 'Sob consulta',
      patients: 'Multi-profissionais',
      popular: false,
      cta: 'Solicitar demonstração',
      trial: '',
      features: ['Múltiplos profissionais', 'Gestão de equipe e permissões', 'Dashboard consolidado', 'Suporte dedicado', 'Integrações customizadas']
    }
  ];

  // Form fields for registration
  nome: string = '';
  email: string = '';
  senha: string = '';
  telefone: string = '';
  crp: string = '';
  bio: string = '';

  // Status flags
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  isRegisterModalOpen: boolean = false;
  isFeatureModalOpen: boolean = false;
  selectedFeature: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  openRegisterModal(plano?: string) {
    if (plano === 'Clínica') {
      this.isRegisterModalOpen = true;
    } else if (plano) {
      this.router.navigate(['/registrar'], { queryParams: { plano } });
    } else {
      this.router.navigate(['/registrar']);
    }
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  openFeatureModal(feature: any) {
    this.selectedFeature = feature;
    this.isFeatureModalOpen = true;
  }

  closeFeatureModal() {
    this.isFeatureModalOpen = false;
    this.selectedFeature = null;
  }

  register() {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      telefone: this.telefone,
      crp: this.crp,
      bio: this.bio
    };

    this.http.post(`${environment.apiUrl}/psicologos/registrar`, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Seu cadastro foi enviado com sucesso! Como a ativação depende de confirmação profissional, nossa equipe irá analisar seu CRP e enviar um e-mail de confirmação em breve.';
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Ocorreu um erro ao realizar o cadastro. Verifique os dados ou tente novamente mais tarde.';
        console.error(err);
      }
    });
  }

  resetForm() {
    this.nome = '';
    this.email = '';
    this.senha = '';
    this.telefone = '';
    this.crp = '';
    this.bio = '';
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
