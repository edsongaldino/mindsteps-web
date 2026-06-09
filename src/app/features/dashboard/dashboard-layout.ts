import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { AppDataService } from '../../core/services/app-data.service';


@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout implements OnInit {
  userNome: string = 'Usuário';
  userEmail: string = 'usuario@mindsteps.com.br';
  userPerfil: string = 'Psicologo'; // 'Administrador' ou 'Psicologo'
  userFoto: string = '';

  constructor(private auth: Auth, private router: Router, private dataService: AppDataService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userPerfil = localStorage.getItem('userProfile') || 'Psicologo';
      
      this.dataService.getMe().subscribe({
        next: (me) => {
          this.userNome = me.nome || 'Usuário';
          this.userEmail = me.email || '';
          this.userFoto = me.fotoUrl || '';
          
          localStorage.setItem('userNome', me.nome);
          localStorage.setItem('userEmail', me.email);
          localStorage.setItem('userFotoUrl', me.fotoUrl || '');
          
          if (me.psicologoId) {
            localStorage.setItem('psicologoId', me.psicologoId);
          }
          if (me.pacienteId) {
            localStorage.setItem('pacienteId', me.pacienteId);
          }
        },
        error: () => {
          this.userNome = localStorage.getItem('userNome') || 'Usuário';
          this.userEmail = localStorage.getItem('userEmail') || '';
          this.userFoto = localStorage.getItem('userFotoUrl') || '';
        }
      });
    }
  }


  logout() {
    this.auth.logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userNome');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userFotoUrl');
    }
    this.router.navigate(['/login']);
  }
}
