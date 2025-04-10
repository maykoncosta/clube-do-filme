import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  onLogin() {
    this.loading = true;
    this.authService.login(this.email, this.password)
      .then(() => {
        this.loading = false;
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        const pendingGroupId = localStorage.getItem('pendingGroupId');
        if (redirect) {
          this.router.navigate([`/${redirect}`]).then(() => {
            this.router.navigate([], {
              queryParams: { redirect: null },
              queryParamsHandling: 'merge'
            });
          });
        } else if (pendingGroupId) {
          localStorage.removeItem('pendingGroupId');
          this.router.navigate(['/grupo', pendingGroupId]);
        } else {
          this.router.navigate(['/home']);
        }
        this.messageService.success('Login feito com sucesso!');
      })
      .catch(err => {
        this.loading = false;
        this.messageService.error('Erro ao fazer login. Tente novamente.');
      });
  }
}
