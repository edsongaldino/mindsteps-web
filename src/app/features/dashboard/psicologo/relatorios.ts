import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  // Insights gerados
  insights = [
    { texto: 'Melhora de 15% no controle inibitório após o treino com Mestre Mandou.', tipo: 'positive' },
    { texto: 'Dificuldade observada em lidar com frustração em universos paralelos (jogo).', tipo: 'warning' },
    { texto: 'Excelente hábito de check-ins emocionais registrado consecutivamente.', tipo: 'positive' }
  ];

  constructor(private dataService: AppDataService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const psicologoId = localStorage.getItem('psicologoId') || '';
      
      this.dataService.getPacientesPorPsicologo(psicologoId).subscribe({
        next: (pats) => {
          this.pacientes = pats;
          if (this.pacientes.length > 0) {
            this.selectedPacienteId = this.pacientes[0].id;
            this.carregarDashboard(this.selectedPacienteId);
          } else {
            this.loading = false;
          }
        },
        error: () => {
          // Fallback mock patients list
          this.pacientes = [
            { id: '847c5798-8265-4e73-8f74-a199da5cb8cc', nome: 'Lucas Oliveira' },
            { id: '2', nome: 'Maria Eduarda' }
          ];
          this.selectedPacienteId = this.pacientes[0].id;
          this.carregarDashboard(this.selectedPacienteId);
        }
      });
    } else {
      this.loading = false;
    }
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

  onPacienteChange() {
    if (this.selectedPacienteId) {
      this.carregarDashboard(this.selectedPacienteId);
    }
  }

  mudarSubTab(tabName: string) {
    this.activeSubTab = tabName;
  }
}
