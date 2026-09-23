import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  
  private apiUrl = `${environment.apiUrl}/auth`;  // Usando a URL da API com base no ambiente

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha });
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    const isBrowser = typeof window !== 'undefined';
    return isBrowser ? !!localStorage.getItem('authToken') : false;
  }

  registrarPsicologo(dados: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/psicologos/registrar`, dados);
  }

  recuperarSenha(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar-senha`, { email });
  }

  validarCodigoRecuperacao(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validar-codigo-recuperacao`, { email, codigo });
  }

  redefinirSenha(email: string, codigo: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/redefinir-senha`, { email, codigo, novaSenha });
  }
}
