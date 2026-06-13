import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Para navegação de rotas
import { FormsModule } from '@angular/forms'; 
import { Auth } from '../../core/services/auth';
import { HttpClient } from '@angular/common/http';
import { PacienteService } from '../../core/services/paciente.service';

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
  carregando = false;

  constructor(
    private http: HttpClient, 
    private auth : Auth, 
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  login() {
    this.carregando = true;
    this.errorMessage = '';
    
    this.auth.login(this.email, this.senha).subscribe({
      next: (response) => {
        // Salva o token no localStorage
        localStorage.setItem('authToken', response.token);
        
        // Verifica se é paciente
        this.pacienteService.obterMe().subscribe({
          next: (me) => {
            this.carregando = false;
            if (me.pacienteId) {
              this.router.navigate(['/paciente/home']);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            this.carregando = false;
            // Fallback para home padrão
            this.router.navigate(['/home']);
          }
        });
      },
      error: (err) => {
        this.carregando = false;
        this.errorMessage = 'Falha ao autenticar. Verifique suas credenciais.';
        console.error(err);
      }
    });
  }
}

