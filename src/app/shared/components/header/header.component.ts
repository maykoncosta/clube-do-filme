import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isHome: boolean = false;
  isMenuActive: boolean = false; // Controle da visibilidade do menu

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/home' || this.router.url === '/';
    });
  }

  goBack() {
    window.history.back();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive; // Alterna a visibilidade do menu
  }

  goTo(route: string) {
    this.router.navigate([route]);
    this.isMenuActive = false; // Fecha o menu após a navegação
  }
}
