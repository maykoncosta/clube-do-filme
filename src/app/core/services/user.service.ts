// user.service.ts
import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Storage } from '@angular/fire/storage';
import { Auth } from '@angular/fire/auth';

export interface User {
  uid: string;
  email: string;
  username: string;
  avatarSeed?: string;
  createdAt: any;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private auth: Auth
  ) { }

  getCurrentUserId() {
    return this.auth.currentUser?.uid!;
  }

  async getUserData(uid: string) {
    const docRef = doc(this.firestore, 'users', uid);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  }

  async updateProfile(uid: string, newName: string, avatarSeed: string) {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { username: newName, avatarSeed: avatarSeed });
  }

  async savePreferences(uid: string, preferences: any) {
    if (!uid) return;

    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, {
      preferences: preferences
    });
  }
}
