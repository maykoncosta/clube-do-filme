import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

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

  constructor(private authService: AuthService) {}

  onSignup() {
    this.authService.signUp(this.email, this.password, this.username);
    
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
