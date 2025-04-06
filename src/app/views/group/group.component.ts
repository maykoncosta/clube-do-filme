// group.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';

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

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) { }

  async ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id')!;
    this.inviteLink = `${window.location.origin}/convite/${this.groupId}`;
    this.loadGroup();
  }

  async loadGroup() {
    try {
      this.groupData = await this.groupService.joinGroup(this.groupId);
    } catch (err) {
      console.error('Erro ao entrar no grupo:', err);
      alert('Erro ao carregar o grupo.');
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
}
