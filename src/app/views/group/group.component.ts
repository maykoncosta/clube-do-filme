// group.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { GroupService } from 'src/app/core/services/group.service';
import { MessageService } from 'src/app/core/services/message.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id')!;
    this.inviteLink = `${window.location.origin}/convite/${this.groupId}`;
    this.loadGroup();
    this.getCurrentUser();
  }

  async loadGroup() {
    try {
      this.groupData = await this.groupService.getGroupWithDetails(this.groupId);
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
  }
}
