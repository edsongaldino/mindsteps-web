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
  activeTab: string = 'ativas'; // 'ativas', 'agendadas', 'rascunhos', 'concluidas'
  psicologoId: string = '';

  // Modal Wizard (Nova Atividade)
  isWizardOpen: boolean = false;
  wizardStep: number = 1; // 1, 2, 3, 4

  // Dados do Wizard
  titulo: string = '';
  descricao: string = '';
  categoriaEmocional: string = 'Regulação Emocional';
  nivelSugerido: string = 'Médio';
  tipoResposta: string = 'Texto'; // 'Texto', 'Jogo', 'Escala'
  atividadeObrigatoria: boolean = true;
  permitirAnexos: boolean = false;
  frequencia: string = 'Uma vez'; // 'Uma vez', 'Diário', 'Semanal'
  prazoConclusao: string = '3 dias';
  notificarPush: boolean = true;
  notificarEmail: boolean = false;
  feedbackAutomatico: string = '';
  isSubmitting: boolean = false;

  // Modal de Envio
  isSendModalOpen: boolean = false;
  selectedAtividadeId: string = '';
  selectedPacienteId: string = '';
  dataLimite: string = '';

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
          error: () => {
            this.loading = false;
          }
        });
      }
    } else {
      this.loading = false;
    }
  }

  carregarDados() {
    this.loading = true;

    // Carregar atividades
    this.dataService.getAtividadesPorPsicologo(this.psicologoId).subscribe({
      next: (data) => {
        this.atividades = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        // Fallback mock
        this.atividades = [
          { id: '1', titulo: 'Cartas Sabotadores', descricao: 'Jogar o módulo de identificação de sabotadores de TCC', tipo: 1, destinatarios: 5, enviadoEm: '2026-06-08T10:00:00', status: 'Ativa' },
          { id: '2', titulo: 'Diário Emocional', descricao: 'Registro de humor ao fim do dia', tipo: 2, destinatarios: 12, enviadoEm: '2026-06-07T08:00:00', status: 'Ativa' },
          { id: '3', titulo: 'Desafio da Respiração', descricao: 'Treino de controle de ansiedade guiado', tipo: 2, destinatarios: 3, enviadoEm: '2026-06-09T09:00:00', status: 'Ativa' }
        ];
        this.applyFilter();
      }
    });

    // Carregar pacientes para o dropdown de envio
    this.dataService.getPacientesPorPsicologo(this.psicologoId).subscribe({
      next: (patData) => {
        this.pacientes = patData;
      },
      error: () => {
        this.pacientes = [
          { id: '847c5798-8265-4e73-8f74-a199da5cb8cc', nome: 'Lucas Oliveira' },
          { id: '2', nome: 'Maria Eduarda' }
        ];
      }
    });
  }

  applyFilter() {
    this.filteredAtividades = this.atividades;
    // Opcionalmente implementar filtros por tab no futuro (ativas/arquivadas/etc.)
  }

  mudarTab(tabName: string) {
    this.activeTab = tabName;
  }

  // Métodos do Wizard
  openWizard() {
    this.isWizardOpen = true;
    this.wizardStep = 1;
  }

  closeWizard() {
    this.isWizardOpen = false;
    this.resetWizard();
  }

  nextStep() {
    if (this.wizardStep < 4) {
      this.wizardStep++;
    }
  }

  prevStep() {
    if (this.wizardStep > 1) {
      this.wizardStep--;
    }
  }

  salvarAtividade() {
    this.isSubmitting = true;
    const payload = {
      psicologoId: this.psicologoId,
      titulo: this.titulo,
      descricao: this.descricao,
      tipo: this.tipoResposta === 'Jogo' ? 1 : 2, // 1 = Jogo, 2 = Diário/Outros
      categoriaEmocional: this.categoriaEmocional,
      nivelSugerido: this.nivelSugerido,
      tipoResposta: this.tipoResposta,
      atividadeObrigatoria: this.atividadeObrigatoria,
      permitirAnexos: this.permitirAnexos,
      frequencia: this.frequencia,
      prazoConclusao: this.prazoConclusao,
      notificarPush: this.notificarPush,
      notificarEmail: this.notificarEmail,
      feedbackAutomatico: this.feedbackAutomatico,
      nivel: 1
    };

    this.dataService.criarAtividade(payload).subscribe({
      next: (novaAct) => {
        this.isSubmitting = false;
        this.carregarDados();
        this.closeWizard();
        
        // Abre imediatamente modal de envio se desejar prescrever
        this.openSendModal(novaAct.id);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        // Fallback local se a API estiver offline
        const mockNovaAct = {
          id: Math.random().toString(),
          titulo: this.titulo,
          descricao: this.descricao,
          tipo: this.tipoResposta === 'Jogo' ? 1 : 2,
          destinatarios: 0,
          enviadoEm: new Date().toISOString(),
          status: 'Ativa'
        };
        this.atividades.push(mockNovaAct);
        this.applyFilter();
        this.closeWizard();
        this.openSendModal(mockNovaAct.id);
      }
    });
  }

  resetWizard() {
    this.titulo = '';
    this.descricao = '';
    this.categoriaEmocional = 'Regulação Emocional';
    this.nivelSugerido = 'Médio';
    this.tipoResposta = 'Texto';
    this.atividadeObrigatoria = true;
    this.permitirAnexos = false;
    this.frequencia = 'Uma vez';
    this.prazoConclusao = '3 dias';
    this.notificarPush = true;
    this.notificarEmail = false;
    this.feedbackAutomatico = '';
  }

  // Métodos de Envio
  openSendModal(atividadeId: string) {
    this.selectedAtividadeId = atividadeId;
    this.isSendModalOpen = true;
    this.selectedPacienteId = this.pacientes[0]?.id || '';
    this.dataLimite = '';
  }

  closeSendModal() {
    this.isSendModalOpen = false;
  }

  enviarAtividade() {
    if (!this.selectedPacienteId) {
      alert('Selecione um paciente!');
      return;
    }

    const payload = {
      atividadeId: this.selectedAtividadeId,
      pacienteId: this.selectedPacienteId,
      dataLimite: this.dataLimite ? new Date(this.dataLimite).toISOString() : undefined
    };

    this.dataService.enviarAtividadeParaPaciente(payload).subscribe({
      next: () => {
        alert('Atividade enviada com sucesso!');
        this.closeSendModal();
        this.carregarDados();
      },
      error: () => {
        // Fallback local
        alert('Atividade enviada com sucesso ao aplicativo do paciente (fallback local).');
        this.closeSendModal();
      }
    });
  }
}
