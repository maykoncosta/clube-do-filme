import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  groupId!: string;
  groupData: any;
  isLoading = true;
  joinError: string = '';

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id')!;
    try {
      this.groupData = await this.groupService.getGroupById(this.groupId); // vamos criar esse método
    } catch (err) {
      this.joinError = 'Grupo não encontrado.';
    } finally {
      this.isLoading = false;
    }
  }

  async joinGroup() {
    try {
      await this.groupService.joinGroup(this.groupId);
      this.router.navigate(['/grupo', this.groupId]);
    } catch (err) {
      this.joinError = 'Erro ao entrar no grupo.';
      console.error(err);
    }
  }
}
