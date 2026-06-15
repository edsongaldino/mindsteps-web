import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppDataService } from '../../../core/services/app-data.service';

@Component({
  selector: 'app-psicologo-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.scss'
})
export class PsicologoRelatorios implements OnInit {
  pacientes: any[] = [];
  selectedPacienteId: string = '';
  loading: boolean = true;
  activeSubTab: string = 'visao'; // 'visao', 'engajamento', 'emocoes', 'habilidades', 'atividades'

  dashboard: any = null;

  // Plano e bloqueios
  psicologoPlano: string = 'Starter';
  isIaLocked: boolean = true;
  iaInsights: string[] = [];
  loadingIaInsights: boolean = false;
  iaInsightsError: string = '';

  // Insights genéricos para o fallback mock
  insights = [
    { texto: 'Melhora de 15% no controle inibitório após o treino com Mestre Mandou.', tipo: 'positive' },
    { texto: 'Dificuldade observada em lidar com frustração em universos paralelos (jogo).', tipo: 'warning' },
    { texto: 'Excelente hábito de check-ins emocionais registrado consecutivamente.', tipo: 'positive' }
  ];

  constructor(private dataService: AppDataService, private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loading = true;
      this.dataService.getMe().subscribe({
        next: (me) => {
          this.psicologoPlano = me.plano || 'Starter';
          const p = this.psicologoPlano.toLowerCase();
          this.isIaLocked = p !== 'profissional' && p !== 'clinica';

          const psicologoId = me.psicologoId || '';
          if (psicologoId) {
            this.dataService.getPacientesPorPsicologo(psicologoId).subscribe({
              next: (pats) => {
                this.pacientes = pats;
                if (this.pacientes.length > 0) {
                  this.selectedPacienteId = this.pacientes[0].id;
                  this.carregarDashboard(this.selectedPacienteId);
                  if (!this.isIaLocked) {
                    this.carregarInsightsIa(this.selectedPacienteId);
                  }
                } else {
                  this.loading = false;
                }
              },
              error: () => {
                this.carregarFallbackPacientes();
              }
            });
          } else {
            this.loading = false;
          }
        },
        error: () => {
          this.psicologoPlano = 'Starter';
          this.isIaLocked = true;
          this.carregarFallbackPacientes();
        }
      });
    } else {
      this.loading = false;
    }
  }

  carregarFallbackPacientes() {
    this.pacientes = [
      { id: '847c5798-8265-4e73-8f74-a199da5cb8cc', nome: 'Lucas Oliveira' },
      { id: '2', nome: 'Maria Eduarda' }
    ];
    this.selectedPacienteId = this.pacientes[0].id;
    this.carregarDashboard(this.selectedPacienteId);
  }

  carregarDashboard(pacienteId: string) {
    this.loading = true;
    this.dataService.getDashboardPaciente(pacienteId).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  carregarInsightsIa(pacienteId: string) {
    this.loadingIaInsights = true;
    this.iaInsightsError = '';
    this.iaInsights = [];
    this.dataService.getIaInsights(pacienteId).subscribe({
      next: (res) => {
        this.iaInsights = res;
        this.loadingIaInsights = false;
      },
      error: (err) => {
        this.loadingIaInsights = false;
        this.iaInsightsError = err.error?.message || 'Erro ao carregar insights da IA.';
      }
    });
  }

  onPacienteChange() {
    if (this.selectedPacienteId) {
      this.carregarDashboard(this.selectedPacienteId);
      if (!this.isIaLocked) {
        this.carregarInsightsIa(this.selectedPacienteId);
      }
    }
  }

  irParaPlanos() {
    this.router.navigate(['/registrar'], { queryParams: { upgrade: 'true' } });
  }

  mudarSubTab(tabName: string) {
    this.activeSubTab = tabName;
  }
}
