import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'https://api.themoviedb.org/3';
  private bearerToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMjM4MWJkODYxMjZlMGE3MzFjMDViMmVhZDQ1NzczZSIsIm5iZiI6MTY1ODA4MzcwMi45NjMsInN1YiI6IjYyZDQ1OTc2ZTkzZTk1MDA0ZjI2MDBiMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.--HAvjyAn27JZdt6o5M6MVwXXq3IyXSHO_MphcTjjLY'
  constructor(private http: HttpClient) { }

  private get headers() {
    return {
      Authorization: `Bearer ${this.bearerToken}`
    };
  }

  getPopularMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/popular?language=pt-BR&page=1`, {
      headers: this.headers
    });
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genre/movie/list?language=pt-BR`, {
      headers: this.headers
    });
  }

  searchActors(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('language', 'pt-BR')
      .set('page', page);
    return this.http.get(`${this.baseUrl}/search/person`, {
      headers: this.headers,
      params
    });
  }
  
  searchMovies(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('language', 'pt-BR')
      .set('page', page);
    return this.http.get(`${this.baseUrl}/search/movie`, {
      headers: this.headers,
      params
    });
  }
  
  searchDirectors(query: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('language', 'pt-BR')
      .set('page', page);
    return this.http.get(`${this.baseUrl}/search/person`, {
      headers: this.headers,
      params
    });
  }
}
