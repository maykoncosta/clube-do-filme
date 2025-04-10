import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {
  groups: any[] = [];
  loading = true;

  constructor(private groupService: GroupService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadGroups();
  }

  async loadGroups() {
    try {
      this.groups = await this.groupService.getUserGroups();
    } catch (error) {
      this.router.navigate(['/home']);
      this.messageService.error('Erro ao carregar os grupos.');
    } finally {
      this.loading = false;
    }
  }
}
