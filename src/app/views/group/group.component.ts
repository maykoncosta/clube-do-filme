// group.component.ts
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { GroupService } from 'src/app/core/services/group.service';
import { MessageService } from 'src/app/core/services/message.service';
import { MovieService } from 'src/app/core/services/movie.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groupId!: string;
  groupData: any;
  isLoading = true;
  inviteLink: string = '';
  copied = false;
  currentUser: any;
  userUid: any;
  recommendedMovies: any[] = [];
  showDeleteModal = false;
  memberToRemove: string | any = null;
  selectedMovieId: number | any = null;
  showMovieModal = false;
  currentMovieIndex: number = 0; // Para manter o controle do índice de filmes visíveis
  MOVIES_PER_SCROLL = 5;

  @ViewChild('movieCarousel', { static: false }) movieCarousel!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService,
    private messageService: MessageService,
    private movieService: MovieService,
  ) { }

  async ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id')!;
    this.inviteLink = `${window.location.origin}/convite/${this.groupId}`;
    this.getCurrentUser();
    this.loadGroup();
    await this.loadMockRecommendations();
  }

  async loadGroup() {
    try {
      this.groupData = await this.groupService.getGroupWithDetails(this.groupId)
    } catch (err) {
      this.router.navigate(['/home']);
      this.messageService.error('Grupo não encontrado.');
    } finally {
      this.isLoading = false;
    }
  }

  copyInviteLink() {
    navigator.clipboard.writeText(this.inviteLink).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  private getCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();

    this.userUid = this.currentUser?.__zone_symbol__value.uid;
  }

  async loadMockRecommendations() {
    try {
      const response: any = await this.movieService.getPopularMovies().toPromise();
      this.recommendedMovies = response.results;
    } catch (error) {
      console.error('Erro ao carregar recomendações mock:', error);
    }
  }

  openDeleteModal(memberId: string) {
    this.memberToRemove = memberId;
    this.showDeleteModal = true;
  }

  async removeMember() {
    try {
      await this.groupService.removeMember(this.groupId, this.memberToRemove);
      this.groupData.members = this.groupData.members.filter((m: any) => m.uid !== this.memberToRemove);
      this.messageService.success('Membro removido com sucesso.');
    } catch (err) {
      this.messageService.error('Erro ao remover membro.');
    }
    this.showDeleteModal = false;
    this.memberToRemove = null;
  }

  openMovieModal(movieId: number) {
    this.selectedMovieId = movieId;
    this.showMovieModal = true;
  }

  closeMovieModal() {
    this.showMovieModal = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    // Verifica se o usuário rolou até o final da lista para carregar mais filmes
    const container = this.movieCarousel.nativeElement;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;

    if (isAtEnd) {
      this.loadMoreMovies();
    }
  }

  loadMoreMovies() {
    if (this.recommendedMovies.length < 50) {
      this.currentMovieIndex += this.MOVIES_PER_SCROLL;
      this.loadMockRecommendations();
    }
  }

  scrollMovies(direction: number) {
    if (direction === 1) {
      this.currentMovieIndex = Math.min(this.recommendedMovies.length - this.MOVIES_PER_SCROLL, this.currentMovieIndex + this.MOVIES_PER_SCROLL);
    } else if (direction === -1) {
      this.currentMovieIndex = Math.max(0, this.currentMovieIndex - this.MOVIES_PER_SCROLL);
    }
  }

}
