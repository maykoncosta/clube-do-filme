import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3/movie/popular';
  private bearerToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjM4MWJkODYxMjZlMGE3MzFjMDViMmVhZDQ1NzczZSIsIm5iZiI6MTY1ODA4MzcwMi45NjMsInN1YiI6IjYyZDQ1OTc2ZTkzZTk1MDA0ZjI2MDBiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.--HAvjyAn27JZdt6o5M6MVwXXq3IyXSHO_MphcTjjLY'
  constructor(private http: HttpClient) { }

  getPopularMovies(): Observable<any> {
    const headers = {
      Authorization: `Bearer ${this.bearerToken}`
    };
  
    return this.http.get(`${this.apiUrl}?language=pt-BR&page=1`, { headers });
  }
}
