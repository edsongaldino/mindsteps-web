import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-recuperar-senha',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-senha.html',
  styleUrl: './recuperar-senha.scss'
})
export class RecuperarSenha {
  etapa: number = 1;

  email: string = '';
  codigo: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';

  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private auth: Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  solicitarRecuperacao() {
    if (!this.email) {
      this.errorMessage = 'Por favor, insira seu e-mail.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    this.auth.recuperarSenha(this.email).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.etapa = 2; // Avança para a etapa de validação de código
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || err.error || 'Erro ao enviar código de recuperação. Verifique se o e-mail está correto.';
        this.cdr.markForCheck();
      }
    });
  }

  validarCodigo() {
    if (!this.codigo) {
      this.errorMessage = 'Por favor, insira o código recebido.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.auth.validarCodigoRecuperacao(this.email, this.codigo).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.etapa = 3; // Avança para redefinir a senha
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || err.error || 'Código inválido ou expirado.';
        this.cdr.markForCheck();
      }
    });
  }

  redefinirSenha() {
    if (!this.novaSenha || !this.confirmarSenha) {
      this.errorMessage = 'Por favor, preencha as duas senhas.';
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (this.novaSenha.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.auth.redefinirSenha(this.email, this.codigo, this.novaSenha).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Sua senha foi redefinida com sucesso!';
        this.cdr.markForCheck();
        
        // Aguarda 3 segundos e redireciona para o login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || err.error || 'Erro ao redefinir a senha.';
        this.cdr.markForCheck();
      }
    });
  }

  voltarParaLogin() {
    this.router.navigate(['/login']);
  }
}
