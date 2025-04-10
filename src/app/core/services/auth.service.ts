import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {}

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigate(['/home']);
      });
  }

  async signUp(email: string, password: string, username: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (!user) throw new Error('Usuário não encontrado após cadastro.');

      const avatarSeed = username || Math.random().toString(36).substring(2, 10);
      // Atualiza o nome do usuário no Auth
      await updateProfile(user, { displayName: username });

      // Cria o documento do usuário no Firestore
      const userRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: username,
        avatarSeed: avatarSeed,
        createdAt: new Date()
      });
    } catch (error) {
      alert(error);
      throw error;
    }
  }

  isAuthenticated(): Observable<User | null> {
    return new Observable((observer) => {
      return onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe(); // evita múltiplas execuções
        resolve(user);
      });
    });
  }

  currentUserUid(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }
  
}
