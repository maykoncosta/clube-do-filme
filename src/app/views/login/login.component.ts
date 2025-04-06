import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onLogin() {
    this.loading = true;
    this.authService.login(this.email, this.password)
      .then(() => {
        this.loading = false;
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        console.log('Redirect:', redirect);
        if (redirect) {
          this.router.navigate([`/${redirect}`]);
        } else {
          this.router.navigate(['/home']);
        }
      })
      .catch(err => {
        this.loading = false;
        this.errorMessage = 'Email ou senha inválidos.';
      });
  }
}
