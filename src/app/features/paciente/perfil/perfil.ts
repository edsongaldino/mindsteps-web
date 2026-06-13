import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PacienteService } from '../../../core/services/paciente.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil implements OnInit {
  carregando = true;
  subindoFoto = false;
  me: any = null;
  avatarUrl = '';

  // Modals/Drawers toggle state
  modalDadosAtivo = false;
  modalMensagensAtivo = false;
  modalPrivacidadeAtivo = false;
  modalAjudaAtivo = false;

  // Profile Edit fields
  editNome = '';
  editEmail = '';
  editTelefone = '';
  salvandoDados = false;

  // Messages
  mensagens: any[] = [];
  carregandoMensagens = false;

  constructor(
    private service: PacienteService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarPerfil();
  }

  carregarPerfil() {
    this.carregando = true;
    this.cdr.detectChanges();
    this.service.obterMe().subscribe({
      next: (data) => {
        this.me = data;
        this.carregando = false;
        this.atualizarAvatarUrl();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.carregando = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  atualizarAvatarUrl() {
    if (!this.me?.fotoUrl) {
      this.avatarUrl = '';
      return;
    }
    const base = environment.apiUrl.endsWith('/api')
      ? environment.apiUrl.substring(0, environment.apiUrl.length - 4)
      : environment.apiUrl;
    this.avatarUrl = `${base}${this.me.fotoUrl}?v=${Date.now()}`;
  }

  alterarFoto(event: any) {
    const file = event.target.files[0];
    if (!file || !this.me?.usuarioId) return;

    this.subindoFoto = true;
    this.cdr.detectChanges();
    const formData = new FormData();
    formData.append('file', file);

    const url = `${environment.apiUrl}/Usuarios/${this.me.usuarioId}/foto`;

    this.http.post(url, formData).subscribe({
      next: () => {
        this.subindoFoto = false;
        alert('Foto de perfil atualizada com sucesso!');
        this.service.limparCacheMe();
        this.carregarPerfil();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.subindoFoto = false;
        this.cdr.detectChanges();
        alert('Erro ao enviar foto: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }

  abrirMeusDados() {
    this.editNome = this.me.nome || '';
    this.editEmail = this.me.email || '';
    this.editTelefone = this.me.telefone || '';
    this.modalDadosAtivo = true;
  }

  fecharMeusDados() {
    this.modalDadosAtivo = false;
  }

  salvarMeusDados() {
    if (this.editNome.trim() === '' || this.editEmail.trim() === '') return;
    this.salvandoDados = true;
    this.cdr.detectChanges();

    const url = `${environment.apiUrl}/Pacientes/${this.me.pacienteId}`;
    
    this.http.put(url, {
      nome: this.editNome.trim(),
      email: this.editEmail.trim(),
      telefone: this.editTelefone.trim()
    }).subscribe({
      next: () => {
        this.salvandoDados = false;
        this.fecharMeusDados();
        alert('Dados updated com sucesso!');
        this.service.limparCacheMe();
        this.carregarPerfil();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.salvandoDados = false;
        this.cdr.detectChanges();
        alert('Erro ao atualizar dados: ' + (err.error?.message || err.message));
        console.error(err);
      }
    });
  }

  abrirMensagens() {
    this.modalMensagensAtivo = true;
    this.carregarMensagens();
  }

  fecharMensagens() {
    this.modalMensagensAtivo = false;
  }

  carregarMensagens() {
    this.carregandoMensagens = true;
    this.cdr.detectChanges();
    this.service.listarMinhasMensagens().subscribe({
      next: (list) => {
        this.mensagens = list;
        this.carregandoMensagens = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.carregandoMensagens = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  marcarLida(msgId: string) {
    this.service.marcarMensagemComoLida(msgId).subscribe({
      next: () => {
        this.carregarMensagens();
      },
      error: (err) => console.error(err)
    });
  }

  abrirPrivacidade() {
    this.modalPrivacidadeAtivo = true;
  }

  fecharPrivacidade() {
    this.modalPrivacidadeAtivo = false;
  }

  abrirAjuda() {
    this.modalAjudaAtivo = true;
  }

  fecharAjuda() {
    this.modalAjudaAtivo = false;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
