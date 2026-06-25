import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro implements OnInit {
  step: number = 1;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  isMobileMenuOpen: boolean = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  voltarHome(section?: string) {
    this.isMobileMenuOpen = false;
    if (section) {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el = document.getElementById(section);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  // Step 1 Form Data
  nome: string = '';
  email: string = '';
  crp: string = '';
  senha: string = '';
  confirmarSenha: string = '';

  // Step 2 Form Data
  documento: string = ''; // CPF ou CNPJ
  telefone: string = '';

  // Step 3 Form Data
  planoSelecionado: string = 'Profissional'; // Starter, Essencial, Profissional
  planos = [
    {
      id: 'Starter',
      name: 'Starter',
      preco: '39,90',
      recursos: [
        'Até 5 pacientes',
        'App para pacientes',
        'Diário emocional',
        'Jogos terapêuticos básicos',
        'Relatórios simples',
        'Suporte por e-mail'
      ]
    },
    {
      id: 'Essencial',
      name: 'Essencial',
      preco: '89',
      destaque: true,
      recursos: [
        'Até 20 pacientes',
        'Tudo do Starter',
        'Todos os jogos (completos)',
        'Relatórios básicos',
        'Painel de evolução',
        'Suporte prioritário'
      ]
    },
    {
      id: 'Profissional',
      name: 'Profissional',
      preco: '149',
      recursos: [
        'Pacientes ilimitados',
        'Indicadores avançados',
        'Exportação de relatórios em PDF',
        'Relatórios e Insights por IA',
        'Prioridade no suporte VIP'
      ]
    }
  ];

  // Step 4 (Payment details returned from API)
  paymentUrl: string = '';
  pixCopyPaste: string = '';
  pixCopiado: boolean = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const plano = params['plano'];
      if (plano) {
        const match = this.planos.find(p => p.id.toLowerCase() === plano.toLowerCase() || p.name.toLowerCase() === plano.toLowerCase());
        if (match) {
          this.planoSelecionado = match.id;
        }
      }
    });
  }

  onDocumentoInput(event: any) {
    let val = event.target.value.replace(/\D/g, '');
    val = val.substring(0, 14);
    
    if (val.length <= 11) {
      val = val.replace(/(\d{3})(\d)/, '$1.$2');
      val = val.replace(/(\d{3})(\d)/, '$1.$2');
      val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      val = val.replace(/^(\d{2})(\d)/, '$1.$2');
      val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      val = val.replace(/\.(\d{3})(\d)/, '.$1/$2');
      val = val.replace(/(\d{4})(\d)/, '$1-$2');
    }
    this.documento = val;
  }

  onTelefoneInput(event: any) {
    let val = event.target.value.replace(/\D/g, '');
    val = val.substring(0, 11);
    if (val.length > 2) {
      val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
    }
    if (val.length > 9) {
      val = `${val.substring(0, 9)}-${val.substring(9)}`;
    }
    this.telefone = val;
  }

  nextStep() {
    this.errorMessage = '';

    if (this.step === 1) {
      if (!this.nome || !this.email || !this.crp || !this.senha || !this.confirmarSenha) {
        this.errorMessage = 'Por favor, preencha todos os campos.';
        return;
      }
      if (this.senha !== this.confirmarSenha) {
        this.errorMessage = 'As senhas não conferem.';
        return;
      }
      if (this.senha.length < 6) {
        this.errorMessage = 'A senha precisa ter pelo menos 6 caracteres.';
        return;
      }
      this.step = 2;
    } else if (this.step === 2) {
      const cleanDoc = this.documento.replace(/\D/g, '');
      if (cleanDoc.length !== 11 && cleanDoc.length !== 14) {
        this.errorMessage = 'Por favor, insira um CPF ou CNPJ válido.';
        return;
      }
      if (!this.telefone) {
        this.errorMessage = 'Por favor, insira o seu telefone.';
        return;
      }
      this.step = 3;
    }
    this.cdr.markForCheck();
  }

  prevStep() {
    this.errorMessage = '';
    if (this.step > 1) {
      this.step--;
    }
    this.cdr.markForCheck();
  }

  selecionarPlano(planoId: string) {
    this.planoSelecionado = planoId;
    this.cdr.markForCheck();
  }

  finalizarCadastro() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const payload = {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone.replace(/\D/g, ''),
      senha: this.senha,
      crp: this.crp,
      documento: this.documento.replace(/\D/g, ''),
      plano: this.planoSelecionado
    };

    this.auth.registrarPsicologo(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.paymentUrl = response.paymentUrl || '';
        this.pixCopyPaste = response.pixCopyPaste || '';
        this.step = 4; // Ir para tela de pagamento/PIX
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Falha ao realizar cadastro. Tente novamente.';
        this.cdr.markForCheck();
      }
    });
  }

  copiarPix() {
    if (navigator.clipboard && this.pixCopyPaste) {
      navigator.clipboard.writeText(this.pixCopyPaste).then(() => {
        this.pixCopiado = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.pixCopiado = false;
          this.cdr.markForCheck();
        }, 3000);
      });
    }
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }
}
