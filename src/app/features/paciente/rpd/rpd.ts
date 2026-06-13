import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-rpd',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './rpd.html',
  styleUrl: './rpd.scss'
})
export class Rpd {
  etapa = 1;

  // Step 1 Fields
  situacao = '';
  pensamentoAutomatico = '';
  emocao = '';
  intensidadeEmocao = 5;

  // Step 2 Fields
  evidenciasAFavor = '';
  evidenciasContra = '';
  pensamentoAlternativo = '';
  intensidadeFinal = 5;

  salvando = false;
  sucesso = false;

  constructor(
    private service: PacienteService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  podeAvancarEtapa1(): boolean {
    return this.situacao.trim() !== '' && 
           this.pensamentoAutomatico.trim() !== '' && 
           this.emocao.trim() !== '';
  }

  podeSalvar(): boolean {
    return this.evidenciasAFavor.trim() !== '' && 
           this.evidenciasContra.trim() !== '' && 
           this.pensamentoAlternativo.trim() !== '';
  }

  avancar() {
    if (this.podeAvancarEtapa1()) {
      this.etapa = 2;
      this.cdr.detectChanges();
    }
  }

  voltar() {
    this.etapa = 1;
    this.cdr.detectChanges();
  }

  salvarRegistro() {
    if (!this.podeSalvar()) return;
    this.salvando = true;
    this.cdr.detectChanges();

    const dados = {
      situacao: this.situacao.trim(),
      pensamentoAutomatico: this.pensamentoAutomatico.trim(),
      emocao: this.emocao.trim(),
      intensidadeEmocao: Math.round(this.intensidadeEmocao),
      evidenciasAFavor: this.evidenciasAFavor.trim(),
      evidenciasContra: this.evidenciasContra.trim(),
      pensamentoAlternativo: this.pensamentoAlternativo.trim(),
      intensidadeFinal: Math.round(this.intensidadeFinal)
    };

    this.service.criarRegistroPensamento(dados).subscribe({
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
        alert('Erro ao salvar registro de pensamento: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }
}
