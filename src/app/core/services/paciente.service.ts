import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, switchMap, catchError, tap, shareReplay } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private cachedMe: any = null;
  private me$: Observable<any> | null = null;

  obterMe(): Observable<any> {
    if (this.cachedMe) {
      console.log('[PacienteService] obterMe: Retornando perfil em cache:', this.cachedMe.nome);
      return of(this.cachedMe);
    }

    if (this.me$) {
      console.log('[PacienteService] obterMe: Compartilhando requisição em andamento...');
      return this.me$;
    }

    console.log('[PacienteService] obterMe: Requisitando perfil ao servidor...');
    this.me$ = this.http.get<any>(`${this.apiUrl}/Auth/me`).pipe(
      tap(me => {
        console.log('[PacienteService] obterMe: Perfil recebido e cacheado:', me.nome);
        this.cachedMe = me;
        this.me$ = null;
      }),
      catchError(err => {
        console.error('[PacienteService] obterMe: Erro ao requisitar perfil:', err);
        this.me$ = null;
        return throwError(() => err);
      }),
      shareReplay(1)
    );

    return this.me$;
  }

  limparCacheMe() {
    console.log('[PacienteService] Limpando cache do perfil');
    this.cachedMe = null;
  }

  obterPacienteId(): Observable<string> {
    return this.obterMe().pipe(
      map(me => {
        const pacienteId = me.pacienteId;
        if (!pacienteId) {
          throw new Error('PacienteId não encontrado para o usuário logado.');
        }
        return pacienteId.toString();
      })
    );
  }

  listarMinhasAtividades(): Observable<any[]> {
    console.log('[PacienteService] listarMinhasAtividades: Iniciando carregamento de atividades...');
    return this.obterPacienteId().pipe(
      switchMap(pacienteId => {
        console.log(`[PacienteService] listarMinhasAtividades: Buscando atividades para o pacienteId ${pacienteId}...`);
        return this.http.get<any[]>(`${this.apiUrl}/Atividades/paciente/${pacienteId}`).pipe(
          tap(data => console.log(`[PacienteService] listarMinhasAtividades: Atividades recebidas: ${data.length}`)),
          catchError(err => {
            console.error('[PacienteService] listarMinhasAtividades: Erro na requisição:', err);
            return throwError(() => err);
          })
        );
      })
    );
  }

  listarMeusCheckins(): Observable<any[]> {
    return this.obterPacienteId().pipe(
      switchMap(pacienteId => this.http.get<any[]>(`${this.apiUrl}/CheckInsEmocionais/paciente/${pacienteId}`))
    );
  }

  verificarCheckinHoje(): Observable<boolean> {
    return this.obterPacienteId().pipe(
      switchMap(pacienteId => this.http.get<any>(`${this.apiUrl}/CheckInsEmocionais/status-hoje/${pacienteId}`)),
      map(res => res?.jaFez ?? false),
      catchError(() => of(false))
    );
  }

  listarMeusRegistrosPensamentos(): Observable<any[]> {
    return this.obterPacienteId().pipe(
      switchMap(pacienteId => this.http.get<any[]>(`${this.apiUrl}/RegistrosPensamentos/paciente/${pacienteId}`))
    );
  }

  listarMinhasMensagens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Mensagens/minhas`);
  }

  marcarMensagemComoLida(mensagemId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/Mensagens/${mensagemId}/ler`, {});
  }

  responderAtividade(atividadePacienteId: string, respostaTexto: string, notaHumor: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/Atividades/responder`, {
      atividadePacienteId,
      respostaTexto,
      notaHumor
    });
  }

  criarCheckin(humor: number, intensidade: number, emocaoPrincipal: string, observacao?: string | null): Observable<any> {
    return this.obterPacienteId().pipe(
      switchMap(pacienteId => this.http.post<any>(`${this.apiUrl}/CheckInsEmocionais`, {
        pacienteId,
        humor,
        intensidade,
        emocaoPrincipal,
        observacao
      }))
    );
  }

  criarRegistroPensamento(dados: {
    situacao: string;
    pensamentoAutomatico: string;
    emocao: string;
    intensidadeEmocao: number;
    evidenciasAFavor?: string;
    evidenciasContra?: string;
    pensamentoAlternativo?: string;
    intensidadeFinal?: number;
  }): Observable<any> {
    return this.obterPacienteId().pipe(
      switchMap(pacienteId => this.http.post<any>(`${this.apiUrl}/RegistrosPensamentos`, {
        pacienteId,
        ...dados
      }))
    );
  }

  registrarJogo(jogoId: string, dadosPlay: any, atividadePacienteId?: string | null): Observable<any> {
    return this.obterPacienteId().pipe(
      switchMap(pacienteId => this.http.post<any>(`${this.apiUrl}/Jogos/registrar`, {
        pacienteId,
        jogoId,
        dadosPlay: JSON.stringify(dadosPlay),
        atividadePacienteId
      }))
    );
  }

  obterDashboardTerapeutico(): Observable<any> {
    return this.obterPacienteId().pipe(
      switchMap(pacienteId => this.http.get<any>(`${this.apiUrl}/Jogos/dashboard/${pacienteId}`)),
      catchError(() => of({}))
    );
  }

  estaConcluida(status: any): boolean {
    if (status === null || status === undefined) return false;
    const s = status.toString().toLowerCase().trim();
    return status === 3 || s === '3' || s === 'concluida' || s === 'concluido' || s === 'concluída' || s === 'concluído';
  }

  obterResumoHome(): Observable<any> {
    console.log('[PacienteService] obterResumoHome: Iniciando carregamento do resumo do paciente');
    return this.obterMe().pipe(
      switchMap(me => {
        console.log('[PacienteService] obterResumoHome: Dados do usuário obtidos:', me);
        const pacienteId = me.pacienteId;
        if (!pacienteId) {
          console.warn('[PacienteService] obterResumoHome: pacienteId não encontrado para o usuário logado.');
          return of({
            atividades: 0,
            concluidas: 0,
            checkins: 0,
            registros: 0,
            humorMedio: '-',
            pontos: me.pontos || 0,
            nivel: me.nivel || 1,
            nome: me.nome || '',
            usuarioId: me.usuarioId || '',
            pacienteId: '',
            email: me.email || '',
            fotoUrl: me.fotoUrl || '',
            mensagemMotivacional: null,
            notificacoes: []
          });
        }

        const pacienteIdStr = pacienteId.toString();
        console.log(`[PacienteService] obterResumoHome: Carregando dados para o pacienteId ${pacienteIdStr}`);

        return forkJoin({
          atividades: this.http.get<any[]>(`${this.apiUrl}/Atividades/paciente/${pacienteIdStr}`).pipe(
            tap(data => console.log('[PacienteService] obterResumoHome: Atividades carregadas com sucesso:', data.length)),
            catchError(err => {
              console.error('[PacienteService] obterResumoHome: Erro ao carregar atividades:', err);
              return of([]);
            })
          ),
          checkins: this.http.get<any[]>(`${this.apiUrl}/CheckInsEmocionais/paciente/${pacienteIdStr}`).pipe(
            tap(data => console.log('[PacienteService] obterResumoHome: Check-ins carregados com sucesso:', data.length)),
            catchError(err => {
              console.error('[PacienteService] obterResumoHome: Erro ao carregar check-ins:', err);
              return of([]);
            })
          ),
          registros: this.http.get<any[]>(`${this.apiUrl}/RegistrosPensamentos/paciente/${pacienteIdStr}`).pipe(
            tap(data => console.log('[PacienteService] obterResumoHome: Registros carregados com sucesso:', data.length)),
            catchError(err => {
              console.error('[PacienteService] obterResumoHome: Erro ao carregar registros:', err);
              return of([]);
            })
          ),
          mensagens: this.http.get<any[]>(`${this.apiUrl}/Mensagens/minhas`).pipe(
            tap(data => console.log('[PacienteService] obterResumoHome: Mensagens carregadas com sucesso:', data.length)),
            catchError(err => {
              console.error('[PacienteService] obterResumoHome: Erro ao carregar mensagens:', err);
              return of([]);
            })
          )
        }).pipe(
          map(({ atividades, checkins, registros, mensagens }) => {
            const concluidas = atividades.filter(x => this.estaConcluida(x.status)).length;
            
            let humorMedio = '-';
            if (checkins.length > 0) {
              const soma = checkins.reduce((sum, item) => sum + (item.humor || 0), 0);
              const media = soma / checkins.length;

              if (media >= 4) {
                humorMedio = 'Ótimo';
              } else if (media >= 3) {
                humorMedio = 'Bom';
              } else if (media >= 2) {
                humorMedio = 'Regular';
              } else {
                humorMedio = 'Ruim';
              }
            }

            const ultimaMensagem = mensagens.length > 0 ? mensagens[0] : null;
            const notificacoes: any[] = [];

            // Atividades pendentes
            const atividadesPendentes = atividades.filter(x => !this.estaConcluida(x.status));
            for (const act of atividadesPendentes) {
              notificacoes.push({
                id: act.id?.toString() || '',
                titulo: 'Nova Atividade Recebida',
                conteudo: `Você tem uma nova atividade: ${act.titulo || act.atividade?.titulo || ''}`,
                tipo: 'activity',
                data: act.dataEnvio
              });
            }

            // Mensagens não lidas
            const mensagensNaoLidas = mensagens.filter(x => x.lida === false);
            for (const msg of mensagensNaoLidas) {
              notificacoes.push({
                id: msg.id?.toString() || '',
                titulo: 'Nova Mensagem',
                conteudo: msg.conteudo,
                tipo: 'message',
                data: msg.criadoEm
              });
            }

            return {
              atividades: atividades.length,
              concluidas: concluidas,
              checkins: checkins.length,
              registros: registros.length,
              humorMedio: humorMedio,
              pontos: me.pontos || 0,
              nivel: me.nivel || 1,
              nome: me.nome || '',
              usuarioId: me.usuarioId || '',
              pacienteId: pacienteIdStr,
              email: me.email || '',
              fotoUrl: me.fotoUrl || '',
              mensagemMotivacional: ultimaMensagem,
              notificacoes: notificacoes
            };
          })
        );
      })
    );
  }
}
