import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { PacienteService } from '../../../../core/services/paciente.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-atividades-responder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './atividades-responder.html',
  styleUrl: './atividades-responder.scss'
})
export class AtividadesResponder implements OnInit, OnDestroy {
  id = '';
  ativ: any = null;
  carregando = true;
  salvando = false;
  sucesso = false;
  notaHumor = 5;

  // Free Text
  respostaTexto = '';

  // Checklist (Type 4)
  perguntas: string[] = [];
  checklistStatus: boolean[] = [];

  // Game configuration (Type 7)
  nomeJogo = 'Jogo de Memória';
  pacienteNivel = 1;
  jogoConcluido = false;

  // --- GAME 1: Jogo de Memória (Memory Match) ---
  cartas: any[] = [];
  indexPrimeiraCarta: number | null = null;
  bloqueado = false;
  movimentos = 0;
  paresEncontrados = 0;
  totalPares = 0;
  segundosJogo = 0;
  timerJogo: any = null;
  dificuldadeEfetiva = 'Médio';

  // --- GAME 2: Detetive dos Pensamentos ---
  detetiveEtapa = 1;
  detetivePensamentoEscolhido = '';
  detetiveEmocaoEscolhida = '';
  detetiveIntensidade = 5;
  detetiveRestruturacao = '';
  detetivePensamentos = [
    'Ele está bravo comigo',
    'Talvez esteja ocupado',
    'Não sei o que aconteceu',
    'Ele não gosta mais de mim'
  ];
  detetiveEmocoes = ['Ansiedade', 'Tristeza', 'Frustração', 'Insegurança', 'Raiva'];

  // --- GAME 3: Memória Tática ---
  taticaEtapa = 0; // 0: Intro, 1: Memorizar, 2: Identificar, 3: Concluido
  taticaArquivos = [
    { nome: 'Contratos', icone: 'ti-file-text' },
    { nome: 'Fotos', icone: 'ti-photo' },
    { nome: 'Vídeos', icone: 'ti-video' },
    { nome: 'Mensagens', icone: 'ti-message-circle' },
    { nome: 'Backup', icone: 'ti-database' },
    { nome: 'Finanças', icone: 'ti-coin' }
  ];
  taticaItensAtivos: any[] = [];
  taticaArquivoSumido = '';
  taticaArquivoSelecionado = '';
  taticaSegundosRestantes = 4;
  taticaTimer: any = null;
  taticaAcertou = false;

  private routeSub!: Subscription;

  constructor(
    private service: PacienteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.carregarAtividade();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.limparTimers();
  }

  limparTimers() {
    if (this.timerJogo) clearInterval(this.timerJogo);
    if (this.taticaTimer) clearInterval(this.taticaTimer);
  }

  carregarAtividade() {
    this.carregando = true;
    this.cdr.detectChanges();
    this.service.listarMinhasAtividades().subscribe({
      next: (list) => {
        this.ativ = list.find(x => x.id?.toString() === this.id);
        
        if (!this.ativ) {
          this.carregando = false;
          this.cdr.detectChanges();
          alert('Atividade não encontrada.');
          this.router.navigate(['/paciente/atividades']);
          return;
        }

        const tipo = this.ativ.atividade?.tipo ?? this.ativ.tipo ?? 1;
        const conteudo = this.ativ.atividade?.conteudo ?? this.ativ.conteudo ?? '';

        if (tipo === 4) {
          // Parse checklist questions
          this.parseChecklist(conteudo);
        } else if (tipo === 7) {
          // Determine game type and load config
          this.parseGame(conteudo);
        }
        
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.carregando = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  parseChecklist(conteudo: string) {
    try {
      if (conteudo) {
        const decoded = JSON.parse(conteudo);
        if (decoded.perguntas) {
          this.perguntas = decoded.perguntas;
          this.checklistStatus = new Array(this.perguntas.length).fill(false);
        }
      }
    } catch (_) {}
  }

  parseGame(conteudo: string) {
    let tipoJogo = 'Jogo de Memória';
    try {
      if (conteudo) {
        const decoded = JSON.parse(conteudo);
        tipoJogo = decoded.tipoJogo || 'Jogo de Memória';
      }
    } catch (_) {}

    this.nomeJogo = tipoJogo;
    
    // Load patient level to configure difficulty
    this.service.obterMe().subscribe({
      next: (me) => {
        this.pacienteNivel = me.nivel || 1;
        this.iniciarJogoSelecionado(conteudo);
        this.cdr.detectChanges();
      },
      error: () => {
        this.iniciarJogoSelecionado(conteudo);
        this.cdr.detectChanges();
      }
    });
  }

  iniciarJogoSelecionado(conteudo: string) {
    if (this.nomeJogo === 'Memória Tática' || this.nomeJogo === 'Caçador de Memórias' || this.nomeJogo === 'Jogo de Memória') {
      if (this.nomeJogo === 'Memória Tática') {
        this.taticaEtapa = 0;
      } else {
        this.iniciarJogoDeMemoria(conteudo);
      }
    }
  }

  // --- GAME 1: Jogo de Memória Logic ---
  iniciarJogoDeMemoria(conteudo: string) {
    let modo = 'Imagens';
    let tema = 'Expressões/Emoções';
    let dificuldade = 'Evolutivo';
    let palavrasPersonalizadas: string[] = [];

    try {
      if (conteudo) {
        const decoded = JSON.parse(conteudo);
        modo = decoded.modo || 'Imagens';
        tema = decoded.tema || 'Expressões/Emoções';
        dificuldade = decoded.dificuldade || 'Evolutivo';
        if (Array.isArray(decoded.palavrasPersonalizadas)) {
          palavrasPersonalizadas = decoded.palavrasPersonalizadas;
        }
      }
    } catch (_) {}

    let paresCount = 4;
    if (dificuldade === 'Fácil') {
      paresCount = 3;
      this.dificuldadeEfetiva = 'Fácil';
    } else if (dificuldade === 'Médio') {
      paresCount = 6;
      this.dificuldadeEfetiva = 'Médio';
    } else if (dificuldade === 'Difícil') {
      paresCount = 8;
      this.dificuldadeEfetiva = 'Difícil';
    } else {
      // Evolutivo
      this.dificuldadeEfetiva = `Evolutivo (Nível ${this.pacienteNivel})`;
      if (this.pacienteNivel <= 1) {
        paresCount = 3;
      } else if (this.pacienteNivel === 2) {
        paresCount = 4;
      } else if (this.pacienteNivel === 3) {
        paresCount = 6;
      } else {
        paresCount = 8;
      }
    }

    this.totalPares = paresCount;

    let pool: string[] = [];
    if (modo === 'Imagens') {
      if (tema === 'Natureza') {
        pool = ['🌸', '🌲', '☀️', '🌧️', '🍄', '🍁', '🌊', '🌋', '🍀', '🌻'];
      } else if (tema === 'Animais') {
        pool = ['🐶', '🐱', '🦊', '🦁', '🐯', '🐸', '🐵', '🐔', '🐙', '🐝'];
      } else {
        pool = ['😊', '😢', '😡', '😱', '🤢', '😲', '😎', '😴', '🥳', '😕'];
      }
    } else {
      if (tema === 'Animais') {
        pool = ['Cão', 'Gato', 'Leão', 'Tigre', 'Urso', 'Sapo', 'Macaco', 'Peixe', 'Polvo', 'Abelha'];
      } else if (tema === 'Personalizado' && palavrasPersonalizadas.length > 0) {
        pool = [...palavrasPersonalizadas];
      } else {
        pool = ['Alegria', 'Tristeza', 'Raiva', 'Medo', 'Nojo', 'Surpresa', 'Calma', 'Ansiedade', 'Orgulho', 'Amor'];
      }
    }

    while (pool.length < paresCount) {
      pool.push(`Item ${pool.length + 1}`);
    }

    const selecionados = pool.slice(0, paresCount);
    const duplicados = [...selecionados, ...selecionados].sort(() => Math.random() - 0.5);

    this.cartas = duplicados.map((val, idx) => ({
      id: idx,
      valor: val,
      revelada: false,
      combinada: false
    }));

    this.movimentos = 0;
    this.paresEncontrados = 0;
    this.jogoConcluido = false;
    this.segundosJogo = 0;
    this.indexPrimeiraCarta = null;
    this.bloqueado = false;

    if (this.timerJogo) clearInterval(this.timerJogo);
    this.timerJogo = setInterval(() => {
      this.segundosJogo++;
    }, 1000);
  }

  selecionarCarta(index: number) {
    if (this.bloqueado || this.cartas[index].revelada || this.cartas[index].combinada) return;

    this.cartas[index].revelada = true;

    if (this.indexPrimeiraCarta === null) {
      this.indexPrimeiraCarta = index;
    } else {
      this.movimentos++;
      const indexSegundaCarta = index;
      const v1 = this.cartas[this.indexPrimeiraCarta].valor;
      const v2 = this.cartas[indexSegundaCarta].valor;

      if (v1 === v2) {
        // Match
        this.cartas[this.indexPrimeiraCarta].combinada = true;
        this.cartas[indexSegundaCarta].combinada = true;
        this.paresEncontrados++;
        this.indexPrimeiraCarta = null;

        if (this.paresEncontrados === this.totalPares) {
          clearInterval(this.timerJogo);
          this.jogoConcluido = true;
        }
      } else {
        // No match
        this.bloqueado = true;
        setTimeout(() => {
          this.cartas[this.indexPrimeiraCarta!].revelada = false;
          this.cartas[indexSegundaCarta].revelada = false;
          this.indexPrimeiraCarta = null;
          this.bloqueado = false;
        }, 1000);
      }
    }
  }

  obterTempoFormatado(): string {
    const min = Math.floor(this.segundosJogo / 60).toString().padStart(2, '0');
    const seg = (this.segundosJogo % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
  }

  // --- GAME 2: Detetive dos Pensamentos Logic ---
  detetiveAvancarEtapa() {
    if (this.detetiveEtapa === 1 && this.detetivePensamentoEscolhido) {
      this.detetiveEtapa = 2;
    } else if (this.detetiveEtapa === 2 && this.detetiveEmocaoEscolhida) {
      this.detetiveEtapa = 3;
    }
  }

  detetiveFinalizar() {
    if (this.detetiveRestruturacao.trim() === '') return;
    this.salvando = true;

    const dadosPlay = {
      situacao: 'Seu amigo visualizou sua mensagem e não respondeu.',
      pensamento: this.detetivePensamentoEscolhido,
      emocao: this.detetiveEmocaoEscolhida,
      intensidade: Math.round(this.detetiveIntensidade),
      reestruturacao: this.detetiveRestruturacao.trim()
    };

    this.service.registrarJogo('detetive', dadosPlay, this.id).subscribe({
      next: (resultado) => {
        // Save and complete activity
        this.service.responderAtividade(this.id, JSON.stringify({
          jogo: 'Detetive dos Pensamentos',
          reestruturacao: this.detetiveRestruturacao.trim(),
          pontosXP: resultado.pontosGanhos || 15
        }), this.notaHumor).subscribe({
          next: () => {
            this.salvando = false;
            this.sucesso = true;
            setTimeout(() => this.router.navigate(['/paciente/atividades']), 1500);
          },
          error: (err) => {
            this.salvando = false;
            alert('Erro ao responder: ' + err.message);
          }
        });
      },
      error: (err) => {
        this.salvando = false;
        alert('Erro ao salvar jogo: ' + err.message);
      }
    });
  }

  // --- GAME 3: Memória Tática Logic ---
  taticaIniciar() {
    const randomSorted = [...this.taticaArquivos].sort(() => Math.random() - 0.5);
    this.taticaItensAtivos = randomSorted.slice(0, 4);
    
    // Choose one to disappear
    const indexSumido = Math.floor(Math.random() * this.taticaItensAtivos.length);
    this.taticaArquivoSumido = this.taticaItensAtivos[indexSumido].nome;
    
    this.taticaEtapa = 1; // Memorize
    this.taticaSegundosRestantes = 4;
    this.taticaArquivoSelecionado = '';

    if (this.taticaTimer) clearInterval(this.taticaTimer);
    this.taticaTimer = setInterval(() => {
      if (this.taticaSegundosRestantes > 1) {
        this.taticaSegundosRestantes--;
      } else {
        clearInterval(this.taticaTimer);
        this.taticaEtapa = 2; // Identify
      }
    }, 1000);
  }

  taticaResponder(nome: string) {
    if (this.taticaArquivoSelecionado !== '') return;
    this.taticaArquivoSelecionado = nome;
  }

  taticaFinalizar() {
    if (this.taticaArquivoSelecionado === '') return;
    this.salvando = true;
    this.taticaAcertou = this.taticaArquivoSelecionado === this.taticaArquivoSumido;

    const dadosPlay = {
      acerto: this.taticaAcertou,
      arquivo_esperado: this.taticaArquivoSumido,
      arquivo_respondido: this.taticaArquivoSelecionado,
      itens_mostrados: this.taticaItensAtivos.map(e => e.nome).join(',')
    };

    this.service.registrarJogo('memoria_tatica', dadosPlay, this.id).subscribe({
      next: () => {
        this.service.responderAtividade(this.id, JSON.stringify({
          jogo: 'Memória Tática',
          acertou: this.taticaAcertou,
          resposta: this.taticaArquivoSelecionado
        }), this.notaHumor).subscribe({
          next: () => {
            this.salvando = false;
            this.taticaEtapa = 3; // Result
          },
          error: (err) => {
            this.salvando = false;
            alert('Erro ao responder: ' + err.message);
          }
        });
      },
      error: (err) => {
        this.salvando = false;
        alert('Erro ao registrar jogo: ' + err.message);
      }
    });
  }

  // --- SUBMIT COMPONENT ACTION ---
  salvar() {
    const tipo = this.ativ.atividade?.tipo ?? this.ativ.tipo ?? 1;
    let finalResposta = '';

    if (tipo === 7) {
      if (this.nomeJogo === 'Memória Tática') {
        this.router.navigate(['/paciente/atividades']);
        return;
      } else {
        // Jogo de Memória
        if (!this.jogoConcluido) {
          alert('Por favor, termine o jogo antes de continuar.');
          return;
        }
        finalResposta = JSON.stringify({
          jogo: 'Jogo de Memória',
          movimentos: this.movimentos,
          tempoSegundos: this.segundosJogo,
          dificuldade: this.dificuldadeEfetiva
        });
      }
    } else if (tipo === 4) {
      // Checklist
      const map: any = {};
      for (let i = 0; i < this.perguntas.length; i++) {
        map[this.perguntas[i]] = this.checklistStatus[i];
      }
      finalResposta = JSON.stringify(map);
    } else {
      // Free text
      if (this.respostaTexto.trim() === '') {
        alert('Escreva a resposta antes de enviar.');
        return;
      }
      finalResposta = this.respostaTexto.trim();
    }

    this.salvando = true;
    this.service.responderAtividade(this.id, finalResposta, this.notaHumor).subscribe({
      next: () => {
        this.salvando = false;
        this.sucesso = true;
        setTimeout(() => {
          this.router.navigate(['/paciente/atividades']);
        }, 1500);
      },
      error: (err) => {
        this.salvando = false;
        alert('Erro ao enviar atividade: ' + err.message);
      }
    });
  }
}
