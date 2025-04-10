import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';
import { MessageService } from 'src/app/core/services/message.service';

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
    private router: Router,
    private messageService: MessageService
  ) { }

  async onCreateGroup() {
    if (!this.groupName.trim()) {
      this.messageService.info('O nome do grupo é obrigatório.');
      return;
    }

    this.isLoading = true;

    try {
      const groupId = await this.groupService.createGroup(this.groupName.trim());
      this.messageService.success('Grupo criado com sucesso!');
      this.router.navigate(['/grupo', groupId]);
    } catch (error) {
      this.messageService.error('Erro ao criar o grupo. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }
}
