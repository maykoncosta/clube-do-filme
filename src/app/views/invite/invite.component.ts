import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  groupId!: string;
  groupData: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id')!;
    try {
      this.groupData = await this.groupService.getGroupById(this.groupId);
    } catch (err) {
      this.messageService.error('Grupo não encontrado.');
    } finally {
      this.isLoading = false;
    }
  }

  async joinGroup() {
    try {
      const user = await this.authService.getCurrentUser();

      if (!user) {
        localStorage.setItem('pendingGroupId', this.groupId);
        this.router.navigate(['/login']);
        return;
      }

      await this.groupService.joinGroup(this.groupId);
      this.messageService.success('Você entrou no grupo com sucesso!');
      this.router.navigate(['/grupo', this.groupId]);
    } catch (err) {
      this.messageService.error('Grupo não encontrado.');
      console.error(err);
    }
  }
}
