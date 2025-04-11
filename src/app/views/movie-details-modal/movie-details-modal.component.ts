import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MovieService } from 'src/app/core/services/movie.service';

@Component({
  selector: 'app-movie-details-modal',
  templateUrl: './movie-details-modal.component.html',
  styleUrls: ['./movie-details-modal.component.css']
})
export class MovieDetailsModalComponent implements OnInit {
  @Input() movieId!: number;
  @Output() closed = new EventEmitter<void>();

  movie: any;
  loading = true;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.loadDetails();
  }

  async loadDetails() {
    this.loading = true;
    this.movie = await this.movieService.getMovieDetails(this.movieId).subscribe(
      (data) => {
        this.movie = data;
      },
      (error) => {
        console.error('Error loading movie details:', error);
        this.movie = null;
      }
    );
    this.loading = false;
  }

  close() {
    this.closed.emit();
  }
}
