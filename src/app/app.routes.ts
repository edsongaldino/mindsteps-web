import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Landing } from './features/landing/landing';
import { PoliticaPrivacidade } from './features/landing/politica-privacidade';
import { Registro } from './features/auth/registro/registro';
import { RecuperarSenha } from './features/auth/recuperar-senha/recuperar-senha';
// Paciente features removed
import { DashboardLayout } from './features/dashboard/dashboard-layout';
import { authGuard, roleGuard } from './core/guards/auth.guard';

// Importações do Portal Administrativo
import { AdminResumo } from './features/dashboard/admin/resumo';
import { AdminPsicologos } from './features/dashboard/admin/psicologos';
import { AdminPlanos } from './features/dashboard/admin/planos';

// Portal Clínico (Psicólogo) removido

export const appRoutes: Routes = [
  { path: '', component: Landing },
  { path: 'politica-de-privacidade', component: PoliticaPrivacidade },
  { path: 'login', component: Login },
  { path: 'registrar', component: Registro },
  { path: 'recuperar-senha', component: RecuperarSenha },

  
  // Rota Pai do Dashboard Protegida
  { 
    path: 'dashboard', 
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      // Rotas do Administrador
      { 
        path: 'admin/resumo', 
        component: AdminResumo, 
        canActivate: [roleGuard(['Administrador'])] 
      },
      { 
        path: 'admin/psicologos', 
        component: AdminPsicologos, 
        canActivate: [roleGuard(['Administrador'])] 
      },
      { 
        path: 'admin/planos', 
        component: AdminPlanos, 
        canActivate: [roleGuard(['Administrador'])] 
      },
      


      // Redirecionamentos de rota padrão dentro do dashboard
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Rota de contingência / Fallback
  { path: '**', redirectTo: 'login' }
];
