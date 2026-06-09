import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Verificamos se estamos no ambiente do navegador (Client Side) antes de acessar o localStorage
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem('authToken') : null;

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
