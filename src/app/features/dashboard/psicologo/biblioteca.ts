import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-psicologo-biblioteca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './biblioteca.html',
  styleUrl: './biblioteca.scss'
})
export class PsicologoBiblioteca {
  activeCategory: string = 'todos'; // 'todos', 'regulacao', 'funcoes', 'autocontrole', 'atencao'

  jogos = [
    {
      id: 'semaforo',
      titulo: 'Semáforo das Emoções',
      categoria: 'Regulação emocional',
      categoriaChave: 'regulacao',
      faixaEtaria: '6-12 anos',
      descricao: 'Ajuda a criança a identificar níveis de intensidade emocional (Vermelho: Parar/Acalmar, Amarelo: Pensar, Verde: Agir).',
      emoji: '🚦',
      cor: '#ef4444'
    },
    {
      id: 'mestre',
      titulo: 'Mestre Mandou',
      categoria: 'Controle inibitório',
      categoriaChave: 'autocontrole',
      faixaEtaria: '6-10 anos',
      descricao: 'Treina o controle de impulsos e controle inibitório por meio de instruções rápidas e comandos reversos.',
      emoji: '👤',
      cor: '#4c35bd'
    },
    {
      id: 'jogo_memoria',
      titulo: 'Jogo de Memória',
      categoria: 'Memória operacional',
      categoriaChave: 'funcoes',
      faixaEtaria: '5-12 anos',
      descricao: 'Clássico jogo da memória de virar cartas pareadas para fortalecer a retenção de dados e foco.',
      emoji: '🧩',
      cor: '#0d9488'
    },
    {
      id: 'memoria_tatica',
      titulo: 'Memória Tática',
      categoria: 'Memória operacional visual',
      categoriaChave: 'funcoes',
      faixaEtaria: '6-12 anos',
      descricao: 'Desafia o paciente a memorizar uma grade de arquivos, identificar qual deles desapareceu e encontrá-lo.',
      emoji: '📂',
      cor: '#0e7490'
    },
    {
      id: 'mente_flexivel',
      titulo: 'Mente Flexível',
      categoria: 'Flexibilidade cognitiva',
      categoriaChave: 'funcoes',
      faixaEtaria: '8-14 anos',
      descricao: 'Estimula a capacidade de trocar de regras e se adaptar a novos cenários no meio da atividade.',
      emoji: '🔀',
      cor: '#2563eb'
    },
    {
      id: 'foguete',
      titulo: 'Foguete do Foco',
      categoria: 'Atenção sustentada',
      categoriaChave: 'atencao',
      faixaEtaria: '6-12 anos',
      descricao: 'Mantém o paciente concentrado guiando um foguete desviando de meteoros (distratores de atenção).',
      emoji: '🚀',
      cor: '#f59e0b'
    },
    {
      id: 'decisao_pressao',
      titulo: 'Decisão Sob Pressão',
      categoria: 'Controle de impulsos',
      categoriaChave: 'autocontrole',
      faixaEtaria: '8-15 anos',
      descricao: 'O paciente deve controlar a impulsividade e agir sob tempo limite com foco e calma.',
      emoji: '⏳',
      cor: '#1e3a8a'
    },
    {
      id: 'investigacao',
      titulo: 'Investigação',
      categoria: 'Memória verbal',
      categoriaChave: 'funcoes',
      faixaEtaria: '7-12 anos',
      descricao: 'Mistério lógico onde o paciente deve memorizar depoimentos textuais e responder perguntas de compreensão.',
      emoji: '🕵️',
      cor: '#78350f'
    },
    {
      id: 'modo_piloto',
      titulo: 'Modo Piloto',
      categoria: 'Relaxamento e Foco',
      categoriaChave: 'atencao',
      faixaEtaria: '6-12 anos',
      descricao: 'Checklist interativo de desaceleração guiada para momentos de alta ansiedade ou agitação.',
      emoji: '✈️',
      cor: '#4338ca'
    },
    {
      id: 'laboratorio_mental',
      titulo: 'Laboratório Mental',
      categoria: 'Flexibilidade cognitiva',
      categoriaChave: 'funcoes',
      faixaEtaria: '8-14 anos',
      descricao: 'Formação de anagramas e palavras dinâmicas para exercitar o raciocínio rápido e verbal.',
      emoji: '🧪',
      cor: '#06b6d4'
    },
    {
      id: 'shark_mind',
      titulo: 'Shark Mind',
      categoria: 'Comunicação e Criatividade',
      categoriaChave: 'regulacao',
      faixaEtaria: '9-15 anos',
      descricao: 'Treina argumentação, expressão verbal e autoafirmação através de pitchs criativos.',
      emoji: '🦈',
      cor: '#ea580c'
    },
    {
      id: 'universos_paralelos',
      titulo: 'Universos Paralelos',
      categoria: 'Cognição hipotética',
      categoriaChave: 'funcoes',
      faixaEtaria: '8-14 anos',
      descricao: 'Explora a solução de problemas em cenários hipotéticos e resolução criativa de conflitos.',
      emoji: '🌌',
      cor: '#b91c1c'
    },
    {
      id: 'reacao_zero',
      titulo: 'Reação Zero',
      categoria: 'Controle inibitório motor',
      categoriaChave: 'autocontrole',
      faixaEtaria: '6-12 anos',
      descricao: 'Reagir rapidamente a estímulos válidos e congelar ações em distratores visuais rápidos.',
      emoji: '⚡',
      cor: '#0d9488'
    },
    {
      id: 'detetive',
      titulo: 'Detetive dos Pensamentos',
      categoria: 'Reestruturação cognitiva',
      categoriaChave: 'regulacao',
      faixaEtaria: '7-15 anos',
      descricao: 'Desafia o paciente a identificar pensamentos automáticos disfuncionais e propor reestruturações realistas.',
      emoji: '🔍',
      cor: '#0f766e'
    },
    {
      id: 'tribunal',
      titulo: 'Tribunal dos Pensamentos',
      categoria: 'Questionamento socrático',
      categoriaChave: 'regulacao',
      faixaEtaria: '8-15 anos',
      descricao: 'Ensina o paciente a julgar seus próprios pensamentos com base em evidências contra e a favor.',
      emoji: '⚖️',
      cor: '#4f46e5'
    },
    {
      id: 'gatilhos',
      titulo: 'Caçador de Gatilhos',
      categoria: 'Automonitoramento',
      categoriaChave: 'regulacao',
      faixaEtaria: '7-12 anos',
      descricao: 'Identificar gatilhos situacionais e reações corporais associados a episódios de raiva ou ansiedade.',
      emoji: '📡',
      cor: '#be123c'
    },
    {
      id: 'coragem',
      titulo: 'Missão Coragem',
      categoria: 'Exposição gradual',
      categoriaChave: 'autocontrole',
      faixaEtaria: '6-14 anos',
      descricao: 'Enfrentar medos de forma controlada através de passos de exposição desenhados terapeuticamente.',
      emoji: '🛡️',
      cor: '#b45309'
    },
    {
      id: 'monstro',
      titulo: 'O Monstro da Ansiedade',
      categoria: 'Externalização da ansiedade',
      categoriaChave: 'regulacao',
      faixaEtaria: '5-11 anos',
      descricao: 'Ajudar a criança a desenhar, batizar e externalizar sua ansiedade em formato de monstrinho tratável.',
      emoji: '👾',
      cor: '#6d28d9'
    },
    {
      id: 'ilha',
      titulo: 'Ilha das Emoções',
      categoria: 'Identificação emocional',
      categoriaChave: 'regulacao',
      faixaEtaria: '6-12 anos',
      descricao: 'Navegar por regiões correspondentes às emoções básicas para classificar sentimentos do dia a dia.',
      emoji: '🌴',
      cor: '#047857'
    },
    {
      id: 'sabotadores',
      titulo: 'Cartas dos Sabotadores',
      categoria: 'Identificação de sabotadores',
      categoriaChave: 'autocontrole',
      faixaEtaria: '9-15 anos',
      descricao: 'Módulo de identificação de comportamentos sabotadores (Crítico, Esquivo, Hiper-vigilante).',
      emoji: '🃏',
      cor: '#be185d'
    },
    {
      id: 'escape',
      titulo: 'Escape Room Terapêutico',
      categoria: 'Identificação de distorções',
      categoriaChave: 'funcoes',
      faixaEtaria: '9-15 anos',
      descricao: 'Decifrar enigmas identificando distorções cognitivas clássicas em diálogos de personagens.',
      emoji: '🚪',
      cor: '#374151'
    },
    {
      id: 'heroi',
      titulo: 'Jornada do Herói Interior',
      categoria: 'Autoconhecimento',
      categoriaChave: 'regulacao',
      faixaEtaria: '8-15 anos',
      descricao: 'Escrever metas, virtudes e pontos fortes no formato de uma jornada épica de evolução pessoal.',
      emoji: 'Compass',
      cor: '#1d4ed8'
    }
  ];

  filteredJogos = this.jogos;

  filtrarCategoria(cat: string) {
    this.activeCategory = cat;
    if (cat === 'todos') {
      this.filteredJogos = this.jogos;
    } else {
      this.filteredJogos = this.jogos.filter(j => j.categoriaChave === cat);
    }
  }
}
