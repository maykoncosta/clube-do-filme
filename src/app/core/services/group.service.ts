import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { doc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private firestore: Firestore, private authService: AuthService) { }

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

  async joinGroup(groupId: string) {
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const groupRef = doc(this.firestore, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) throw new Error('Grupo não encontrado');

    const groupData = groupSnap.data();

    // Se o usuário ainda não é membro, adiciona
    if (!groupData['members'].includes(user.uid)) {
      await updateDoc(groupRef, {
        members: arrayUnion(user.uid)
      });
    }

    return groupData;
  }

  async getUserGroups() {
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const groupRef = collection(this.firestore, 'groups');
    const q = query(groupRef, where('members', 'array-contains', user.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async getGroupById(groupId: string) {
    const groupRef = doc(this.firestore, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) throw new Error('Grupo não encontrado');
    return { id: groupSnap.id, ...groupSnap.data() };
  }

  async getGroupWithDetails(groupId: string) {
    const groupRef = doc(this.firestore, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) throw new Error('Grupo não encontrado');
  
    const groupData = groupSnap.data();
    const creatorRef = doc(this.firestore, 'users', groupData['createdBy']);
    const creatorSnap = await getDoc(creatorRef);
    const creatorName = creatorSnap.exists() ? creatorSnap.data()['username'] : 'Desconhecido';
  
    const members: { uid: string; name: string }[] = [];
    for (const uid of groupData['members'] || []) {
      const userSnap = await getDoc(doc(this.firestore, 'users', uid));
      members.push({
        uid,
        name: userSnap.exists() ? userSnap.data()['username'] || uid : uid
      });
    }
  
    return {
      id: groupSnap.id,
      name: groupData['name'],
      createdAt: groupData['createdAt'],
      creatorName,
      members
    };
  }

}
