import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const roleGuard = (expectedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const isBrowser = typeof window !== 'undefined';
    
    if (!isBrowser) return true; // SSR safety

    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userProfile'); // 'Administrador', 'Psicologo', etc.

    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    }

    // Se o usuário não tiver o papel esperado, redireciona para a página correspondente ao perfil dele
    if (userRole === 'Administrador') {
      router.navigate(['/dashboard/admin/resumo']);
    } else if (userRole === 'Psicologo') {
      router.navigate(['/dashboard/psicologo/resumo']);
    } else {
      router.navigate(['/login']);
    }
    
    return false;
  };
};
