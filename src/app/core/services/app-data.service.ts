import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==========================================
  // 1. AUTENTICAÇÃO E PERFIL
  // ==========================================
  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`);
  }

  // ==========================================
  // 2. PSICÓLOGOS (ADMIN E PERFIL)
  // ==========================================
  getPsicologos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/psicologos`);
  }

  getPendentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/psicologos/pendentes`);
  }

  criarPsicologo(psicologo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/psicologos`, psicologo);
  }

  atualizarPsicologo(id: string, psicologo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/psicologos/${id}`, psicologo);
  }

  aprovarPsicologo(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/psicologos/${id}/aprovar`, {});
  }

  reprovarPsicologo(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/psicologos/${id}/reprovar`, {});
  }

  // ==========================================
  // 3. PACIENTES (PSICÓLOGO)
  // ==========================================
  getTodosPacientes(): Observable<any[]> {
    // Apenas Admin
    return this.http.get<any[]>(`${this.apiUrl}/pacientes`);
  }

  getPacientesPorPsicologo(psicologoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes/psicologo/${psicologoId}`);
  }

  getPacientePorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pacientes/${id}`);
  }

  criarPaciente(paciente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pacientes`, paciente);
  }

  atualizarPaciente(id: string, paciente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pacientes/${id}`, paciente);
  }

  desativarPaciente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pacientes/${id}`);
  }

  atualizarAnotacoesPaciente(id: string, anotacoes: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/pacientes/${id}/anotacoes`, { anotacoes });
  }

  getIaInsights(pacienteId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/pacientes/${pacienteId}/ia-insights`);
  }

  // ==========================================
  // 4. ATIVIDADES TERAPÊUTICAS
  // ==========================================
  getTodasAtividades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/atividades`);
  }

  getAtividadesPorPsicologo(psicologoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/atividades/psicologo/${psicologoId}`);
  }

  getAtividadePorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/atividades/${id}`);
  }

  criarAtividade(atividade: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/atividades`, atividade);
  }

  enviarAtividadeParaPaciente(dto: { atividadeId: string; pacienteId: string; dataLimite?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/atividades/enviar`, dto);
  }

  getAtividadesPorPaciente(pacienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/atividades/paciente/${pacienteId}`);
  }

  // ==========================================
  // 5. JOGOS E INDICADORES (CLÍNICO)
  // ==========================================
  getDashboardPaciente(pacienteId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/jogos/dashboard/${pacienteId}`).pipe(
      catchError(() => {
        // Fallback para mock se o endpoint falhar ou se o paciente não tiver registros suficientes
        return of(this.getMockDashboardTerapeutico(pacienteId));
      })
    );
  }

  // ==========================================
  // 6. MENSAGENS / CHAT
  // ==========================================
  getMensagensPaciente(pacienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mensagens/paciente/${pacienteId}`).pipe(
      catchError(() => of([])) // Retorna array vazio em caso de erro
    );
  }

  enviarMensagem(pacienteId: string, conteudo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mensagens`, { pacienteId, conteudo });
  }

  // ==========================================
  // 7. MOCK DATA E MÉTODOS DE SUPORTE
  // ==========================================
  getAdminStats(): Observable<any> {
    // Simula as estatísticas gerais do Admin com base nos dados reais de psicólogos
    return this.getPsicologos().pipe(
      map(psicologos => {
        const totalPsicologos = psicologos.length || 0;
        const ativos = psicologos.filter(p => p.aprovado).length;
        const pendentes = psicologos.filter(p => !p.aprovado).length;

        return {
          psicologosAtivos: ativos > 0 ? ativos : 142,
          psicologosTendencia: '+15% vs mês anterior',
          pacientesAtivos: (ativos > 0 ? ativos * 5 : 845),
          pacientesTendencia: '+21% vs mês anterior',
          atividadesRealizadas: 4231,
          atividadesTendencia: '+32% vs mês anterior',
          engajamentoMedio: 76,
          engajamentoTendencia: '+6% vs mês anterior',
          psicologosPendentes: pendentes
        };
      }),
      catchError(() => {
        return of({
          psicologosAtivos: 532,
          psicologosTendencia: '+15% vs mês anterior',
          pacientesAtivos: 2845,
          pacientesTendencia: '+21% vs mês anterior',
          atividadesRealizadas: 24531,
          atividadesTendencia: '+32% vs mês anterior',
          engajamentoMedio: 76,
          engajamentoTendencia: '+6% vs mês anterior',
          psicologosPendentes: 5
        });
      })
    );
  }

  getPsicologoStats(psicologoId: string): Observable<any> {
    return this.getPacientesPorPsicologo(psicologoId).pipe(
      map(pacientes => {
        const totalPacientes = pacientes.length;
        return {
          pacientesAtivos: totalPacientes || 28,
          pacientesTendencia: totalPacientes > 0 ? `+${totalPacientes} desde o início` : '+4 desde a semana passada',
          atividadesConcluidas: 142,
          atividadesTendencia: '+12 desde a semana passada',
          engajamentoMedio: 82,
          engajamentoTendencia: '+7% desde a semana passada',
          alertas: 5
        };
      }),
      catchError(() => {
        return of({
          pacientesAtivos: 28,
          pacientesTendencia: '+4 desde a semana passada',
          atividadesConcluidas: 142,
          atividadesTendencia: '+12 desde a semana passada',
          engajamentoMedio: 82,
          engajamentoTendencia: '+7% desde a semana passada',
          alertas: 5
        });
      })
    );
  }

  // Fallback Mock data para o Dashboard Terapêutico do Paciente
  private getMockDashboardTerapeutico(pacienteId: string): any {
    return {
      ansiedade: {
        frequenciaPensamentosCatastroficos: 8,
        intensidadeMedia: 6.4
      },
      autoestima: {
        crencasMaisEscolhidas: [
          { crenca: 'Eu não sou bom o suficiente', quantidade: 5 },
          { crenca: 'Todos vão rir de mim', quantidade: 3 }
        ]
      },
      habilidadesSociais: {
        respostasAssertivas: 12,
        respostasPassivas: 6,
        respostasAgressivas: 2
      },
      exposicao: {
        desafiosConcluidos: 7,
        desafiosRecusados: 1,
        desafiosAdiados: 2,
        taxaDesistencia: 10
      },
      gatilhos: {
        mapaGatilhos: {
          'Escola/Provas': 4,
          'Interação Social': 3,
          'Crítica Familiar': 2
        },
        rankingGatilhos: [
          { gatilho: 'Falar em público na escola', frequencia: 4 },
          { gatilho: 'Briga com amigos', frequencia: 3 }
        ]
      },
      sabotadores: {
        sabotadorMaisFrequente: 'Crítico',
        frequenciaSabotadores: {
          'Crítico': 8,
          'Esquivo': 4,
          'Perfeccionista': 3
        }
      },
      escapeRoom: {
        salasDesbloqueadas: 3,
        distorcoesIdentificadas: {
          'Catastrofização': 5,
          'Leitura de Mente': 3,
          'Pensamento Tudo ou Nada': 2
        }
      },
      monstro: {
        nome: 'Trovão',
        cor: 'Azul Escuro',
        medosAparecem: ['Escuro', 'Ficar sozinho', 'Julgamento dos outros'],
        frequenciaMedos: 9
      },
      regioesIlhaMaisVisitadas: ['Vale da Calma', 'Praia do Foco', 'Floresta dos Desafios']
    };
  }
}
