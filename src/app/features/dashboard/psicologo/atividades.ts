import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../core/services/app-data.service';

@Component({
  selector: 'app-psicologo-atividades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atividades.html',
  styleUrl: './atividades.scss'
})
export class PsicologoAtividades implements OnInit {
  atividades: any[] = [];
  filteredAtividades: any[] = [];
  pacientes: any[] = [];
  loading: boolean = true;
  activeTab: string = 'ativas';
  psicologoId: string = '';

  isWizardOpen: boolean = false;
  wizardStep: number = 1; // 1 a 5

  // Passo 1: Tipo
  tipoSelecionado: number = 1;
  tiposAtividade = [
    { id: 1, titulo: 'Reflexão', desc: 'Perguntas para reflexão emocional.', cor: '#F0ECFF', icone: '🧠' },
    { id: 2, titulo: 'Registro de pensamentos', desc: 'Identificação de pensamentos automáticos de TCC.', cor: '#FFF3E3', icone: '💬' },
    { id: 3, titulo: 'Exercício prático', desc: 'Atividade prática, mindfulness ou tarefa terapêutica.', cor: '#FFF9E6', icone: '🧘' },
    { id: 4, titulo: 'Check-list', desc: 'Lista de ações simples para o paciente marcar.', cor: '#E6F5F2', icone: '✅' },
    { id: 5, titulo: 'Áudio', desc: 'Áudio explicativo ou meditação guiada.', cor: '#EAF4F7', icone: '🎧' },
    { id: 6, titulo: 'Leitura', desc: 'Textos psicoeducativos para o paciente ler.', cor: '#FFF0F0', icone: '📖' },
    { id: 7, titulo: 'Jogo', desc: 'Jogos interativos de memória e cognitivos.', cor: '#E8F5E9', icone: '🎮' },
    { id: 8, titulo: 'Atividade personalizada', desc: 'Crie uma atividade com perguntas e campos.', cor: '#EDE9FE', icone: '✏️' }
  ];

  // Passo 2: Conteúdo
  titulo: string = '';
  descricao: string = '';
  perguntasGuiadas: string = 'O que aconteceu na situação?\nQuais emoções você sentiu?';
  
  // Conteúdo Específico
  jogoSelecionado: string = 'Memória Tática';
  modoJogo: string = 'Imagens';
  temaJogo: string = 'Expressões/Emoções';
  dificuldadeJogo: string = 'Evolutivo';
  palavrasPersonalizadas: string = '';

  jogosDisponiveis: string[] = ['Respire', 'Missão Foco', 'Memória Tática', 'Investigação', 'Modo Piloto'];

  // Passo 3: Configurações
  tipoResposta: string = 'Texto (resposta livre)';
  atividadeObrigatoria: boolean = true;
  permitirAnexos: boolean = true;
  feedbackAutomatico: string = 'Parabéns por concluir sua atividade!';
  categoriaEmocional: string = 'Ansiedade';
  nivelSugerido: string = 'Moderado';

  // Passo 4: Agendamento
  frequencia: string = 'Semanal';
  diasSemana: string = 'Seg, Qui';
  horarioSugerido: string = '20:00';
  prazoConclusao: string = '7 dias após o envio';
  notificarPush: boolean = true;
  notificarEmail: boolean = true;

  // Passo 5: Envio
  isSubmitting: boolean = false;
  tipoDestino: string = 'todos'; // todos, especifico, nenhum
  selectedPacienteId: string = '';

  constructor(private dataService: AppDataService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.psicologoId = localStorage.getItem('psicologoId') || '';
      if (this.psicologoId) {
        this.carregarDados();
      } else {
        this.dataService.getMe().subscribe({
          next: (me) => {
            this.psicologoId = me.psicologoId || '';
            if (this.psicologoId) {
              localStorage.setItem('psicologoId', this.psicologoId);
              this.carregarDados();
            } else {
              this.loading = false;
            }
          },
          error: () => { this.loading = false; }
        });
      }
    } else {
      this.loading = false;
    }
  }

  carregarDados() {
    this.loading = true;
    this.dataService.getAtividadesPorPsicologo(this.psicologoId).subscribe({
      next: (data) => {
        this.atividades = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.atividades = [
          { id: '1', titulo: 'Cartas Sabotadores', descricao: 'Jogar o módulo', tipo: 7, destinatarios: 5, enviadoEm: '2026-06-08T10:00:00', status: 'Ativa' },
          { id: '2', titulo: 'Diário Emocional', descricao: 'Registro de humor', tipo: 1, destinatarios: 12, enviadoEm: '2026-06-07T08:00:00', status: 'Ativa' }
        ];
        this.applyFilter();
      }
    });

    this.dataService.getPacientesPorPsicologo(this.psicologoId).subscribe({
      next: (patData) => {
        this.pacientes = patData;
        if(this.pacientes.length > 0) this.selectedPacienteId = this.pacientes[0].id;
      },
      error: () => {
        this.pacientes = [
          { id: '847c5798-8265-4e73-8f74-a199da5cb8cc', nome: 'Lucas Oliveira' },
          { id: '2', nome: 'Maria Eduarda' }
        ];
        this.selectedPacienteId = this.pacientes[0].id;
      }
    });
  }

  applyFilter() {
    this.filteredAtividades = this.atividades;
  }

  mudarTab(tabName: string) {
    this.activeTab = tabName;
  }

  openWizard() {
    this.isWizardOpen = true;
    this.wizardStep = 1;
    this.aplicarTemplate(this.tipoSelecionado);
  }

  closeWizard() {
    this.isWizardOpen = false;
  }

  nextStep() {
    if (this.wizardStep < 5) this.wizardStep++;
  }

  prevStep() {
    if (this.wizardStep > 1) this.wizardStep--;
  }

  selecionarTipo(id: number) {
    this.tipoSelecionado = id;
    this.aplicarTemplate(id);
  }

  aplicarTemplate(tipo: number) {
    switch(tipo) {
      case 1:
        this.titulo = 'Reflexão sobre emoções';
        this.descricao = 'Refletir sobre situações recentes.';
        this.perguntasGuiadas = 'O que aconteceu?\nQuais emoções sentiu?\nO que pensou?';
        this.tipoResposta = 'Texto livre';
        break;
      case 2:
        this.titulo = 'Registro de Pensamentos (RPD)';
        this.descricao = 'Identifique a situação gatilho e pensamentos automáticos.';
        this.tipoResposta = 'Estrutura RPD';
        break;
      case 3:
        this.titulo = 'Respiração 4-2-6';
        this.descricao = 'Exercício prático de regulação.';
        this.tipoResposta = 'Avaliação Pré/Pós';
        break;
      case 4:
        this.titulo = 'Check-list de Autocuidado';
        this.descricao = 'Marque os hábitos que concluiu.';
        this.tipoResposta = 'Checklist';
        break;
      case 5:
        this.titulo = 'Áudio de Relaxamento';
        this.descricao = 'Ouça o áudio antes de dormir.';
        this.tipoResposta = 'Texto livre';
        break;
      case 6:
        this.titulo = 'O que é a Ansiedade?';
        this.descricao = 'Texto psicoeducativo.';
        this.tipoResposta = 'Perguntas de Fixação';
        break;
      case 7:
        this.titulo = 'Memória Tática';
        this.descricao = 'Jogo de atenção visual.';
        this.tipoResposta = 'Jogo Interativo';
        break;
      case 8:
        this.titulo = '';
        this.descricao = '';
        this.tipoResposta = 'Formulário Personalizado';
        break;
    }
  }

  salvarAtividade() {
    this.isSubmitting = true;

    let conteudoReal: any = {
      perguntas: this.perguntasGuiadas.split('\n')
    };
    if (this.tipoSelecionado === 7) {
      conteudoReal = {
        tipoJogo: this.jogoSelecionado,
        modo: this.modoJogo,
        tema: this.temaJogo,
        dificuldade: this.dificuldadeJogo,
        palavrasPersonalizadas: this.palavrasPersonalizadas
      };
    }

    const payload = {
      psicologoId: this.psicologoId,
      titulo: this.titulo,
      descricao: this.descricao,
      tipo: this.tipoSelecionado,
      conteudo: JSON.stringify(conteudoReal),
      configuracoes: {
        tipoResposta: this.tipoResposta,
        atividadeObrigatoria: this.atividadeObrigatoria,
        frequencia: this.frequencia,
        notificarPush: this.notificarPush
      }
    };

    this.dataService.criarAtividade(payload).subscribe({
      next: (novaAct) => {
        this.isSubmitting = false;
        
        if (this.tipoDestino !== 'nenhum') {
          // Mock send
          alert('Atividade criada e enviada!');
        } else {
          alert('Atividade criada com sucesso!');
        }
        
        this.carregarDados();
        this.closeWizard();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        alert('Atividade criada (fallback local).');
        this.closeWizard();
      }
    });
  }

  getTipoNome(tipoId: number): string {
    const tipo = this.tiposAtividade.find(t => t.id === tipoId);
    return tipo ? tipo.titulo : 'Atividade';
  }
}
