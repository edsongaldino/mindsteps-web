import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppDataService } from '../../../core/services/app-data.service';

@Component({
  selector: 'app-psicologo-mensagens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mensagens.html',
  styleUrl: './mensagens.scss'
})
export class PsicologoMensagens implements OnInit {
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  pacientes: any[] = [];
  selectedPaciente: any = null;
  mensagens: any[] = [];
  novoTexto: string = '';
  loadingPacientes: boolean = true;
  loadingMensagens: boolean = false;
  psicologoId: string = '';

  constructor(private dataService: AppDataService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.psicologoId = localStorage.getItem('psicologoId') || '';
      if (this.psicologoId) {
        this.carregarPacientes();
      } else {
        this.dataService.getMe().subscribe({
          next: (me) => {
            this.psicologoId = me.psicologoId || '';
            if (this.psicologoId) {
              localStorage.setItem('psicologoId', this.psicologoId);
              this.carregarPacientes();
            } else {
              this.loadingPacientes = false;
            }
          },
          error: () => {
            this.loadingPacientes = false;
          }
        });
      }
    } else {
      this.loadingPacientes = false;
    }
  }

  carregarPacientes() {
    this.loadingPacientes = true;
    this.dataService.getPacientesPorPsicologo(this.psicologoId).subscribe({
      next: (data) => {
        this.pacientes = data;
        this.loadingPacientes = false;
        
        if (this.pacientes.length > 0) {
          this.selecionarPaciente(this.pacientes[0]);
        }
      },
      error: () => {
        // Fallback mock patients list
        this.pacientes = [
          { id: '847c5798-8265-4e73-8f74-a199da5cb8cc', nome: 'Lucas Oliveira', usuario: { nome: 'Lucas Oliveira' } },
          { id: '2', nome: 'Maria Eduarda', usuario: { nome: 'Maria Eduarda' } }
        ];
        this.loadingPacientes = false;
        this.selecionarPaciente(this.pacientes[0]);
      }
    });
  }

  selecionarPaciente(paciente: any) {
    this.selectedPaciente = paciente;
    this.loadingMensagens = true;
    this.mensagens = [];

    this.dataService.getMensagensPaciente(paciente.id).subscribe({
      next: (data) => {
        this.mensagens = data;
        this.loadingMensagens = false;
        this.scrollChatParaBaixo();
      },
      error: () => {
        this.loadingMensagens = false;
        // Fallback mock chat history
        this.mensagens = [
          { id: 'm1', remetentePerfil: 'Psicologo', conteudo: 'Olá, Lucas! Conseguiu fazer o check-in de sentimentos hoje?', dataEnvio: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
          { id: 'm2', remetentePerfil: 'Paciente', conteudo: 'Olá! Consegui sim, registrei que estava um pouco ansioso antes da aula de natação.', dataEnvio: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
          { id: 'm3', remetentePerfil: 'Psicologo', conteudo: 'Muito bem, percebi os dados no painel. Vamos trabalhar nisso na nossa próxima sessão de sexta-feira.', dataEnvio: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() }
        ];
        this.scrollChatParaBaixo();
      }
    });
  }

  enviar() {
    if (!this.novoTexto.trim() || !this.selectedPaciente) return;

    const texto = this.novoTexto;
    this.novoTexto = '';

    // Adiciona localmente imediatamente para UX fluida
    const msgLocal = {
      id: Math.random().toString(),
      remetentePerfil: 'Psicologo',
      conteudo: texto,
      dataEnvio: new Date().toISOString()
    };
    this.mensagens.push(msgLocal);
    this.scrollChatParaBaixo();

    this.dataService.enviarMensagem(this.selectedPaciente.id, texto).subscribe({
      error: () => {
        console.warn('Erro no envio via API (usando fallback local)');
      }
    });
  }

  private scrollChatParaBaixo(): void {
    setTimeout(() => {
      try {
        if (this.chatScrollContainer) {
          this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
        }
      } catch (err) {}
    }, 50);
  }
}
