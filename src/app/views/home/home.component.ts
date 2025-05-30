import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { MovieService } from 'src/app/core/services/movie.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies: any[] = [];
  displayName: string | null = null;

  constructor(
    private movieService: MovieService,
    private auth: Auth,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.movies = data.results.map((movie: any) => ({
          title: movie.title,
          image: `https://image.tmdb.org/t/p/original${movie.poster_path}`
        }));
      },
      error: (err) => {
        this.messageService.error('Erro ao carregar filmes.');
      }
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.displayName = user.displayName;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToCreateGroup(): void {
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.router.navigate(['/criar-grupo']);
      } else {
        this.router.navigate(['/login'], {
          queryParams: { redirect: 'criar-grupo' }
        });
      }
    });
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.displayName = null;
      this.router.navigate(['/home']);
      this.messageService.success('Logout realizado com sucesso!');
    }).catch(err => {
      this.messageService.error('Erro ao fazer logout.');
    });
  }

  navigateToGroups(): void {
    this.router.navigate(['/meus-grupos']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/perfil']);
  }
  
  isAuthenticated(): boolean {
    let authenticated = false;
    this.authService.isAuthenticated().subscribe(user => {
      authenticated = !!user;
    });
    return authenticated;
  }
}
