import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService) {}

  onLogin() {
    this.loading = true;
    this.authService.login(this.email, this.password)
      .then(() => this.loading = false)
      .catch(err => {
        this.loading = false;
        this.errorMessage = 'Email ou senha inválidos.';
      });
  }
  
}
