import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkin.html',
  styleUrl: './checkin.scss'
})
export class Checkin {
  humor = 3;
  emocaoPrincipal = 'Calma';
  observacao = '';
  salvando = false;
  sucesso = false;

  emocoes = ['Ansiedade', 'Tristeza', 'Alegria', 'Raiva', 'Calma', 'Medo', 'Outra'];

  constructor(
    private service: PacienteService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  selecionarHumor(valor: number) {
    this.humor = valor;
  }

  selecionarEmocao(emocao: string) {
    this.emocaoPrincipal = emocao;
  }

  salvarCheckin() {
    this.salvando = true;
    this.cdr.detectChanges();
    const obs = this.observacao.trim() === '' ? null : this.observacao.trim();
    
    this.service.criarCheckin(this.humor, 5, this.emocaoPrincipal, obs).subscribe({
      next: () => {
        this.salvando = false;
        this.sucesso = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/paciente/home']);
        }, 1500);
      },
      error: (err) => {
        this.salvando = false;
        this.cdr.detectChanges();
        alert('Erro ao salvar check-in: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }
}
