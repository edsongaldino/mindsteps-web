import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../../../core/services/app-data.service';

@Component({
  selector: 'app-psicologo-resumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo.html',
  styleUrl: './resumo.scss'
})
export class PsicologoResumo implements OnInit {
  stats = {
    pacientesAtivos: 28,
    pacientesTendencia: '+4 desde a semana passada',
    atividadesConcluidas: 142,
    atividadesTendencia: '+12 desde a semana passada',
    engajamentoMedio: 82,
    engajamentoTendencia: '+7% desde a semana passada',
    alertas: 5
  };

  loading: boolean = true;
  psicologoId: string = '';

  // Atividades recentes
  atividadesRecentes = [
    { paciente: 'Lucas Oliveira', atividade: 'Semáforo das Emoções', data: 'Hoje, 14:32', status: 'Concluído' },
    { paciente: 'Maria Eduarda', atividade: 'Cartas Sabotadores', data: 'Hoje, 11:10', status: 'Concluído' },
    { paciente: 'João Pedro', atividade: 'Mestre Mandou', data: 'Ontem, 18:45', status: 'Concluído' },
    { paciente: 'Ana Clara', atividade: 'Detetive da Memória', data: 'Ontem, 16:20', status: 'Concluído' }
  ];

  // Pacientes em atenção (menor engajamento)
  pacientesAlerta = [
    { nome: 'Pedro Silva', engajamento: 57, ultimaConexao: 'Há 7 dias', foto: '' },
    { nome: 'Beatriz Lima', engajamento: 61, ultimaConexao: 'Há 5 dias', foto: '' },
    { nome: 'Gabriel A.', engajamento: 63, ultimaConexao: 'Há 7 dias', foto: '' }
  ];

  constructor(private dataService: AppDataService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const userProfile = localStorage.getItem('userProfile');
      
      // Carregar os dados reais
      this.dataService.getMe().subscribe({
        next: (me) => {
          this.psicologoId = me.psicologoId;
          if (this.psicologoId) {
            this.carregarStats(this.psicologoId);
          } else {
            this.loading = false;
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  carregarStats(psicologoId: string) {
    this.dataService.getPsicologoStats(psicologoId).subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
