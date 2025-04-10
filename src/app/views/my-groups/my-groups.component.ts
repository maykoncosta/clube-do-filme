import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {
  groups: any[] = [];
  loading = true;

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.waitForUserAndLoadGroups();
  }

  private async waitForUserAndLoadGroups() {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) {
        this.router.navigate(['/home']);
        return;
      }

      this.groups = await this.groupService.getUserGroups();
    } catch (error) {
      console.error(error);
      this.messageService.error('Erro ao carregar os grupos.');
      this.router.navigate(['/home']);
    } finally {
      this.loading = false;
    }
  }
}
