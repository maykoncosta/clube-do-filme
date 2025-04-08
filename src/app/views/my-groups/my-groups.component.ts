import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {
  groups: any[] = [];
  loading = true;

  constructor(private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  async loadGroups() {
    try {
      this.groups = await this.groupService.getUserGroups();
    } catch (error) {
      this.router.navigate(['/home']);
      alert('Erro ao carregar o grupo.');
    } finally {
      this.loading = false;
    }
  }
}
