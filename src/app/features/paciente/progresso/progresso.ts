import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-progresso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progresso.html',
  styleUrl: './progresso.scss'
})
export class Progresso implements OnInit {
  carregando = true;
  erroMsg = '';
  abaAtiva = 'clinico'; // 'clinico', 'humor', 'xp'
  
  // Data packages
  me: any = {};
  checkins: any[] = [];
  registros: any[] = [];
  atividades: any[] = [];
  dashboard: any = {};

  // Computed clinical values
  concluidasCount = 0;
  pontosAtividades = 0;
  pontosCheckins = 0;
  pontosRegistros = 0;
  datasCheckinUnicasCount = 0;
  registrosAvulsosCount = 0;

  // Clinical metrics variables
  freqCatastrofes = 0;
  intMedia = 0;
  crencas: any[] = [];
  assertivas = 0;
  passivas = 0;
  agressivas = 0;
  totalSociais = 0;
  expConcluidos = 0;
  expDesistencia = 0;
  mapaGatilhos: { key: string, value: number }[] = [];
  sabotadorMaisFreq = 'Nenhum';

  // SVG Chart values
  svgPath = '';
  svgPoints: { x: number; y: number; val: number; dateLabel: string }[] = [];
  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  chartWidth = 460;
  chartHeight = 160;

  constructor(private service: PacienteService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.carregarProgresso();
  }

  carregarProgresso() {
    this.carregando = true;
    this.cdr.detectChanges();
    forkJoin({
      me: this.service.obterMe(),
      checkins: this.service.listarMeusCheckins().pipe(catchError(() => of([]))),
      registros: this.service.listarMeusRegistrosPensamentos().pipe(catchError(() => of([]))),
      atividades: this.service.listarMinhasAtividades().pipe(catchError(() => of([]))),
      dashboard: this.service.obterDashboardTerapeutico().pipe(catchError(() => of({})))
    }).subscribe({
      next: (res) => {
        this.me = res.me;
        this.checkins = res.checkins;
        this.registros = res.registros;
        this.atividades = res.atividades;
        this.dashboard = res.dashboard;

        this.processarDados();
        this.gerarGraficoHumor();
        
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.erroMsg = 'Erro ao carregar os dados de evolução.';
        this.carregando = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  setAba(aba: string) {
    this.abaAtiva = aba;
  }

  processarDados() {
    // 1. XP Details
    const concluidas = this.atividades.filter(x => this.service.estaConcluida(x.status));
    this.concluidasCount = concluidas.length;

    this.pontosAtividades = concluidas.reduce((sum, item) => {
      const nivel = item.nivel || item.atividade?.nivel || 1;
      return sum + ((nivel > 0 ? nivel : 1) * 10);
    }, 0);

    const datasCheckinUnicas = new Set(this.checkins.map(c => {
      const dateStr = c.criadoEm || c.dataCriacao || '';
      try {
        const dt = new Date(dateStr);
        return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
      } catch (_) {
        return '';
      }
    }).filter(d => d !== ''));

    this.datasCheckinUnicasCount = datasCheckinUnicas.size;
    this.pontosCheckins = this.datasCheckinUnicasCount * 10;

    const registrosAvulsos = this.registros.filter(r => !r.atividadePacienteId);
    this.registrosAvulsosCount = registrosAvulsos.length;
    this.pontosRegistros = this.registrosAvulsosCount * 15;

    // 2. Clinical Metrics
    const ansiedade = this.dashboard.ansiedade || {};
    const autoestima = this.dashboard.autoestima || {};
    const habSociais = this.dashboard.habilidadesSociais || {};
    const exposicao = this.dashboard.exposicao || {};
    const gatilhos = this.dashboard.gatilhos || {};
    const sabotadores = this.dashboard.sabotadores || {};

    this.freqCatastrofes = ansiedade.frequenciaPensamentosCatastroficos ?? 0;
    this.intMedia = ansiedade.intensidadeMedia ?? 0;
    this.crencas = autoestima.crencasMaisEscolhidas || [];
    
    this.assertivas = habSociais.respostasAssertivas ?? 0;
    this.passivas = habSociais.respostasPassivas ?? 0;
    this.agressivas = habSociais.respostasAgressivas ?? 0;
    this.totalSociais = this.assertivas + this.passivas + this.agressivas;

    this.expConcluidos = exposicao.desafiosConcluidos ?? 0;
    this.expDesistencia = exposicao.taxaDesistencia ?? 0;

    this.sabotadorMaisFreq = sabotadores.sabotadorMaisFrequente || 'Nenhum';

    const rawGatilhos = gatilhos.mapaGatilhos || {};
    this.mapaGatilhos = Object.keys(rawGatilhos).map(k => ({
      key: k,
      value: rawGatilhos[k]
    }));
  }

  gerarGraficoHumor() {
    if (this.checkins.length === 0) return;

    // Get last 7 check-ins, sorted chronologically
    const checkinsRecentes = [...this.checkins]
      .sort((a, b) => new Date(a.criadoEm || a.dataCriacao).getTime() - new Date(b.criadoEm || b.dataCriacao).getTime())
      .slice(-7);

    const paddingX = 40;
    const paddingY = 20;
    const usableWidth = this.chartWidth - paddingX * 2;
    const usableHeight = this.chartHeight - paddingY * 2;
    const stepX = checkinsRecentes.length > 1 ? usableWidth / (checkinsRecentes.length - 1) : usableWidth;

    this.svgPoints = checkinsRecentes.map((c, i) => {
      const x = paddingX + i * stepX;
      // Humor value ranges 1 to 5. We map 1 to bottom (usableHeight) and 5 to top (0)
      const humorVal = c.humor || 3;
      const y = paddingY + usableHeight - ((humorVal - 1) / 4) * usableHeight;
      
      let dateLabel = '';
      try {
        const dt = new Date(c.criadoEm || c.dataCriacao);
        dateLabel = this.diasSemana[dt.getDay()];
      } catch (_) {
        dateLabel = '';
      }

      return { x, y, val: humorVal, dateLabel };
    });

    // Generate SVG path string
    if (this.svgPoints.length > 0) {
      this.svgPath = 'M ' + this.svgPoints.map(p => `${p.x} ${p.y}`).join(' L ');
    }
  }

  estaConcluida(status: any): boolean {
    return this.service.estaConcluida(status);
  }

  obterDataFormatada(dataStr: string): string {
    if (!dataStr) return '';
    try {
      const dt = new Date(dataStr);
      const dia = dt.getDate().toString().padStart(2, '0');
      const mes = (dt.getMonth() + 1).toString().padStart(2, '0');
      return `${dia}/${mes}`;
    } catch (_) {
      return '';
    }
  }
}
