import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from 'src/app/core/services/group.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { X, Pencil } from 'lucide-angular'; // ou 'lucide-react' se estiver usando React


@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {
  groups: any[] = [];
  loading = true;
  editingGroup: any = null;
  editedGroupName: string = '';
  showDeleteModal = false;
  groupToDeleteId: string | null = null;

  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

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

  async editGroupName(group: any) {
    const newName = prompt('Digite o novo nome do grupo:', group.name);
    if (newName && newName.trim() !== '' && newName !== group.name) {
      try {
        await this.groupService.updateGroupName(group.id, newName);
        group.name = newName;
        this.messageService.success('Nome do grupo atualizado com sucesso!');
      } catch (error) {
        console.error(error);
        this.messageService.error('Erro ao atualizar o nome do grupo.');
      }
    }
  }

  isGroupAdmin(group: any): boolean {
    const uid = this.authService.currentUserUid();
    return group.createdBy === uid;
  }

  openEditModal(group: any) {
    this.editingGroup = group;
    this.editedGroupName = group.name;
  }

  cancelEdit() {
    this.editingGroup = null;
    this.editedGroupName = '';
  }

  async confirmEditGroup() {
    const newName = this.editedGroupName.trim();
    if (newName && newName !== this.editingGroup.name) {
      try {
        await this.groupService.updateGroupName(this.editingGroup.id, newName);
        this.editingGroup.name = newName;
        this.messageService.success('Nome do grupo atualizado com sucesso!');
      } catch (error) {
        console.error(error);
        this.messageService.error('Erro ao atualizar o nome do grupo.');
      }
    }
    this.cancelEdit();
  }

  openDeleteModal(groupId: string) {
    this.groupToDeleteId = groupId;
    this.showDeleteModal = true;
  }

  async deleteGroupConfirmed() {
    if (this.groupToDeleteId) {
      await this.groupService.deleteGroup(this.groupToDeleteId);
      this.groups = this.groups.filter(g => g.id !== this.groupToDeleteId);
      this.messageService.success('Grupo excluído com sucesso!');
    }
    this.showDeleteModal = false;
    this.groupToDeleteId = null;
  }


}
