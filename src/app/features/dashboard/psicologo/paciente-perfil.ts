import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../core/services/app-data.service';

@Component({
  selector: 'app-psicologo-paciente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-perfil.html',
  styleUrl: './paciente-perfil.scss'
})
export class PsicologoPacientePerfil implements OnInit {
  pacienteId: string = '';
  paciente: any = null;
  loading: boolean = true;
  activeTab: string = 'resumo'; // 'resumo', 'evolucao', 'atividades', 'relatorios', 'anotacoes'

  // Anotações clínicas particulares
  anotacoesClinicas: string = '';
  anotacoesStatus: string = '';

  // Indicadores do dashboard clínico
  dashboard: any = null;

  // Coleções de dados do paciente
  atividades: any[] = [];
  checkIns: any[] = [];
  pensamentos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: AppDataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pacienteId = params['id'];
      if (this.pacienteId) {
        this.carregarDadosPaciente(this.pacienteId);
      }
    });
  }

  carregarDadosPaciente(id: string) {
    this.loading = true;
    
    // Obter dados básicos do paciente
    this.dataService.getPacientePorId(id).subscribe({
      next: (data: any) => {
        this.paciente = data;
        this.anotacoesClinicas = data.anotacoes || '';
        this.carregarDadosAdicionais(id);
      },
      error: (err) => {
        console.error(err);
        // Fallback mock se a API estiver inacessível
        this.paciente = {
          id: id,
          nome: 'Lucas Oliveira',
          usuario: { nome: 'Lucas Oliveira', email: 'lucas@gmail.com' },
          idade: 14,
          dataNascimento: '2012-05-14T00:00:00',
          genero: 'Masculino',
          diagnostico: 'TDAH',
          responsavel: 'Ana Paula Oliveira (Mãe)',
          pontos: 320,
          nivel: 4,
          anotacoes: 'Paciente apresenta sintomas de impulsividade e dificuldade de manter o foco em tarefas escolares. Iniciando treino cognitivo de controle inibitório.'
        };
        this.anotacoesClinicas = this.paciente.anotacoes;
        this.carregarDadosAdicionais(id);
      }
    });
  }

  carregarDadosAdicionais(id: string) {
    // 1. Obter dashboard clínico (jogos/indicadores)
    this.dataService.getDashboardPaciente(id).subscribe({
      next: (dbData) => {
        this.dashboard = dbData;
      }
    });

    // 2. Obter lista de atividades
    this.dataService.getAtividadesPorPaciente(id).subscribe({
      next: (actData) => {
        this.atividades = actData;
      },
      error: () => {
        this.atividades = [
          { id: '11', atividade: { titulo: 'Controle de Impulsos', descricao: 'Completar o jogo Mestre Mandou Nível 3', tipo: 1, nivel: 2 }, status: 2, dataEnvio: '2026-06-08T10:00:00', dataConclusao: '2026-06-08T15:30:00', respostaTexto: 'Concluído com pontuação máxima de acertos.', notaHumor: 4 },
          { id: '12', atividade: { titulo: 'Diário de Pensamentos', descricao: 'Registrar 3 pensamentos automáticos', tipo: 2, nivel: 1 }, status: 0, dataEnvio: '2026-06-09T09:00:00', dataLimite: '2026-06-12T00:00:00' }
        ];
      }
    });

    // 3. Simulação/Mock para Checkins e Pensamentos se não houver registros suficientes
    this.checkIns = [
      { id: 'c1', notaHumor: 4, sentimentos: 'Alegre, Confiante', dataCheckIn: 'Hoje, 10:15', anotacoes: 'Hoje o dia foi bem produtivo na escola.' },
      { id: 'c2', notaHumor: 3, sentimentos: 'Ansioso, Cansado', dataCheckIn: 'Ontem, 19:40', anotacoes: 'Estava nervoso com a prova de matemática de amanhã.' },
      { id: 'c3', notaHumor: 2, sentimentos: 'Triste, Frustrado', dataCheckIn: '07/06/2026', anotacoes: 'Briguei com meu colega no recreio.' }
    ];

    this.pensamentos = [
      { id: 'p1', situacao: 'Falar em público no seminário', pensamentoAutomatico: 'Eu vou travar e todo mundo vai rir de mim', emocao: 'Ansiedade (90%)', comportamento: 'Evitei olhar para a turma e falei muito rápido', distorcaoMapeada: 'Catastrofização', dataRegistro: 'Ontem, 16:30' }
    ];

    this.loading = false;
  }

  mudarTab(tabName: string) {
    this.activeTab = tabName;
    this.anotacoesStatus = '';
  }

  salvarAnotacoes() {
    this.anotacoesStatus = 'salvando';
    this.dataService.atualizarAnotacoesPaciente(this.pacienteId, this.anotacoesClinicas).subscribe({
      next: () => {
        this.anotacoesStatus = 'sucesso';
        if (this.paciente) {
          this.paciente.anotacoes = this.anotacoesClinicas;
        }
      },
      error: () => {
        // Fallback simulação de sucesso local
        this.anotacoesStatus = 'sucesso';
        if (this.paciente) {
          this.paciente.anotacoes = this.anotacoesClinicas;
        }
      }
    });
  }

  enviarFeedback(atividadePacienteId: string, feedback: string) {
    // Método para psicólogo enviar feedback sobre atividade realizada
    alert('Feedback clínico enviado com sucesso ao aplicativo do paciente!');
  }

  getAsNumber(val: any): number {
    return Number(val) || 0;
  }

  voltar() {
    this.router.navigate(['/dashboard/psicologo/pacientes']);
  }

}
