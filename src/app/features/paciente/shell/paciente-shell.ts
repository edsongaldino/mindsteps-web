import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-paciente-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-shell.html',
  styleUrl: './paciente-shell.scss'
})
export class PacienteShell implements OnInit {
  activeRoute = '';
  patientName = '';
  patientXP = 0;
  patientLevel = 1;

  constructor(
    private router: Router, 
    private pacienteService: PacienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.updateActiveRoute();
    
    // Listen for route changes to highlight the correct nav item
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveRoute();
      this.cdr.detectChanges();
    });

    // Load initial simple profile data
    this.pacienteService.obterMe().subscribe({
      next: (me) => {
        this.patientName = me.nome || 'Paciente';
        this.patientXP = me.pontos || 0;
        this.patientLevel = me.nivel || 1;
        this.cdr.detectChanges();
      },
      error: () => {
        // Redirect to login if token invalid or expired
        this.logout();
      }
    });
  }

  updateActiveRoute() {
    this.activeRoute = this.router.url;
  }

  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
