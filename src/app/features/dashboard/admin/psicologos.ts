import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../core/services/app-data.service';

@Component({
  selector: 'app-admin-psicologos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './psicologos.html',
  styleUrl: './psicologos.scss'
})
export class AdminPsicologos implements OnInit {
  psicologos: any[] = [];
  filteredPsicologos: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  filterStatus: string = 'todos'; // 'todos', 'ativos', 'pendentes'

  // Modal de cadastro
  isRegisterModalOpen: boolean = false;
  nome: string = '';
  email: string = '';
  senhaHash: string = 'Msteps@123'; // Senha padrão para criação administrativa
  telefone: string = '';
  crp: string = '';
  bio: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private dataService: AppDataService) {}

  ngOnInit(): void {
    this.carregarPsicologos();
  }

  carregarPsicologos() {
    this.loading = true;
    this.dataService.getPsicologos().subscribe({
      next: (data) => {
        this.psicologos = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        // Mock fallback se a API estiver inacessível
        this.psicologos = [
          { id: '1', usuario: { nome: 'Juliana Martins', email: 'juliana@psi.com.br', telefone: '(11) 98888-7777', ativo: true }, crp: '06/12345', aprovado: true, plano: 'Profissional' },
          { id: '2', usuario: { nome: 'Carlos Andrade', email: 'carlos@psi.com.br', telefone: '(21) 97777-6666', ativo: true }, crp: '05/56789', aprovado: true, plano: 'Essencial' },
          { id: '3', usuario: { nome: 'Beatriz Nunes', email: 'beatriz@psi.com.br', telefone: '(19) 96666-5555', ativo: false }, crp: '06/67890', aprovado: false, plano: 'Starter' }
        ];
        this.applyFilter();
      }
    });
  }

  applyFilter() {
    let list = this.psicologos;

    // Busca por termo
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(p => 
        p.usuario?.nome?.toLowerCase().includes(term) ||
        p.usuario?.email?.toLowerCase().includes(term) ||
        p.crp?.toLowerCase().includes(term)
      );
    }

    // Filtro de status
    if (this.filterStatus === 'ativos') {
      list = list.filter(p => p.aprovado && p.usuario?.ativo);
    } else if (this.filterStatus === 'pendentes') {
      list = list.filter(p => !p.aprovado);
    }

    this.filteredPsicologos = list;
  }

  aprovar(id: string) {
    this.dataService.aprovarPsicologo(id).subscribe({
      next: () => {
        this.carregarPsicologos();
      },
      error: (err) => {
        console.error('Erro ao aprovar:', err);
        // Fallback local para testes
        const psi = this.psicologos.find(p => p.id === id);
        if (psi) psi.aprovado = true;
        this.applyFilter();
      }
    });
  }

  reprovar(id: string) {
    this.dataService.reprovarPsicologo(id).subscribe({
      next: () => {
        this.carregarPsicologos();
      },
      error: (err) => {
        console.error('Erro ao reprovar:', err);
        // Fallback local
        this.psicologos = this.psicologos.filter(p => p.id !== id);
        this.applyFilter();
      }
    });
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
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      nome: this.nome,
      email: this.email,
      senha: this.senhaHash,
      telefone: this.telefone,
      crp: this.crp,
      bio: this.bio
    };

    // A API expõe a rota POST /api/psicologos para criação administrava
    this.dataService.criarPsicologo(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Psicólogo cadastrado com sucesso!';
        this.carregarPsicologos();
        setTimeout(() => this.closeRegisterModal(), 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Ocorreu um erro ao realizar o cadastro.';
        console.error(err);
      }
    });
  }

  resetForm() {
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.crp = '';
    this.bio = '';
  }
}
