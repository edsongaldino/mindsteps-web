import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  ambiente: string = 'Psicologo'; // 'Psicologo' ou 'Administrador'
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(private auth : Auth, private router: Router) {}

  login() {
    this.isSubmitting = true;
    this.errorMessage = '';

    this.auth.login(this.email, this.senha).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        
        // Validação se o perfil do usuário logado é o selecionado
        const perfilUsuario = response.perfil; // 'Administrador' ou 'Psicologo'
        
        if (perfilUsuario !== this.ambiente) {
          this.errorMessage = `Este usuário não possui permissão para acessar o Portal do ${this.ambiente === 'Administrador' ? 'Administrador' : 'Psicólogo'}.`;
          this.auth.logout();
          return;
        }

        // Salva os dados no localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userProfile', response.perfil);
        localStorage.setItem('userNome', response.nome);
        localStorage.setItem('userEmail', response.email);
        localStorage.setItem('userFotoUrl', response.fotoUrl || '');
        
        // Redireciona com base no papel
        if (perfilUsuario === 'Administrador') {
          this.router.navigate(['/dashboard/admin/resumo']);
        } else {
          this.router.navigate(['/dashboard/psicologo/resumo']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Falha ao autenticar. Verifique suas credenciais.';
        console.error(err);
      }
    });
  }

  voltarHome() {
    this.router.navigate(['/']);
  }
}

