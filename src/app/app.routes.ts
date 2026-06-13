import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Landing } from './features/landing/landing';
import { PacienteShell } from './features/paciente/shell/paciente-shell';
import { PacienteHome } from './features/paciente/home/paciente-home';
import { Atividades } from './features/paciente/atividades/atividades';
import { AtividadesResponder } from './features/paciente/atividades/responder/atividades-responder';
import { Progresso } from './features/paciente/progresso/progresso';
import { Perfil } from './features/paciente/perfil/perfil';
import { Checkin } from './features/paciente/checkin/checkin';
import { Rpd } from './features/paciente/rpd/rpd';
import { DashboardLayout } from './features/dashboard/dashboard-layout';
import { authGuard, roleGuard } from './core/guards/auth.guard';

// Importações do Portal Administrativo
import { AdminResumo } from './features/dashboard/admin/resumo';
import { AdminPsicologos } from './features/dashboard/admin/psicologos';
import { AdminPlanos } from './features/dashboard/admin/planos';

// Importações do Portal Clínico (Psicólogo)
import { PsicologoResumo } from './features/dashboard/psicologo/resumo';
import { PsicologoPacientes } from './features/dashboard/psicologo/pacientes';
import { PsicologoPacientePerfil } from './features/dashboard/psicologo/paciente-perfil';
import { PsicologoAtividades } from './features/dashboard/psicologo/atividades';
import { PsicologoBiblioteca } from './features/dashboard/psicologo/biblioteca';
import { PsicologoRelatorios } from './features/dashboard/psicologo/relatorios';
import { PsicologoMensagens } from './features/dashboard/psicologo/mensagens';

export const appRoutes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  {
    path: 'paciente',
    component: PacienteShell,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: PacienteHome },
      { path: 'atividades', component: Atividades },
      { path: 'atividades/responder/:id', component: AtividadesResponder },
      { path: 'progresso', component: Progresso },
      { path: 'perfil', component: Perfil },
      { path: 'checkin', component: Checkin },
      { path: 'rpd', component: Rpd }
    ]
  },
  
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
      
      // Rotas do Psicólogo
      { 
        path: 'psicologo/resumo', 
        component: PsicologoResumo, 
        canActivate: [roleGuard(['Psicologo'])] 
      },
      { 
        path: 'psicologo/pacientes', 
        component: PsicologoPacientes, 
        canActivate: [roleGuard(['Psicologo'])] 
      },
      { 
        path: 'psicologo/pacientes/:id', 
        component: PsicologoPacientePerfil, 
        canActivate: [roleGuard(['Psicologo'])] 
      },
      { 
        path: 'psicologo/atividades', 
        component: PsicologoAtividades, 
        canActivate: [roleGuard(['Psicologo'])] 
      },
      { 
        path: 'psicologo/biblioteca', 
        component: PsicologoBiblioteca, 
        canActivate: [roleGuard(['Psicologo'])] 
      },
      { 
        path: 'psicologo/relatorios', 
        component: PsicologoRelatorios, 
        canActivate: [roleGuard(['Psicologo'])] 
      },
      { 
        path: 'psicologo/mensagens', 
        component: PsicologoMensagens, 
        canActivate: [roleGuard(['Psicologo'])] 
      },

      // Redirecionamentos de rota padrão dentro do dashboard
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Rota de contingência / Fallback
  { path: '**', redirectTo: 'login' }
];
