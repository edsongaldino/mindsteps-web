import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-paciente-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-home.html',
  styleUrl: './paciente-home.scss'
})
export class PacienteHome implements OnInit {
  resumo: any = null;
  carregando = true;
  erroMsg = '';
  jaFezCheckinHoje = true;
  mostrarNotificacoes = false;

  constructor(
    private service: PacienteService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;
    this.cdr.detectChanges();
    this.service.obterResumoHome().subscribe({
      next: (data) => {
        this.resumo = data;
        this.carregando = false;
        this.cdr.detectChanges();
        
        // Check check-in status
        this.service.verificarCheckinHoje().subscribe(status => {
          this.jaFezCheckinHoje = status;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.erroMsg = 'Erro ao carregar dados do painel.';
        this.carregando = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  obterProgressoNivel(): number {
    if (!this.resumo) return 0;
    return (this.resumo.pontos % 100) / 100.0;
  }

  obterPontosRestantes(): number {
    if (!this.resumo) return 100;
    return 100 - (this.resumo.pontos % 100);
  }

  marcarMensagemLida() {
    if (this.resumo?.mensagemMotivacional?.id) {
      this.service.marcarMensagemComoLida(this.resumo.mensagemMotivacional.id).subscribe({
        next: () => {
          this.carregarDados();
        },
        error: (err) => console.error(err)
      });
    }
  }

  toggleNotificacoes() {
    this.mostrarNotificacoes = !this.mostrarNotificacoes;
  }

  tratarNotificacao(item: any) {
    this.mostrarNotificacoes = false;
    if (item.tipo === 'message') {
      this.service.marcarMensagemComoLida(item.id).subscribe({
        next: () => this.carregarDados(),
        error: (err) => console.error(err)
      });
    } else {
      // Ir para atividades
      this.router.navigate(['/paciente/atividades']);
    }
  }
}
