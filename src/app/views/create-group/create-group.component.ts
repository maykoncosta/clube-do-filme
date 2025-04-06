import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent {
  groupName: string = '';
  isLoading = false;

  constructor(
    private groupService: GroupService,
    private router: Router
  ) {}

  async onCreateGroup() {
    if (!this.groupName.trim()) {
      alert('O nome do grupo é obrigatório.');
      return;
    }

    this.isLoading = true;

    try {
      const groupId = await this.groupService.createGroup(this.groupName.trim());
      this.router.navigate(['/grupo', groupId]); // ou qualquer rota que direcione para o grupo
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      alert('Erro ao criar grupo. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }
}
