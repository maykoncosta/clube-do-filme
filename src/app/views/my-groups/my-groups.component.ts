import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {
  groups: any[] = [];
  loading = true;

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  async loadGroups() {
    try {
      this.groups = await this.groupService.getUserGroups();
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      this.loading = false;
    }
  }
}
