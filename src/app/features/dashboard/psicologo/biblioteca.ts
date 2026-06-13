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
      categoriaChave: 'funcoes',
      faixaEtaria: '6-10 anos',
      descricao: 'Treina o controle de impulsos e controle inibitório por meio de instruções rápidas e comandos reversos.',
      emoji: '👤',
      cor: '#4c35bd'
    },
    {
      id: 'detetive',
      titulo: 'Detetive da Memória',
      categoria: 'Memória operacional',
      categoriaChave: 'funcoes',
      faixaEtaria: '7-12 anos',
      descricao: 'Desafia o paciente a memorizar sequências lógicas de estímulos para fortalecer a retenção de dados temporários.',
      emoji: '🔍',
      cor: '#0eb594'
    },
    {
      id: 'mudanca',
      titulo: 'Mudança de Planos',
      categoria: 'Flexibilidade cognitiva',
      categoriaChave: 'funcoes',
      faixaEtaria: '8-14 anos',
      descricao: 'Estimula a capacidade de trocar de regras e se adaptar a novos cenários no meio da atividade clínica.',
      emoji: '🔀',
      cor: '#2563eb'
    },
    {
      id: 'foguete',
      titulo: 'Foguete do Foco',
      categoria: 'Tomada de decisão / Atenção',
      categoriaChave: 'atencao',
      faixaEtaria: '6-12 anos',
      descricao: 'Mantém o paciente concentrado guiando um foguete desviando de meteoros (distratores de atenção).',
      emoji: '🚀',
      cor: '#f59e0b'
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
