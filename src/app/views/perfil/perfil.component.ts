import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User, UserService } from 'src/app/core/services/user.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { MovieService } from 'src/app/core/services/movie.service';

type PreferenceType = 'genres' | 'actors' | 'directors' | 'movies';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  userData: User | any;
  newName: string = '';
  newAvatar: string = '';
  successMessage: string = '';
  currentPage = 1;
  hasMoreResults = true;
  isLoading = false;

  selectedType: PreferenceType = 'genres';
  preferenceTypes: PreferenceType[] = ['genres', 'actors', 'directors', 'movies'];

  preferenceLabels: Record<PreferenceType, string> = {
    genres: 'Gêneros',
    actors: 'Atores',
    directors: 'Diretores',
    movies: 'Filmes'
  };

  preferences: Record<PreferenceType, any[]> = {
    genres: [],
    actors: [],
    directors: [],
    movies: [],
  };

  search: Record<PreferenceType, string> = {
    genres: '',
    actors: '',
    directors: '',
    movies: '',
  };

  results: Record<PreferenceType, any[]> = {
    genres: [],
    actors: [],
    directors: [],
    movies: [],
  };

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private userService: UserService,
    private auth: Auth,
    private movieService: MovieService
  ) { }

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.userData = await this.userService.getUserData(user.uid);
        this.newName = this.userData?.username;
        this.newAvatar = this.userData?.avatarSeed;

        if (this.userData?.preferences) {
          this.preferences = {
            genres: this.userData.preferences.genres || [],
            actors: this.userData.preferences.actors || [],
            directors: this.userData.preferences.directors || [],
            movies: this.userData.preferences.movies || []
          };
        }

        this.loadResults(this.selectedType, true);
      }
    });
  }

  async updateProfile() {
    const uid = this.auth.currentUser?.uid!;
    const avatarSeed = this.newAvatar || this.userData.avatarSeed;
    const username = this.newName || this.userData.username;

    await this.userService.updateProfile(uid, username, avatarSeed);
    this.successMessage = 'Perfil atualizado com sucesso!';
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  generateRandomSeed() {
    this.newAvatar = Math.random().toString(36).substring(2, 10);
  }

  savePreferences() {
    this.userService.savePreferences(this.userData.uid, this.preferences);
    this.successMessage = 'Preferências salvas com sucesso!';
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  loadResults(type: PreferenceType, reset = false) {
    if (this.isLoading || (!this.hasMoreResults && !reset)) return;

    this.isLoading = true;
    if (reset) {
      this.currentPage = 1;
      this.results[type] = [];
      this.hasMoreResults = true;
    }

    const query = this.search[type];

    if (!query.trim() && type !== 'genres') {
      this.isLoading = false;
      return;
    }

    if (type === 'genres') {
      this.movieService.getGenres().subscribe(data => {
        this.results.genres = data.genres;
        this.hasMoreResults = false;
        this.isLoading = false;
      });
    } else if (type === 'actors') {
      this.movieService.searchActors(query, this.currentPage).subscribe(res => {
        this.results.actors.push(...res.results);
        this.currentPage++;
        this.hasMoreResults = res.results.length >= 10;
        this.isLoading = false;
      });
    } else if (type === 'directors') {
      this.movieService.searchDirectors(query, this.currentPage).subscribe(res => {
        this.results.directors.push(...res);
        this.currentPage++;
        this.hasMoreResults = res.length >= 10;
        this.isLoading = false;
      });
    } else if (type === 'movies') {
      this.movieService.searchMovies(query, this.currentPage).subscribe(res => {
        this.results.movies.push(...res.results);
        this.currentPage++;
        this.hasMoreResults = res.results.length >= 10;
        this.isLoading = false;
      });
    }
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const threshold = 100; // margem inferior para acionar
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + threshold;
  
    if (atBottom) {
      this.loadResults(this.selectedType); // carrega mais resultados
    }
  }

  addPreference(type: PreferenceType, item: any) {
    const exists = this.preferences[type].some(p => p.id === item.id);
    if (!exists) this.preferences[type].push(item);
  }

  removePreference(type: PreferenceType, id: number) {
    this.preferences[type] = this.preferences[type].filter(item => item.id !== id);
  }

  onTypeChange(type: PreferenceType) {
    this.selectedType = type;
    this.search[type] = '';
    this.loadResults(type, true);
  }
}
