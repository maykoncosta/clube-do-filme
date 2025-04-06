import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async createGroup(name: string) {
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const groupData = {
      name,
      createdBy: user.uid,
      members: [user.uid],
      createdAt: new Date()
    };

    const groupRef = collection(this.firestore, 'groups');
    const docRef = await addDoc(groupRef, groupData);

    return docRef.id; // ID do grupo criado
  }
}
