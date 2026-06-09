import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-planos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planos.html',
  styleUrl: './planos.scss'
})
export class AdminPlanos {
  planos = [
    {
      nome: 'Essencial',
      preco: 59,
      pacientes: 'Até 10 pacientes',
      jogos: 'Atividades limitadas',
      suporte: 'Suporte por e-mail',
      destaque: false
    },
    {
      nome: 'Profissional',
      preco: 99,
      pacientes: 'Até 100 pacientes',
      jogos: 'Relatórios avançados',
      suporte: 'Suporte prioritário',
      destaque: true
    },
    {
      nome: 'Avançado',
      preco: 149,
      pacientes: 'Pacientes ilimitados',
      jogos: 'Indicadores inteligentes',
      suporte: 'Suporte prioridade máxima',
      destaque: false
    }
  ];

  assinaturasRecentes = [
    { nome: 'Adriana Martins', plano: 'Profissional', valor: 99.00, proximaCobranca: '30/06/2026', status: 'Ativo' },
    { nome: 'Carlos Andrade', plano: 'Essencial', valor: 59.00, proximaCobranca: '28/06/2026', status: 'Ativo' },
    { nome: 'Marina Souza', plano: 'Profissional', valor: 99.00, proximaCobranca: '15/06/2026', status: 'Pendente' }
  ];
}
