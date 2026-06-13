import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { Landing } from './features/landing/landing';
import { PacienteShell } from './features/paciente/shell/paciente-shell';
import { PacienteHome } from './features/paciente/home/paciente-home';
import { Atividades } from './features/paciente/atividades/atividades';
import { AtividadesResponder } from './features/paciente/atividades/responder/atividades-responder';
import { Progresso } from './features/paciente/progresso/progresso';
import { Perfil } from './features/paciente/perfil/perfil';
import { Checkin } from './features/paciente/checkin/checkin';
import { Rpd } from './features/paciente/rpd/rpd';

export const appRoutes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
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
  }
];

