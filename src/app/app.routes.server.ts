import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'paciente/atividades/responder/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'paciente/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard/psicologo/pacientes/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

