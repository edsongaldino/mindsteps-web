import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppDataService } from '../../../core/services/app-data.service';

@Component({
  selector: 'app-psicologo-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.scss'
})
export class PsicologoPacientes implements OnInit {
  pacientes: any[] = [];
  filteredPacientes: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  filterStatus: string = 'todos'; // 'todos', 'ativos', 'atencao'
  psicologoId: string = '';

  // Modal de cadastro
  isRegisterModalOpen: boolean = false;
  nome: string = '';
  email: string = '';
  senhaHash: string = 'MstepsPac@123'; // Senha padrão de acesso inicial
  telefone: string = '';
  dataNascimento: string = '';
  genero: string = 'Masculino';
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private dataService: AppDataService, private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.psicologoId = localStorage.getItem('psicologoId') || '';
      
      if (this.psicologoId) {
        this.carregarPacientes(this.psicologoId);
      } else {
        this.dataService.getMe().subscribe({
          next: (me) => {
            this.psicologoId = me.psicologoId || '';
            if (this.psicologoId) {
              localStorage.setItem('psicologoId', this.psicologoId);
              this.carregarPacientes(this.psicologoId);
            } else {
              this.loading = false;
            }
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    } else {
      this.loading = false;
    }
  }

  carregarPacientes(psicologoId: string) {
    this.loading = true;
    this.dataService.getPacientesPorPsicologo(psicologoId).subscribe({
      next: (data) => {
        this.pacientes = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        // Fallback mock
        this.pacientes = [
          { id: '847c5798-8265-4e73-8f74-a199da5cb8cc', usuario: { nome: 'Lucas Oliveira', email: 'lucas@gmail.com', ativo: true }, idade: 14, ultimaAtividade: 'Hoje, 14:32', engajamento: 92, status: 'Ativo' },
          { id: '2', usuario: { nome: 'Maria Eduarda', email: 'madu@gmail.com', ativo: true }, idade: 13, ultimaAtividade: 'Hoje, 11:10', engajamento: 89, status: 'Ativo' },
          { id: '3', usuario: { nome: 'João Pedro', email: 'joao@gmail.com', ativo: true }, idade: 15, ultimaAtividade: 'Ontem, 18:45', engajamento: 74, status: 'Ativo' },
          { id: '4', usuario: { nome: 'Ana Clara', email: 'anaclara@gmail.com', ativo: true }, idade: 13, ultimaAtividade: 'Ontem, 16:20', engajamento: 81, status: 'Ativo' },
          { id: '5', usuario: { nome: 'Pedro Silva', email: 'pedro@gmail.com', ativo: true }, idade: 14, ultimaAtividade: '2 dias atrás', engajamento: 57, status: 'Atenção' },
          { id: '6', usuario: { nome: 'Beatriz Lima', email: 'beatriz@gmail.com', ativo: true }, idade: 13, ultimaAtividade: '3 dias atrás', engajamento: 61, status: 'Atenção' }
        ];
        this.applyFilter();
      }
    });
  }

  applyFilter() {
    let list = this.pacientes;

    // Busca por termo
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(p => 
        (p.nome || p.usuario?.nome || '').toLowerCase().includes(term) ||
        (p.email || p.usuario?.email || '').toLowerCase().includes(term)
      );
    }

    // Filtro de status
    if (this.filterStatus === 'ativos') {
      list = list.filter(p => p.status === 'Ativo' || p.engajamento >= 70);
    } else if (this.filterStatus === 'atencao') {
      list = list.filter(p => p.status === 'Atenção' || p.engajamento < 70);
    }

    this.filteredPacientes = list;
  }

  verPaciente(id: string) {
    this.router.navigate([`/dashboard/psicologo/pacientes/${id}`]);
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
    this.resetForm();
  }

  cadastrar() {
    if (!this.psicologoId) {
      this.errorMessage = 'Sessão inválida. Por favor re-faça login.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      psicologoId: this.psicologoId,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      senha: this.senhaHash,
      dataNascimento: this.dataNascimento ? new Date(this.dataNascimento) : null,
      genero: this.genero
    };

    this.dataService.criarPaciente(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Paciente cadastrado com sucesso!';
        this.carregarPacientes(this.psicologoId);
        setTimeout(() => this.closeRegisterModal(), 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Ocorreu um erro ao cadastrar o paciente.';
        console.error(err);
      }
    });
  }

  resetForm() {
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.dataNascimento = '';
    this.genero = 'Masculino';
  }
}
