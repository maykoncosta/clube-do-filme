import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  onSignup() {
    this.loading = true;
    this.authService.signUp(this.email, this.password, this.username)
      .then(() => {
        
        const pendingGroupId = localStorage.getItem('pendingGroupId');
        if (pendingGroupId) {
          localStorage.removeItem('pendingGroupId');
          this.router.navigate(['/grupo', pendingGroupId]);
        } else {
          this.router.navigate(['/criar-grupo']); // fallback padrão
        }
        
        this.loading = false;
        this.messageService.success('Cadastro Feito Com Sucesso!');
      })
      .catch((error) => {
        this.loading = false;
        this.messageService.error(this.getFriendlyMessage(error.code || ''));
      });
  }

  private getFriendlyMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está sendo usado.';
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      default:
        return 'Erro ao criar a conta. Tente novamente.';
    }
  }
}
