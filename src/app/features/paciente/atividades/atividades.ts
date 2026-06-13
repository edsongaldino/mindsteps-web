import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-atividades',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './atividades.html',
  styleUrl: './atividades.scss'
})
export class Atividades implements OnInit {
  atividades: any[] = [];
  atividadesFiltradas: any[] = [];
  carregando = true;
  erroMsg = '';
  filtroAtual = 'todas'; // 'todas', 'pendentes', 'concluidas'

  constructor(
    private service: PacienteService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarAtividades();
  }

  carregarAtividades() {
    this.carregando = true;
    this.cdr.detectChanges();
    this.service.listarMinhasAtividades().subscribe({
      next: (data) => {
        this.atividades = data;
        this.aplicarFiltro();
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.erroMsg = 'Erro ao carregar lista de atividades.';
        this.carregando = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  estaConcluida(status: any): boolean {
    return this.service.estaConcluida(status);
  }

  obterStatusTexto(status: any): string {
    if (this.estaConcluida(status)) return 'Concluída';
    if (status === 1 || status?.toString() === '1' || status?.toString().toLowerCase() === 'pendente') return 'Pendente';
    if (status === 4 || status?.toString() === '4' || status?.toString().toLowerCase() === 'atrasada') return 'Atrasada';
    return 'Em andamento';
  }

  obterIconeAtividade(tipo: number, index: number): string {
    if (tipo === 7) return 'ti-device-gamepad-2'; // game
    const icones = [
      'ti-brain',
      'ti-shoe',
      'ti-heart-rate-monitor',
      'ti-sun',
      'ti-calendar-event'
    ];
    return icones[index % icones.length];
  }

  obterContagem(filtro: string): number {
    if (filtro === 'todas') return this.atividades.length;
    if (filtro === 'pendentes') return this.atividades.filter(x => !this.estaConcluida(x.status)).length;
    if (filtro === 'concluidas') return this.atividades.filter(x => this.estaConcluida(x.status)).length;
    return 0;
  }

  setFiltro(filtro: string) {
    this.filtroAtual = filtro;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.filtroAtual === 'todas') {
      this.atividadesFiltradas = this.atividades;
    } else if (this.filtroAtual === 'pendentes') {
      this.atividadesFiltradas = this.atividades.filter(x => !this.estaConcluida(x.status));
    } else if (this.filtroAtual === 'concluidas') {
      this.atividadesFiltradas = this.atividades.filter(x => this.estaConcluida(x.status));
    }
  }

  abrirAtividade(ativ: any) {
    if (this.estaConcluida(ativ.status)) return;
    this.router.navigate(['/paciente/atividades/responder', ativ.id]);
  }
}
