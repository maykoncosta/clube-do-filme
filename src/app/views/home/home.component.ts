import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, Auth } from '@angular/fire/auth';

import { MovieService } from 'src/app/core/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  movies: any[] = [];
  displayName: string | null = null;

  constructor(private movieService: MovieService,
    private auth: Auth, 
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
        console.error('Erro ao carregar filmes', err);
      }
    });
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.displayName = user.displayName;
      }
    });
  }

  navigateToLogin(): void {
    window.location.href = '/login';
  }
  navigateToCreateGroup(): void {
    window.location.href = '/criar-grupo';
  }
}
