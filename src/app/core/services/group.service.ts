import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { doc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import { AuthService } from 'src/app/core/services/auth.service';

interface Group {
  id: string;
  name: string;
  createdBy: string;
  createdAt: any;
  members: (string | Member)[];
}

interface Member {
  uid: string;
  name: string;
  avatarSeed: string | null;
}


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

  async getUserGroups(): Promise<Group[]> {
    const uid = this.authService.currentUserUid();
    const groupsRef = collection(this.firestore, 'groups');
    const snapshot = await getDocs(groupsRef);

    const groups: Group[] = snapshot.docs
      .map(doc => ({ 
        id: doc.id, 
        ...(doc.data() as Omit<Group, 'id' | 'members'> & { members?: string[] }),
        members: doc.data()['members'] || [] // Ensure members is always an array
      }))
      .filter(group => uid && group.members.includes(uid));

    for (const group of groups) {
      const memberDataPromises = (group.members as string[]).map(async (memberUid: string): Promise<Member> => {
        const userRef = doc(this.firestore, 'users', memberUid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        return {
          uid: memberUid,
          name: userData['name'] || 'Usuário',
          avatarSeed: userData['avatarSeed'] || null
        };
      });

      group.members = await Promise.all(memberDataPromises);
    }

    return groups;
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
