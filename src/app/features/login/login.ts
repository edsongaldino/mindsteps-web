import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email: string = '';
  senha: string = '';
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private auth : Auth, private router: Router, private cdr: ChangeDetectorRef) {}

  login() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.auth.login(this.email, this.senha).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        
        const perfilUsuario = response.perfil; // 'Administrador', 'Psicologo' ou 'Paciente'

        // Salva os dados no localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userProfile', response.perfil);
        localStorage.setItem('userNome', response.nome);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userFotoUrl', response.fotoUrl || '');
        
        this.cdr.markForCheck();

        // Redireciona com base no papel
        if (perfilUsuario === 'Administrador') {
          this.router.navigate(['/dashboard/admin/resumo']);
        } else if (perfilUsuario === 'Psicologo') {
          this.router.navigate(['/dashboard/psicologo/resumo']);
        } else if (perfilUsuario === 'Paciente') {
          this.router.navigate(['/paciente/home']);
        } else {
          this.errorMessage = 'Perfil de usuário não reconhecido.';
          this.auth.logout();
          this.cdr.markForCheck();
        }
      },

      error: (err) => {
        this.isSubmitting = false;
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = err.error?.message || 'Falha ao autenticar. Verifique suas credenciais.';
        }
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  voltarHome() {
    this.router.navigate(['/']);
  }
}
