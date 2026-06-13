import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../../../core/services/app-data.service';

@Component({
  selector: 'app-admin-resumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo.html',
  styleUrl: './resumo.scss'
})
export class AdminResumo implements OnInit {
  stats: any = {
    psicologosAtivos: 532,
    psicologosTendencia: '+15%',
    pacientesAtivos: 2845,
    pacientesTendencia: '+21%',
    atividadesRealizadas: 24531,
    atividadesTendencia: '+32%',
    engajamentoMedio: 76,
    engajamentoTendencia: '+6%',
    psicologosPendentes: 0
  };

  loading: boolean = true;

  // Atividades populares
  atividadesPopulares = [
    { nome: 'Semáforo das Emoções', usos: '3.882 utilizações', cor: '#4c35bd' },
    { nome: 'Cartas Sabotadores', usos: '2.943 utilizações', cor: '#0eb594' },
    { nome: 'Mestre Mandou', usos: '2.531 utilizações', cor: '#2563eb' }
  ];

  // Engajamento por faixa etária
  faixaEtaria = [
    { faixa: '10-12 anos', engajamento: 68 },
    { faixa: '13-15 anos', engajamento: 78 },
    { faixa: '16-18 anos', engajamento: 82 }
  ];

  constructor(private dataService: AppDataService) {}

  ngOnInit(): void {
    this.dataService.getAdminStats().subscribe({
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
